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
    return {"API is working!"}

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
def get_nodes():
    return [
        {
        "id": 0,
        "hostname": "home",
        "ip_addr": "100.64.0.1",
        "cpu_temp": "48",
        "memory_used": "24%",
        "status": "Connected"
        },
        {
        "id": 1,
        "hostname": "nodeFriend",
        "ip_addr": "100.64.0.23",
        "cpu_temp": "61",
        "memory_used": "78%",
        "status": "Connected"
        },
        {
        "id": 2,
        "hostname": "home2",
        "ip_addr": "-",
        "cpu_temp": "-",
        "memory_used": "-",
        "status": "Disconnected"
        },
        {
        "id": 3,
        "hostname": "nodeFamily",
        "ip_addr": "100.64.0.49",
        "cpu_temp": "56",
        "memory_used": "30%",
        "status": "Connected"
        }
    ]
