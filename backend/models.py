from pydantic import BaseModel

class Node(BaseModel):
    id: int
    hostname: str
    ip_addr: str
    cpu_temp: str
    memory_used: str
    status: str


class Event(BaseModel):
    id: int
    message: str
    node_id: int

