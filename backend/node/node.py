# Script to send appropriate node information to admin

import psutil, socket, requests

def getConnectionData():
    # inet gives both ipv4/6 
    connections = psutil.net_connections(kind='inet')
    print(f"Total Connections: {len(connections)}")
    connectionData = []

    #Need to figure out per process network io!!
    for x in connections:
        try:
            if x.status == 'ESTABLISHED' and x.raddr.ip:
                # Now for lookup of corresponding process
                process = psutil.Process(x.pid)
                connectionData.append({
                    "process_name": process.name(),
                    "remote_ip": x.raddr.ip,
                    "port": x.raddr.port,
                    "status": process.status()
                })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    
    return connectionData

# Need to account for cases not found, redo
def sendNodeData():
    hostname = socket.gethostname()
    localIP = socket.gethostbyname(hostname)
    data = {
        "hostname": socket.gethostname(),
        "localIP": localIP,
        "networkData": getConnectionData(),
        "cpuCount": psutil.cpu_count(),
        "cpuLoad": psutil.cpu_percent(interval=1, percpu=False),
        "cpuTemp": psutil.sensors_temperatures()['coretemp'][0].current,
        "memoryLoad": psutil.virtual_memory().percent,
        "memoryTotal": psutil.virtual_memory().total / (1024**3)
    }
    try:
        response = requests.post(
            "http://100.64.0.2:8000/api/nodes",
            json=data,
            timeout=5
        )
        print(f"Sent data")
    except:
        print(f"Failed to send data")



sendNodeData()

#print(getConnectionData())
