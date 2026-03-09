from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Node
from datetime import datetime

# Temp data before database implementation
nodeData: Dict[str, dict] = {}
origins = ['http://localhost:5173', 'https://localhost:5173']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"API is working!"}



@app.post("/api/nodes")
async def receiveNodeData(data: Node):
    nodeData[data.hostname] = {
        "hostname": data.hostname,
        "localIP": data.localIP,
        "networkData": [connection.dict() for connection in data.networkData],
        "cpuCount": data.cpuCount,
        "cpuLoad": data.cpuLoad,
        "cpuTemp": data.cpuTemp,
        "memoryLoad": data.memoryLoad,
        "memoryTotal": data.memoryTotal,
        "lastSeen": datetime.now().isoformat()
    }
    
    print(f"Received data from {data.hostname}: {len(data.networkData)} connections")
    return{"status": "received"}

@app.get("/api/nodes")
def get_nodes():
    return list(nodeData.values())

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