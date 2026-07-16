import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Target, Route, Play, Square, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Tracking: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [liveData, setLiveData] = useState({
    distance: 0, // in meters
    toll: 0,
    speed: 0
  });
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { toast } = useToast();

  // Timer for current time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // WebSocket connection for GPS data
  useEffect(() => {
    let webSocket: WebSocket | null = null;

    if (isTracking) {
      webSocket = new WebSocket('ws://127.0.0.1:8000/ws/gps');
      
      webSocket.onopen = () => {
        console.log("WebSocket connection opened");
        setConnectionError(null);
      };

      webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received:", data);
        
        if (data.event === "update") {
          setLiveData(prev => ({
            ...prev,
            distance: data.total_distance_m,
            toll: data.current_toll, // ✅ Use exact value from backend
            speed: data.speed || prev.speed
          }));
        } 
        else if (data.event === "trip_complete") {
          setLiveData(prev => ({
            ...prev,
            distance: data.final_distance_m,
            toll: data.final_toll // ✅ Use final_toll from backend
          }));
          setIsTracking(false);
          setConnectionError(null);
          
          toast({
            title: "Trip Completed",
            description: `Final distance: ${data.final_distance_m}m, Toll: ₹${data.final_toll}`,
            variant: "default",
          });
        }
        else if (data.event === "turn") {
          setLiveData(prev => ({
            ...prev,
            distance: data.total_distance_m,
            toll: data.current_toll // ✅ Use current_toll from backend
          }));
          setIsTracking(false);
          setConnectionError(null);
          
          toast({
            title: "Turn Detected - Trip Ended",
            description: `Turn detected! Final distance: ${data.total_distance_m}m, Toll: ₹${data.current_toll}`,
            variant: "default",
          });
        }
        else if (data.event === "error") {
          setIsTracking(false);
          setConnectionError(data.message);
          
          toast({
            title: "Tracking Error",
            description: data.message,
            variant: "destructive",
          });
        }
        else if (data.event === "status") {
          console.log("Status:", data.message);
        }
      };

      webSocket.onclose = (event) => {
        console.log("WebSocket connection closed", event.code, event.reason);
        if (isTracking) {
          setIsTracking(false);
          setConnectionError("Connection to server lost");
        }
      };

      webSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsTracking(false);
        setConnectionError("WebSocket connection failed");
      };

      setWs(webSocket);
    }

    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, [isTracking, toast]);

  const startTracking = () => {
    setIsTracking(true);
    setConnectionError(null);
    setLiveData({ distance: 0, toll: 0, speed: 0 });
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (ws) {
      ws.close();
    }
    setWs(null);
    
    toast({
      title: "Tracking Stopped",
      description: "GPS tracking has been stopped manually",
      variant: "default",
    });
  };

  // Mock data for fallback and static information
  const mockGPSData = {
    currentLocation: {
      lat: 11.0168,
      lng: 76.9558,
      address: "NH-44, Near Coimbatore Bypass, Tamil Nadu",
    },
    tripData: {
      startTime: "14:30:00",
      route: "Chennai to Coimbatore",
    },
    recentLocations: [
      { time: "16:45", location: "NH-44, Near Coimbatore Bypass", lat: 11.0168, lng: 76.9558 },
      { time: "16:30", location: "NH-44, Erode Junction", lat: 11.3410, lng: 77.7172 },
      { time: "16:15", location: "NH-44, Salem Bypass", lat: 11.6643, lng: 78.1460 },
      { time: "16:00", location: "NH-44, Dharmapuri", lat: 12.1211, lng: 78.1575 },
      { time: "15:45", location: "NH-44, Krishnagiri", lat: 12.5266, lng: 78.2140 },
    ],
  };

  const entryExitHistory = [
    {
      time: "14:30:00",
      type: "Entry",
      location: "Chennai Toll Plaza - NH-44",
      coordinates: "13.0827° N, 80.2707° E",
    },
    {
      time: "15:15:00",
      type: "Checkpoint",
      location: "Poonamallee - NH-44",
      coordinates: "13.0474° N, 80.0969° E",
    },
    {
      time: "15:45:00",
      type: "Checkpoint",
      location: "Krishnagiri - NH-44",
      coordinates: "12.5266° N, 78.2140° E",
    },
  ];

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">GPS Tracking</h1>
            <p className="text-muted-foreground">
              Real-time location tracking and trip analytics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge 
              variant={isTracking ? "default" : "secondary"} 
              className={isTracking ? "bg-success" : connectionError ? "bg-destructive" : "bg-gray-500"}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isTracking ? "bg-white animate-pulse" : 
                connectionError ? "bg-white" : "bg-gray-300"
              }`}></div>
              {connectionError ? "Connection Error" : isTracking ? "Tracking Active" : "Tracking Stopped"}
            </Badge>
            {isTracking ? (
              <Button variant="destructive" onClick={stopTracking} className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Stop Tracking
              </Button>
            ) : (
              <Button variant="default" onClick={startTracking} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Tracking
              </Button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {connectionError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Connection Error</p>
              <p className="text-sm text-destructive/80">{connectionError}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startTracking}
              className="ml-auto"
            >
              Retry Connection
            </Button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Map Placeholder */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Live Tracking Map
                </CardTitle>
                <CardDescription>
                  {isTracking ? "Real-time vehicle location" : "Tracking not active - click Start to begin"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Map Placeholder */}
                <div className={`aspect-video rounded-lg border-2 border-dashed flex items-center justify-center ${
                  isTracking 
                    ? "bg-gradient-to-br from-primary/5 to-accent/5 border-border" 
                    : connectionError
                    ? "bg-destructive/5 border-destructive/30"
                    : "bg-muted/50 border-muted"
                }`}>
                  <div className="text-center space-y-4">
                    <div className={`p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center ${
                      isTracking ? "gradient-primary" : 
                      connectionError ? "bg-destructive" : "bg-muted"
                    }`}>
                      <MapPin className={`h-8 w-8 ${
                        isTracking ? "text-white" : 
                        connectionError ? "text-white" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {connectionError ? "Connection Error" : 
                         isTracking ? "Live Tracking Active" : "Tracking Paused"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {connectionError ? "Failed to connect to GPS server" : 
                         isTracking ? "Real-time GPS data streaming" : "Click Start to begin tracking"}
                      </p>
                      {!isTracking && !connectionError && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Last known: {mockGPSData.currentLocation.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Current Location Info */}
                {isTracking && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Current Location</p>
                        <p className="text-xs text-muted-foreground">
                          {mockGPSData.currentLocation.lat}°N, {mockGPSData.currentLocation.lng}°E
                        </p>
                      </div>
                      <Badge variant="default" className="bg-success">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        Live
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Locations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-accent" />
                  Location History
                </CardTitle>
                <CardDescription>
                  {isTracking ? "Live location updates" : "Historical data from previous trips"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockGPSData.recentLocations.map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">{location.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {location.lat}°N, {location.lng}°E
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{location.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Trip Analytics */}
          <div className="space-y-6">
            {/* Current Trip Stats - Updated with Live Data */}
            <Card className="shadow-lg border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-accent" />
                  {isTracking ? "Live Trip Summary" : "Trip Summary"}
                </CardTitle>
                <CardDescription>
                  {isTracking ? mockGPSData.tripData.route : "Start tracking to see live data"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 py-4">
                  <div className="text-center">
                    <div className={`p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center ${
                      isTracking ? "gradient-primary" : "bg-muted"
                    }`}>
                      <Target className={`h-6 w-6 ${isTracking ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {liveData.distance.toFixed(1)} m
                    </p>
                    <p className="text-sm text-muted-foreground">Distance Covered</p>
                    <p className="text-xs text-muted-foreground">
                      ({(liveData.distance / 1000).toFixed(2)} km)
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center ${
                      isTracking ? "bg-accent" : "bg-muted"
                    }`}>
                      <span className={`font-bold text-lg ${isTracking ? "text-white" : "text-muted-foreground"}`}>
                        ₹
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-accent">
                      ₹{liveData.toll.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Current Toll</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entry/Exit History */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Entry/Exit History
                </CardTitle>
                <CardDescription>
                  Trip checkpoints and toll plaza entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entryExitHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 border border-border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div 
                          className={`w-3 h-3 rounded-full mt-1 ${
                            entry.type === 'Entry' 
                              ? 'bg-success' 
                              : entry.type === 'Exit' 
                              ? 'bg-destructive' 
                              : 'bg-accent'
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{entry.location}</p>
                          <Badge 
                            variant={
                              entry.type === 'Entry' 
                                ? 'default' 
                                : entry.type === 'Exit' 
                                ? 'destructive' 
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {entry.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.coordinates}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trip Controls */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Trip Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isTracking ? (
                  <Button variant="destructive" onClick={stopTracking} className="w-full flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Stop Current Trip
                  </Button>
                ) : (
                  <Button variant="default" onClick={startTracking} className="w-full flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start New Trip
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-full" disabled={!liveData.distance}>
                  Export Trip Data
                </Button>
                <Button variant="ghost" size="sm" className="w-full">
                  Trip Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;