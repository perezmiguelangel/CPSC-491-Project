from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from models import Node, nodeDB, Base, nodeSnapshotDB
from datetime import datetime
from typing import Dict, Set
from sqlalchemy.orm import Session
from database import getDB, engine, Base
from urllib.parse import unquote


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

activeConnections: Set[WebSocket] = set()
@app.websocket("/ws")
async def websocketEndpoint(websocket: WebSocket):
    await websocket.accept()
    activeConnections.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        activeConnections.remove(websocket)


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
        node.lastSeen = datetime.utcnow()
    else:
        node = nodeDB(**data.dict(), lastSeen=datetime.utcnow())
        db.add(node)


    # Historical data save
    snapshot = nodeSnapshotDB(
    hostname=data.hostname,
    timestamp=datetime.utcnow(),
    cpuLoad=data.cpuLoad,
    cpuTemp=data.cpuTemp,
    memoryLoad=data.memoryLoad,
    networkData=[connection.dict() for connection in data.networkData],
    netIOcounters=data.netIOcounters.dict(),
    dockerData=[container.dict() for container in data.dockerData]
    )
    db.add(snapshot)
    #
    
    db.commit()

    # 
    dataSend = data.dict()
    dataSend["lastSeen"] = datetime.utcnow().isoformat()
    #

    for connection in activeConnections:
        await connection.send_json(dataSend)

    return{"status": "received"}

@app.get("/api/nodes/{hostname}/snapshots/range")
def get_snapshots_range(hostname: str, start: str, end: str, db: Session = Depends(getDB)):
    start_dt = datetime.fromisoformat(unquote(start))
    end_dt = datetime.fromisoformat(unquote(end))

    snapshots = db.query(nodeSnapshotDB).filter(nodeSnapshotDB.hostname == hostname)\
                                        .filter(nodeSnapshotDB.timestamp >= start_dt)\
                                        .filter(nodeSnapshotDB.timestamp <= end_dt)\
                                        .order_by(nodeSnapshotDB.timestamp.asc())\
                                        .all()
    return [
        {
            "hostname": s.hostname,
            "timestamp": s.timestamp.isoformat(),
            "cpuLoad": s.cpuLoad,
            "memoryLoad": s.memoryLoad,
            "networkData": s.networkData,
            "dockerData": s.dockerData,
            "netIOcounters": s.netIOcounters
        }
        for s in snapshots
    ]

@app.get("/api/nodes/{hostname}/snapshots")
def get_snapshots(hostname: str, db: Session = Depends(getDB)):
    snapshots = db.query(nodeSnapshotDB).filter(nodeSnapshotDB.hostname == hostname)\
                                        .order_by(nodeSnapshotDB.timestamp.desc())\
                                        .limit(100)\
                                        .all()
    
    snapshots = list(reversed(snapshots))

    return [
        {
            "hostname": s.hostname,
            "timestamp": s.timestamp.isoformat(),
            "cpuLoad": s.cpuLoad,
            "memoryLoad": s.memoryLoad,
            "networkConnections": len(s.networkData) if s.networkData else 0,
            "dockerData": s.dockerData,
            "netIOcounters": s.netIOcounters
        }
        for s in snapshots
    ]

@app.get("/api/nodes")
def get_nodes(db: Session = Depends(getDB)):
    return db.query(nodeDB).all()

