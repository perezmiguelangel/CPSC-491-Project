import {useState, useEffect} from "react";
import { UITable } from "@/components/UITable";
import { UICard } from "@/components/UICard";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { SnapshotViewer } from "@/components/SnapshotViewer";

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
    const [searchParams] = useSearchParams()
    const hostnameParam = searchParams.get("hostname")
    const startParam = searchParams.get("start")
    const endParam = searchParams.get("end")


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

    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    //const stringJson = JSON.stringify(nodes, null, 2);
    //console.log(stringJson);

    return(
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-3">
            <UICard title="Nodes" desc="Currently monitored nodes">
                <UITable caption={""} headers={["Host", "IP", "CPU Temp (°C)", "CPU Load (%)","CPU Count", "Memory Used (%)", "Memory Total",  "Last Seen"]}>
                    {nodes.map((item) => (
                        <TableRow key={item.hostname}>
                            <TableCell>{item.hostname}</TableCell>
                            <TableCell>{item.localIP}</TableCell>
                            <TableCell>{item.cpuTemp} °C</TableCell>
                            <TableCell>{item.cpuLoad} %</TableCell>
                            <TableCell>{item.cpuCount}</TableCell>
                            <TableCell>{item.memoryLoad} %</TableCell>
                            <TableCell>{item.memoryTotal.toFixed(2)} GB</TableCell>
                            <TableCell>
                                <Badge className={badgeStyles[item.lastSeen]}>
                                    {formatDateTime(item.lastSeen)}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </UITable>
            </UICard>
            
            </div> 
            <div className="lg:col-span-3">

            <UICard title="Historical Process & Network Data" desc="Manually search or use graph on dashboard to inspect data during time range">
                <SnapshotViewer hostname={hostnameParam ?? "homelab"} initialStart={startParam ?? undefined} initialEnd={endParam ?? undefined} />
            </UICard>
            
            </div> 
           
        </div>
    )
}