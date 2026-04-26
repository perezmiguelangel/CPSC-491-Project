import React from "react";
import { useState, useEffect} from "react";
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react";

export function LiveBadge({ lastSeen }: { lastSeen: string}) {
    const [isLive, setisLive] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            if (!lastSeen){
                return;
            }
            const lastSeenDate = new Date(lastSeen).getTime();
            const timeNow = Date.now();
            const timeDiff = timeNow - lastSeenDate;

            setisLive(timeDiff <= 15000);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);

}, [lastSeen]);

    return(
        <div>
            {isLive ? (
                <Badge className="bg-green-500/10 text-green-400 flex gap-1.5 items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" />
                    Online
                </Badge>
            ) : (
                <Badge className="bg-red-500/10 text-red-400 flex gap-1.5 items-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Offline
                </Badge>
            )}
        </div>
    )

}