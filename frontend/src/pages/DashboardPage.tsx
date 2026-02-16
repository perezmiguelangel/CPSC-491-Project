import { UICard } from "@/components/UICard"
import { ChartAreaInteractive } from "@/components/ChartTest"
import { UITable } from "@/components/UITable"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UIPieChart } from "@/components/UIPieChart"
import { useState, useEffect } from "react"

const badgeStyles: Record<string, string> = {
    Disconnected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    Connected: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
}

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig


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
            <UICard title="" desc="">
                <UIPieChart config={chartConfig} data={chartData} dataKey="visitors" nameKey="browser"></UIPieChart>
            </UICard>

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

            <ChartAreaInteractive></ChartAreaInteractive>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <UICard title="Stats" desc="This is a desc" footer="footer">
                <div className="font-bold">Test children</div>
            </UICard>
            </div>
        </div>
    )
}