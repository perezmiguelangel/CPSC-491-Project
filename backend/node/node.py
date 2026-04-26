# Script to send appropriate node information to admin

import psutil, socket, requests, time, docker
import json

def getConnectionData():
    # inet gives both ipv4/6 
    connections = psutil.net_connections(kind='inet')
    print(f"Total Connections: {len(connections)}")
    connectionData = []

    #Need to figure out per process network io!!
    for x in connections:
        try:
            if x.status in ['ESTABLISHED', 'LISTEN']:
                # Now for lookup of corresponding process
                remoteIP = x.raddr.ip if x.raddr else "Local"
                remotePort = x.raddr.port if x.raddr else None
                
                processName = "System"
                if x.pid:
                    process = psutil.Process(x.pid)
                    processName = process.name()
                
                connectionData.append({
                    "process_name": processName,
                    "local_port": x.laddr.port,
                    "remote_ip": remoteIP,
                    "remote_port": remotePort,
                    "status": x.status
                })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    
    #print(connectionData)

    return connectionData

def getDockerData():
    try:
        client = docker.from_env()
        containerData = []
        for c in client.containers.list():
            containerData.append({"name": c.name, "status": c.status})
        
        return containerData
    except:
        print(f"getDockerData: Docker is not running!")
        return []
        

def getNetIOCounters():
    try:
        netIO = psutil.net_io_counters()
        bytesSent = netIO[0]
        bytesRecv = netIO[1]
        packtSent = netIO[2]
        packtRecv = netIO[3]
        result = {"bytesSent": bytesSent, 
                  "bytesRecv": bytesRecv, 
                  "packtSent": packtSent, 
                  "packtRecv": packtRecv}
        return result
    except:
        print("whoops")
        return {"bytesSent": 0, 
                "bytesRecv": 0, 
                "packtSent": 0, 
                "packtRecv": 0}


def sendNodeData():
    hostname = socket.gethostname()
    localIP = socket.gethostbyname(hostname)

    cpuTemp = 0
    netIOcounters = None
    try:
        cpuTemp = psutil.sensors_temperatures()['coretemp'][0].current
    except:
        print(f"Error in reading cpuTemp (Try)")
    data = {
        "hostname": socket.gethostname(),
        "localIP": localIP,
        "networkData": getConnectionData(),
        "cpuCount": psutil.cpu_count(),
        "cpuLoad": psutil.cpu_percent(interval=1, percpu=False),
        "cpuTemp": cpuTemp,
        "memoryLoad": psutil.virtual_memory().percent,
        "memoryTotal": psutil.virtual_memory().total / (1024**3),
        "dockerData": getDockerData() or [],
        "netIOcounters": getNetIOCounters()
    }
    #print(f"DockerData: {getDockerData()}\nnetIOcounters: {getNetIOCounters()}")
    #print(json.dumps(data, indent=2))
    
    try:
        response = requests.post(
            "http://100.64.0.2:8000/api/nodes",
            json=data,
            timeout=5
        )
        print(f"Sent data")
    except:
        print(f"Failed to send data")

if __name__ == "__main__":
    while True:
        sendNodeData()
        time.sleep(5)

