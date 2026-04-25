from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from models import Node, nodeDB, Base
from datetime import datetime
from typing import Dict
from sqlalchemy.orm import Session
from database import getDB, engine, Base


Base.metadata.create_all(bind=engine)

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
async def receiveNodeData(data: Node, db: Session = Depends(getDB)):
    node = db.query(nodeDB).filter(nodeDB.hostname == data.hostname).first()
    if node:
        node.localIP = data.localIP
        node.networkData = [connection.dict() for connection in data.networkData]
        node.cpuCount = data.cpuCount
        node.cpuLoad = data.cpuLoad
        node.cpuTemp = data.cpuTemp
        node.memoryLoad = data.memoryLoad
        node.memoryTotal = data.memoryTotal
        node.dockerData = [container.dict() for container in data.dockerData]
        node.netIOcounters = data.netIOcounters.dict()
        node.lastSeen = datetime.now()
    else:
        node = nodeDB(**data.dict(), lastSeen=datetime.now())
        db.add(node)
    
    db.commit()
    return{"status": "received"}


@app.get("/api/nodes")
def get_nodes(db: Session = Depends(getDB)):
    return db.query(nodeDB).all()

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