from pydantic import BaseModel

class ConnectionData(BaseModel):
    process_name: str
    remote_ip: str
    port: int
    status: str

class Node(BaseModel):
    hostname: str
    localIP: str
    networkData: list[ConnectionData]
    cpuCount: int
    cpuLoad: float
    cpuTemp: float
    memoryLoad: float
    memoryTotal: float

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



