"use client"
import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface UIPieChartProps extends React.ComponentProps<typeof PieChart>{
  config: ChartConfig;
  data: Record<string, any>[];
  dataKey: string;
  nameKey: string;
}

export function UIPieChart({config, data, dataKey, nameKey}) {
  return (
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={data} dataKey={dataKey} nameKey={nameKey} />
          </PieChart>
        </ChartContainer>
  )
}
