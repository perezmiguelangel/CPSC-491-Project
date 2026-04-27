import { useState, useEffect } from "react";
import { UITable } from "./UITable";
import { TableCell, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

const API_Addr = "http://127.0.0.1:8000"

interface Snapshot {
  timestamp: string
  cpuLoad: number
  memoryLoad: number
  networkConnections: number
  networkData: any[]
  dockerData: any[]
  netIOcounters: any
}
interface Props {
    hostname: string
    initialStart?: string
    initialEnd?: string
}

export function SnapshotViewer({hostname, initialStart, initialEnd}: Props) {
    const [start, setStart] = useState(initialStart ?? "")
    const [end, setEnd] = useState(initialEnd ?? "")
    const [snapshots, setSnapshots] = useState<Snapshot[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const fetchRange = async () => {
        setLoading(true)
        setSearched(true)
        try{
            const response = await fetch(`${API_Addr}/api/nodes/${hostname}/snapshots/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
            const data = await response.json()
            setSnapshots(data)
        }
        catch (e) {
            console.error("Failed to fetch range: ", e)

        }
        setLoading(false)
    }

    useEffect(() => {
        if(initialStart && initialEnd){
            fetchRange()
        }
    }, [initialStart, initialEnd])

    const formatBytes = (bytes: number) => {
        if(bytes < 1024) return `${bytes} B`
        if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
        if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
        return `${(bytes / 1024 ** 3).toFixed(1)} GB`
    }
    
    const aggregatedProcesses: Record<string, { count: number, ips: Set<string>, ports: Set<number> }> = {}

    for (const snapshot of snapshots) {
        for (const connection of snapshot.networkData ?? []) {
            const processName = connection.process_name

            if (!aggregatedProcesses[processName]) {
                aggregatedProcesses[processName] = {
                    count: 0,
                    ips: new Set(),
                    ports: new Set()
                }
            }
            aggregatedProcesses[processName].count++

            if (connection.remote_ip && connection.remote_ip !== "Local") {
                aggregatedProcesses[processName].ips.add(connection.remote_ip)
            }
            if (connection.remote_port) {
                aggregatedProcesses[processName].ports.add(connection.remote_port)
            }
        }
    }

    let totalBytesSentDelta = 0
    let totalBytesRecvDelta = 0

    for (let i = 1; i < snapshots.length; i++) {
        const prev = snapshots[i - 1].netIOcounters
        const curr = snapshots[i].netIOcounters

    if (prev && curr) {
        totalBytesSentDelta += curr.bytesSent - prev.bytesSent
        totalBytesRecvDelta += curr.bytesRecv - prev.bytesRecv
    }
    }

    const processRows = Object.entries(aggregatedProcesses)
    processRows.sort((a, b) => b[1].count - a[1].count)

    let dockerContainers: any[] = []

    if (snapshots.length > 0) {
    const mostRecentSnapshot = snapshots[snapshots.length - 1]
    dockerContainers = mostRecentSnapshot.dockerData ?? []
    }
    return (
        <div className="space-y-4">
            <div className="flex gap-2 items-end justify-center">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Start Date-Time</label>
                    <input
                        type="text"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        placeholder="2026-04-25 21:00:00"
                        className="border rounded-md px-3 py-2 text-sm bg-background font-mono w-52"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">End Date-Time</label>
                    <input
                        type="text"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        placeholder="2026-04-25 21:01:00"
                        className="border rounded-md px-3 py-2 text-sm bg-background font-mono w-52"
                    />
                </div>
                <button
                    onClick={fetchRange}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    Search
                </button>
            </div>

            {!loading && searched && snapshots.length === 0 && (
                <div className="text-muted-foreground text-sm py-8 text-center">
                    No snapshots found in that time range
                </div>
            )}

            {!loading && snapshots.length > 0 && (
                <div className="space-y-6">
                    <div>
                        <p className="text-xs text-muted-foreground mb-2">
                            {snapshots.length} snapshots found between {start} and {end}
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Processes (During Time Range)</h3>
                        <UITable caption="" headers={["Process", "Total Connections", "Remote IPs", "Ports"]}>
                            {processRows.map(([name, d]: any) => (
                                <TableRow key={name}>
                                    <TableCell className="font-mono font-semibold">{name}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-primary/10 text-primary font-mono">
                                            {d.count}
                                        </Badge>
                                    </TableCell>
                                    {/* need to cover up ips!! */}
                                    <TableCell className="text-muted-foreground font-mono text-xs">
                                        {[...d.ips].slice(0, 4).join(", ") || "—"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">
                                        {[...d.ports].slice(0, 4).join(", ") || "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </UITable>
                    </div>
                    <div>
                        <span className="text-m text-muted-foreground mb-2">
                            Total data sent during window: 
                        </span>
                        <span className="text-m text-blue-400">
                            {formatBytes(totalBytesSentDelta)}
                        </span>
                        
                    </div>
                    <div>
                        <span className="text-m text-muted-foreground mb-2">
                            Total data received during window: 
                        </span>
                        <span className="text-m text-blue-400">
                            {formatBytes(totalBytesRecvDelta)}
                        </span>
                        
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Docker Containers (During Time Range)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {dockerContainers.map((c: any) => (
                                <div key={c.name} className="flex items-center gap-2 rounded-md border p-2.5 text-xs">
                                    <span className={`w-2 h-2 rounded-full flex-0 ${c.status === "running" ? "bg-green-500" : "bg-red-500"}`} />
                                    <span className="font-mono font-semibold truncate flex-1">{c.name}</span>
                                    <span className="text-muted-foreground text-[10px]">{c.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

