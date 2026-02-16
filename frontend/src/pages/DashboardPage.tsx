import { UICard } from "@/components/UICard"
import { ChartAreaInteractive } from "@/components/ChartTest"
import { UITable } from "@/components/UITable"

export default function DashboardPage(){
    return(
        <div className='grid gap-4 md:grid-cols-2 lg: grid-cols-3'>
            
            <UICard title="TestTitle" desc="This is a desc">
                <div className="font-bold">Test children</div>
            </UICard>

            <UICard title="Table" desc="This is a desc">
                <UITable></UITable>    
            </UICard>
            
            <ChartAreaInteractive></ChartAreaInteractive>

            <UICard title="Stats" desc="This is a desc" footer="footer">
                <div className="font-bold">Test children</div>
            </UICard>
            
        </div>
    )
}