# server/gps_stream.py
import socket
import pynmea2
from geopy.distance import geodesic
from math import atan2, degrees, radians, sin, cos
from fastapi import APIRouter, WebSocket
import asyncio
import time
import select

router = APIRouter()

HOST = "10.255.185.63"  # Your phone's IP
PORT = 8080

def calculate_car_toll(distance_km):
    return round(distance_km * 1.7, 2)

def calculate_bearing(p1, p2):
    lat1, lon1 = map(radians, p1)
    lat2, lon2 = map(radians, p2)
    dlon = lon2 - lon1
    x = sin(dlon) * cos(lat2)
    y = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dlon)
    brng = atan2(x, y)
    return (degrees(brng) + 360) % 360

@router.websocket("/ws/gps")
async def gps_websocket(ws: WebSocket):
    await ws.accept()
    
    sock = None
    last_point = None
    last_bearing = None
    total_distance_m = 0.0  # ✅ Changed to meters
    straight_distance = 0.0
    MIN_STEP = 0.05  # meters
    TURN_THRESHOLD = 45  # degrees
    CHECK_AFTER = 2.0  # meters
    last_activity_time = time.time()
    trip_ended = False

    print("🚗 GPS Tracking Started - Waiting for data...")
    print(f"📱 Connected to: {HOST}:{PORT}")
    print("🔄 Turn detection active | Threshold: 45° | Min distance: 2m")

    try:
        # Create socket connection
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(30)
        
        await ws.send_json({"event": "status", "message": f"Connecting to {HOST}:{PORT}..."})
        
        # Connect with timeout
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: sock.connect((HOST, PORT)))
        
        await ws.send_json({"event": "status", "message": "Connected to GPS device!"})
        last_activity_time = time.time()
        
        print("✅ Successfully connected to GPS device!")
        print("📊 Live data streaming started...")

        while not trip_ended:
            try:
                # Check if WebSocket is still connected (non-blocking)
                try:
                    await asyncio.wait_for(ws.receive_text(), timeout=0.1)
                except asyncio.TimeoutError:
                    pass
                
                # Check for data with select
                ready, _, _ = select.select([sock], [], [], 1)
                if not ready:
                    # Send keep-alive ping every 10 seconds
                    if time.time() - last_activity_time > 10:
                        await ws.send_json({"event": "ping", "message": "keep-alive"})
                        last_activity_time = time.time()
                    continue
                
                data = sock.recv(1024)
                if not data:
                    print("❌ No data received from GPS device")
                    break
                    
                last_activity_time = time.time()
                decoded_data = data.decode("utf-8", errors="ignore")
                
                for line in decoded_data.split("\n"):
                    if trip_ended:
                        break
                        
                    line = line.strip()
                    if not line:
                        continue
                        
                    if line.startswith("$GPGGA") or line.startswith("$GPRMC"):
                        try:
                            msg = pynmea2.parse(line)
                            if (hasattr(msg, 'latitude') and hasattr(msg, 'longitude') and 
                                msg.latitude is not None and msg.longitude is not None):
                                
                                current_point = (float(msg.latitude), float(msg.longitude))
                                step_m = 0.0

                                if last_point:
                                    step_m = geodesic(last_point, current_point).meters
                                    if step_m < MIN_STEP:
                                        print(f"⚡ Small movement: {step_m:.3f}m (ignored)")
                                        continue

                                    # ✅ All calculations in meters now
                                    total_distance_m += step_m  # ✅ Meters
                                    straight_distance += step_m  # ✅ Meters

                                    bearing = calculate_bearing(last_point, current_point)
                                    
                                    print(f"🧭 Current Bearing: {bearing:.1f}° | Total Distance: {total_distance_m:.2f}m")  # ✅ Meters

                                    if last_bearing is not None:
                                        diff = abs(bearing - last_bearing)
                                        diff = min(diff, 360 - diff)
                                        
                                        print(f"📐 Angle Change: {diff:.1f}° | Straight distance: {straight_distance:.2f}m")
                                        
                                        # In the turn detection section, update the WebSocket message:
                                        if straight_distance > CHECK_AFTER and diff > TURN_THRESHOLD:
                                            # 🎯 TURN DETECTED - END TRIP
                                            print(f"🔄 TURN DETECTED! Δ{diff:.1f}° | Total: {total_distance_m:.2f}m")
                                            print("📍" + "="*50)
                                            print("🚫 Trip ended due to turn detection")
                                            
                                            total_distance_km = total_distance_m / 1000
                                            current_toll = calculate_car_toll(total_distance_km)  # ✅ Calculate toll for turn event
                                            
                                            await ws.send_json({
                                                "event": "turn",
                                                "bearing_diff": diff,
                                                "total_distance_m": total_distance_m,
                                                "current_toll": current_toll,  # ✅ Add toll to turn event
                                                "message": "Trip ended: Turn detected"
                                            })
                                            
                                            trip_ended = True
                                            break
                                    
                                    last_bearing = bearing

                                # Only continue if trip hasn't ended
                                if not trip_ended:
                                    total_distance_km = total_distance_m / 1000  # ✅ Convert meters to km
                                    current_toll = calculate_car_toll(total_distance_km)
                                    
                                    if last_point and step_m >= MIN_STEP:
                                        print(f"📈 Step: {step_m:.2f}m | Total: {total_distance_m:.2f}m | Toll: ₹{current_toll:.2f}")  # ✅ Meters
                                    elif not last_point:
                                        print(f"📍 First position: {current_point[0]:.6f}, {current_point[1]:.6f}")
                                    
                                    await ws.send_json({
                                        "event": "update",
                                        "step_m": step_m if last_point else 0,  # ✅ Meters
                                        "bearing": bearing if last_point else 0,
                                        "total_distance_m": round(total_distance_m, 2),  # ✅ Meters
                                        "total_distance_km": round(total_distance_km, 2),
                                        "current_toll": current_toll,
                                        "rate_per_km": 1.7,
                                        "coordinates": f"{current_point[0]:.6f}, {current_point[1]:.6f}"
                                    })

                                    last_point = current_point
                                
                        except pynmea2.ParseError:
                            print("⚠️  Failed to parse NMEA data")
                            continue
                        except Exception as e:
                            print(f"⚠️  Error: {str(e)}")
                            await ws.send_json({"event": "warning", "message": f"Parse error: {str(e)}"})
                
                if trip_ended:
                    break
                            
            except socket.timeout:
                if time.time() - last_activity_time > 15:
                    print("⏰ GPS device timeout - no data for 15 seconds")
                    raise Exception("GPS device timeout")
                continue
            except Exception as e:
                print(f"❌ Data error: {str(e)}")
                await ws.send_json({"event": "error", "message": f"Data error: {str(e)}"})
                break
                
    except ConnectionRefusedError:
        error_msg = f"Connection refused. Check GPS app on {HOST}:{PORT}"
        print(f"❌ {error_msg}")
        await ws.send_json({"event": "error", "message": error_msg})
    except Exception as e:
        error_msg = f"Connection error: {str(e)}"
        print(f"❌ {error_msg}")
        await ws.send_json({"event": "error", "message": error_msg})
        
    # In the finally section, make sure final_toll is calculated:
    finally:
    # Send final distance before closing
        total_distance_km = total_distance_m / 1000
        final_toll = calculate_car_toll(total_distance_km)
        
        print("="*60)
        print(f"🏁 TRIP COMPLETED")
        print(f"📏 Final Distance: {total_distance_m:.2f}m")
        print(f"📏 In Kilometers: {total_distance_km:.3f}km")
        print(f"💰 Final Toll: ₹{final_toll:.2f}")
        print("="*60)
        
        # Only send final update if trip wasn't already ended by a turn
        if not trip_ended:
            await ws.send_json({
                "event": "complete",
                "total_distance_m": total_distance_m,
                "total_distance_km": total_distance_km,
                "final_toll": final_toll,
                "message": "Trip completed normally"
            })
        
        if sock:
            sock.close()
        print("🔌 Socket connection closed")