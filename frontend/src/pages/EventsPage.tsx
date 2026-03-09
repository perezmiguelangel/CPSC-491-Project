import { UITable } from "@/components/UITable"
import { UICard } from "@/components/UICard"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Table } from "lucide-react"

const badgeStyles: Record<string, string> = {
    High: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    Medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    Info: ""
}

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

export default function EventsPage(){
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

            const interval = setInterval(fetchNodes, 5000)
            return () => clearInterval(interval)
    
        }, []);


    return(
        <div className="">
            <UICard title="Events" desc="Current Network Events">
                <UITable caption={""} headers={["Node", "Process", "Remote IP", "Port", "Status"]}>
                    {nodes.map((node) => 
                        node.networkData.map((connection, index) => (
                            <TableRow key={`${node.hostname}-${index}`}>
                                <TableCell>{node.hostname}</TableCell>
                                <TableCell>{connection.process_name}</TableCell>
                                <TableCell>{connection.remote_ip.split('.').slice(0,2).join('.')}.***.**</TableCell>
                                <TableCell>{connection.port}</TableCell>
                                <TableCell>{connection.status}</TableCell>

                            </TableRow>
                        ))
                    )}
                </UITable>
            </UICard>
        </div>
    )
}