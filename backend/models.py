from pydantic import BaseModel

class Event(BaseModel):
    id: int
    message: str
    node_id: int

class Node(BaseModel):
    id: int
    ip_addr: str
    status: bool
    hostname: str