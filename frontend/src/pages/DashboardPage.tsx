import { UICard } from "@/components/UICard"
import { ChartAreaInteractive } from "@/components/ChartTest"
import { UITable } from "@/components/UITable"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const badgeStyles: Record<string, string> = {
    Disconnected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    Connected: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
}

export default function DashboardPage(){
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
            fetch("http://localhost:8000/api/nodes")
                .then((response) => response.json())
                .then((data) => setNodes(data))
                .catch(() => console.error("Could not fetch nodes"));
        }, []);

    return(
        <div className="grid gap-4">
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <UICard title="Quick Actions" desc="" footer="">
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                    <Button variant="outline" size="sm">Clear Recent Events</Button>
                    <Button variant="outline">Prune Database</Button>
                    <Button variant="outline">Force System Upgrade on All Nodes</Button>
                </div>
            </UICard>

            <div className="lg:col-span-2">
            <UICard title="Nodes" desc="">
                <UITable caption={"Visit Nodes page for more"} headers={["Host", "IP", "CPU Temp.", "Memory Used", "Status"]}>
                    {nodes.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.hostname}</TableCell>
                            <TableCell>{item.ip_addr}</TableCell>
                            <TableCell>{item.cpu_temp}</TableCell>
                            <TableCell>{item.memory_used}</TableCell>
                            <TableCell>
                                <Badge className={badgeStyles[item.status]}>
                                    {item.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </UITable>    
            </UICard>
            </div>
            </div>

            <ChartAreaInteractive></ChartAreaInteractive>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <UICard title="Stats" desc="This is a desc" footer="footer">
                <div className="font-bold">Test children</div>
            </UICard>
            </div>
            </div>
    )
}