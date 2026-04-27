import { UITable } from "@/components/UITable"
import { UICard } from "@/components/UICard"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Table } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const badgeStyles: Record<string, string> = {
    High: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    Medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    Info: ""
}

const ITEMS_PER_PAGE = 20

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

interface Connection {
    process_name: string
    local_port: number
    remote_ip: string
    remote_port: number
    status: string
    remote_ip_hostname: string
}

export default function EventsPage(){
    const [nodes, setNodes] = useState<nodeData[]>([]);
    const [filterNode, setFilterNode] = useState("all")
    const [filterProcess, setFilterProcess] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [page, setPage] = useState(1)

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

    const allConnections = nodes.flatMap((node) =>
        (node.networkData ?? []).map((conn) => ({
            ...conn,
            hostname: node.hostname
        }))
    )

    const filtered = allConnections.filter((connection) => {
        const matchesNode = filterNode === "all" || connection.hostname === filterNode
        const matchesProcess = connection.process_name.toLowerCase().includes(filterProcess.toLowerCase())
        const matchesStatus = filterStatus === "all" || connection.status === filterStatus

        return matchesNode && matchesProcess && matchesStatus
    })

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
        setter(value)
        setPage(1)
    }

    return(
        <div>
        <UICard title="Network Processes" desc="Currently running network processes across nodes">
        <div className="flex items-center justify-center gap-4 pb-4">
            <Select value={filterNode} onValueChange={handleFilterChange(setFilterNode)}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Nodes" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">All Nodes</SelectItem>
                        {nodes.map((n) => (
                            <SelectItem key={n.hostname} value={n.hostname}>{n.hostname}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={handleFilterChange(setFilterStatus)}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Statuses"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="ESTABLISHED">ESTABLISHED</SelectItem>
                        <SelectItem value="LISTEN">LISTEN</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Input placeholder="Filter by process..." value={filterProcess}
                   onChange={(e) => handleFilterChange(setFilterProcess)(e.target.value)}
                   className="w-45 font-mono" />
            
            <span className="text-xs text-muted-foreground  self-center font-mono">
                {filtered.length} connections
            </span>
        </div>
        <div>
            <UITable caption="" headers={["Node", "Process", "Local Port" ,"Remote IP [Resolved Hostname]", "Remote Port", "Status"]}>
                {paginated.map((connection, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{connection.hostname}</TableCell>
                            <TableCell className="font-mono font-semibold">{connection.process_name}</TableCell>
                            <TableCell className="font-mono text-xs">{connection.local_port}</TableCell>
                            <TableCell className="font-mono text-xs">{connection.remote_ip} [{connection.remote_ip_hostname}]</TableCell>
                            <TableCell className="font-mono text-xs">{connection.remote_port ?? "—"}</TableCell>
                            <TableCell>
                                <Badge className={connection.status === "ESTABLISHED"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-blue-500/20 text-blue-400"}>
                                    {connection.status}
                                </Badge>
                            </TableCell>
                    </TableRow>
                ))}
            </UITable>
            <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 text-xs rounded-md border disabled:opacity-40 hover:bg-muted transition-colors">Previous</button>
                    <span className="text-xs text-muted-foreground font-mono">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 text-xs rounded-md border disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
            </div>
        </div>
        </UICard>
        </div>
        
    )
}
