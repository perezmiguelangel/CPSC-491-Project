import { UICard } from "@/components/UICard"
import { ChartAreaInteractive } from "@/components/ChartTest"

export default function DashboardPage(){
    return(
        <div className='grid gap-4 md:grid-cols-2 lg: grid-cols-3'>
            
            <UICard></UICard>
            <UICard></UICard>
            <ChartAreaInteractive></ChartAreaInteractive>
            <UICard></UICard>
            <UICard></UICard>
        </div>
    )
}