import {useState, useEffect} from "react";
import { UITable } from "@/components/UITable";
import { UICard } from "@/components/UICard";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


const badgeStyles: Record<string, string> = {
    Disconnected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    Connected: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
}

export default function NodesPage(){
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/nodes")
            .then((response) => response.json())
            .then((data) => setNodes(data))
            .catch(() => console.error("Could not fetch nodes"));
    }, []);
    
    const stringJson = JSON.stringify(nodes, null, 2);
    console.log(stringJson);

    return(
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <UICard title="Nodes" desc="Currently monitored nodes">
                <UITable caption={""} headers={["Host", "IP", "CPU Temp.", "Memory Used", "Status"]}>
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
            <UICard title="Resource Usage" desc="System Resource Usage">

            </UICard>

            <div>
            <UICard title="test" desc="test">

            </UICard>
            </div>
        </div>

    )
}