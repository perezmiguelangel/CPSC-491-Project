from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"Hello"}

@app.get("/api/events")
def get_events():
    return [
        {
        "id": 1,
        "message": "Test Event",
        "node_id": 1
        },
        {
        "id": 2,
        "message": "Test Event 2",
        "node_id": 2
        }
    ]

@app.get("/api/nodes")
def get_events():
    return [
        {
        "id": 0,
        "ip_addr": "192.168.1.1",
        "status": True,
        "hostname": "miguelspc"
        },
        {
        "id": 2,
        "ip_addr": "192.168.1.253",
        "status": False,
        "hostname": "miguelsprankpc"
        }
    ]
