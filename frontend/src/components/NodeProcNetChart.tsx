import * as React from "react"
import { Area, 
         AreaChart,
         CartesianGrid,
         XAxis,
         YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useNavigate } from "react-router-dom"

const chartConfig = {
  cpuLoad: {
    label: "CPU %",
    color: "var(--chart-1)",
  },
  memoryLoad: {
    label: "Memory %",
    color: "var(--chart-2)",
  },
  networkConnections: {
    label: "Connections",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

interface Snapshot {
  timestamp: string
  cpuLoad: number
  memoryLoad: number
  networkConnections: number
  networkData: any[]
  dockerData: any[]
}
interface Props {
  hostname: string
  refreshTrigger?: number
}

const timeFormat = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit"})

const API_Addr = "http://127.0.0.1:8000"

export function NodeProcNetChart({hostname, refreshTrigger}: Props) {
  const [snapshots, setSnapshots] = React.useState<Snapshot[]>([])
  const [loading, setLoading] = React.useState(true)
  const navigate = useNavigate()

  const fetchSnapshots = async () => {
    try {
    const response = await fetch(`${API_Addr}/api/nodes/${hostname}/snapshots`)
    const data = await response.json()

    setSnapshots(data)
    setLoading(false)
    }
    catch (error){
      console.error("Failed to fetch snapshots from API", error)
      setLoading(false)
    }
  }

  const handleChartClick = (e: any) => {
  if (e?.activePayload?.[0]) {
    const snapshot = e.activePayload[0].payload._raw
    if(!snapshot) return


    //
    const toLocalString = (d: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0")
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }

    const clickedTime = snapshot.timestamp.split(".")[0].replace(" ", "T")
    const asDate = new Date(clickedTime)
    const start = toLocalString(new Date(asDate.getTime() - 30000))
    const end = toLocalString(new Date(asDate.getTime() + 30000))

    navigate(`/nodes?hostname=${snapshot.hostname}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
    //
  }
}

  React.useEffect(() => {
    //console.log("fetching snapshots, trigger: ", refreshTrigger)
    fetchSnapshots()
  }, [hostname, refreshTrigger])

  const chartData = snapshots.map((s) => ({
    time: timeFormat(s.timestamp),
    cpuLoad: s.cpuLoad,
    memoryLoad: s.memoryLoad,
    networkConnections: s.networkConnections,
    _raw: s,
  }))

  if(loading) return (
    <div className="flex items-center justify-center text-muted-foreground text-sm">
      Loading snapshots...
    </div>
  )

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-62 w-full">
      <AreaChart data={chartData} onClick={handleChartClick} style={{ cursor: "crosshair"}}>
        <defs>
          <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-cpuLoad)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-cpuLoad)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="memoryFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-memoryLoad)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-memoryLoad)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="connectionsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-networkConnections)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-networkConnections)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
        <YAxis yAxisId="percent" domain={[0,100]} tick={{fontSize: 11}} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
        <YAxis yAxisId="connections" orientation="right" tick={{fontSize: 11}} tickLine={false} axisLine={false}/>


        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />

        <Area yAxisId="percent" dataKey="cpuLoad" type="natural" fill="url(#cpuFill)" stroke="var(--color-cpuLoad)"/>
        <Area yAxisId="percent" dataKey="memoryLoad" type="natural" fill="url(#memoryFill)" stroke="var(--color-memoryLoad)"/>
        <Area yAxisId="connections" dataKey="networkConnections" type="natural" fill="url(#connectionsFill)" stroke="var(--color-networkConnections)"/>

        <ChartLegend content={<ChartLegendContent />} />

      </AreaChart>
    </ChartContainer>


  )
}
