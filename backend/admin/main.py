from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Node

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

@app.post("/api/nodes")
async def receiveNodeData(data: Node):
    print(f"Received data from {data.hostname}: {len(data.networkData)} connections")
    return{"status": "received"}