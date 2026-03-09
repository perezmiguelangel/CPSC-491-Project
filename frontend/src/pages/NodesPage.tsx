import {useState, useEffect} from "react";
import { UITable } from "@/components/UITable";
import { UICard } from "@/components/UICard";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface nodeData {
    hostname: string,
    localIP: string,
    cpuTemp: number,
    cpuLoad: number,
    cpuCount: number,
    memoryLoad: number,
    memoryTotal: number,
    lastSeen: string,
    networkData: any[]
}

const badgeStyles: Record<string, string> = {
    Disconnected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    Connected: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
}

export default function NodesPage(){
    const [nodes, setNodes] = useState<nodeData[]>([]);

    useEffect(() => {
        const fetchNodes = async () => {
            const response = await fetch("http://localhost:8000/api/nodes")
            const data = await response.json()
            setNodes(data)
        }
        try
        {
            fetchNodes()
        }
        catch(error)
        {
            console.error('Error', error);
        }


        //console.log(nodes);
        const interval = setInterval(fetchNodes, 5000)
        return () => clearInterval(interval)

    }, []);

    //const stringJson = JSON.stringify(nodes, null, 2);
    //console.log(stringJson);

    return(
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-3">
            <UICard title="Nodes" desc="Currently monitored nodes">
                <UITable caption={""} headers={["Host", "IP", "CPU Temp (C)", "CPU Load (%)","CPU Count", "Memory Used (%)", "Memory Total",  "Status"]}>
                    {nodes.map((item) => (
                        <TableRow key={item.hostname}>
                            <TableCell>{item.hostname}</TableCell>
                            <TableCell>{item.localIP}</TableCell>
                            <TableCell>{item.cpuTemp}</TableCell>
                            <TableCell>{item.cpuLoad}</TableCell>
                            <TableCell>{item.cpuCount}</TableCell>
                            <TableCell>{item.memoryLoad}</TableCell>
                            <TableCell>{item.memoryTotal}</TableCell>
                            <TableCell>
                                <Badge className={badgeStyles[item.lastSeen]}>
                                    {item.lastSeen}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </UITable>
            </UICard>
            
            </div> 
            <UICard title="Summary" desc="Node Stats Summary" footer="">
                <div>
                    Total Nodes: {nodes.length}
                </div>
                <div>
                    Total Online: {nodes.filter(n => n.lastSeen === "Connected").length}
                </div>
            </UICard>
        </div>
    )
}