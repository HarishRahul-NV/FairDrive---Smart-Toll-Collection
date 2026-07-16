# server/main.py
from fastapi import FastAPI
from server.gps_stream import router as gps_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GPS Tracking API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gps_router)

@app.get("/")
def read_root():
    return {"message": "GPS Tracking Server is running!", "status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "gps_tracker"}