import { UICard } from "@/components/UICard"
import { UITable } from "@/components/UITable"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LiveBadge } from "@/components/ui/LiveBadge"
import { NodeProcNetChart } from "@/components/NodeProcNetChart"
import { Select, SelectContent, SelectGroup, SelectItem,
         SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

const badgeStyles: Record<string, string> = {
    Disconnected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    Connected: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
}

interface nodeData {
    hostname: string,
    localIP: string,
    networkData: any[]
    cpuCount: number,
    cpuLoad: number,
    cpuTemp: number,
    memoryLoad: number,
    memoryTotal: number,
    dockerData: any[],
    netIOcounters: any[],
    lastSeen: string,
}

export default function DashboardPage(){
    const [nodes, setNodes] = useState<nodeData[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [selectedHostname, setSelectedHostname] = useState<string>("homelab")
    
        useEffect(() => {
            const fetchInitNodes = async () => {
                try{
                    const response = await fetch("http://127.0.0.1:8000/api/nodes")
                    const data = await response.json()
                    setNodes(data)
                }
                catch(error){
                    console.error("Error fetching init. nodes", error)
                }
            }

            fetchInitNodes();

            const webSocket = new WebSocket("ws://127.0.0.1:8000/ws")

            webSocket.onmessage = (event) => {
                const incomingNode = JSON.parse(event.data)

                setNodes((prevNodes) => {
                    const existingIndex = prevNodes.findIndex(n => n.hostname === incomingNode.hostname);
                    if(existingIndex !== -1){
                        //replacing old data
                        const newNodes = [...prevNodes];
                        newNodes[existingIndex] = incomingNode;
                        return newNodes;
                    }
                    else{
                        return [...prevNodes, incomingNode];
                    }
                });
                setRefreshTrigger(prev => prev + 1)
            };

            return () => webSocket.close();
        
            }, []);

    return(
        <div className="grid gap-4">
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                
                <div className="lg:col-span-2">
                    <UICard title="Nodes" desc="">
                        <UITable caption={"Visit Nodes page for more"} headers={["Host", "IP", "CPU Temp.", "Memory Used", "Status"]}>
                            {nodes.map((item) => (
                                <TableRow key={item.hostname}>
                                    <TableCell>{item.hostname}</TableCell>
                                    <TableCell>{item.localIP}</TableCell>
                                    <TableCell>{item.cpuTemp}°C</TableCell>
                                    <TableCell>{item.memoryLoad}%</TableCell>
                                    <TableCell>
                                        <LiveBadge lastSeen={item.lastSeen} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </UITable>    
                    </UICard>
                </div>
                <div className="">
                    
                    <UICard className="" title="Active Docker Containers" desc="" footer="">
                        <ScrollArea className="h-72 rounded-md">
                        <UITable caption={""} headers={["Name", "Status"]}>
                                {nodes.map((item) => (
                                    item.dockerData && item.dockerData.map((container, index) => (
                                        <TableRow key={`${item.hostname}-docker-${index}`}>
                                            <TableCell>{container.name}</TableCell>
                                            <TableCell>
                                                <Badge className={container.status.includes('running') ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                                                    {container.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                
                                ))}
                            </UITable>
                            </ScrollArea>
                    </UICard>
                    
                </div>
            </div>

            <UICard className="" title="Network History & Metrics" desc="CPU, memory, and network connections over time" footer="">
                <Select value={selectedHostname} onValueChange={setSelectedHostname}>
                    <SelectTrigger className="w-45 mb-4">
                        <SelectValue placeholder="Select a node" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Nodes</SelectLabel>
                            {nodes.map((node) => (
                                <SelectItem key={node.hostname} value={node.hostname}>
                                    {node.hostname}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <NodeProcNetChart hostname={selectedHostname} refreshTrigger={refreshTrigger} />
            </UICard>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <UICard title="Stats" desc="This is a desc" footer="footer">
                <div className="font-bold">Test children</div>
            </UICard>
            </div>
            </div>
    )
}