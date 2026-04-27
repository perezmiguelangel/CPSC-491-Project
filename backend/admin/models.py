from pydantic import BaseModel
from typing import List, Optional, Dict, Union
from sqlalchemy import Column, String, Float, Integer, JSON, DateTime
from database import Base
from datetime import datetime

class nodeDB(Base):
    __tablename__ = "nodes"
    hostname = Column(String, primary_key=True)
    localIP = Column(String)
    networkData = Column(JSON)
    cpuCount = Column(Integer)
    cpuLoad = Column(Float)
    cpuTemp = Column(Float)
    memoryLoad = Column(Float)
    memoryTotal = Column(Float)
    dockerData = Column(JSON)
    netIOcounters = Column(JSON)
    lastSeen = Column(DateTime, default=datetime.now)

class nodeSnapshotDB(Base):
    __tablename__ = "snapshots"
    id = Column(Integer, primary_key=True, autoincrement=True)
    hostname = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.now)
    cpuLoad = Column(Float)
    cpuTemp = Column(Float)
    memoryLoad = Column(Float)
    networkData = Column(JSON)
    netIOcounters = Column(JSON)
    dockerData = Column(JSON)

class ConnectionData(BaseModel):
    process_name: str
    local_port: Optional[int] = None
    remote_ip: str
    remote_port: Optional[int] = None
    status: str
    remote_ip_hostname: str

class DockerContainer(BaseModel):
    name: str
    status: str

class netIOCounters(BaseModel):
    bytesSent: int
    bytesRecv: int
    packtSent: int
    packtRecv: int

class Node(BaseModel):
    hostname: str
    localIP: str
    networkData: list[ConnectionData]
    cpuCount: int
    cpuLoad: float
    cpuTemp: float
    memoryLoad: float
    memoryTotal: float
    dockerData: list[DockerContainer] = []
    netIOcounters: netIOCounters


class NetworkTraffic(BaseModel):
    id: int
    node_id: int
    process_name: str
    process_id: int
    user_name: str
    protocol: str
    host_name: str
    port_num: int
    remote_ip: str

class Event(BaseModel):
    id: int
    message: str
    node_id: int



