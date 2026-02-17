import { Switch } from "@/components/ui/switch"
import { UICard } from "@/components/UICard"


export default function SettingsPage(){
    return(
        <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <UICard title="Settings" desc="" footer="">
                
                </UICard>
                <UICard title="Settings" desc="" footer="">
                
                </UICard>
            </div>
        </div>

    )
}