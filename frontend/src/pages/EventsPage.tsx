import { UITable } from "@/components/UITable"
import { UICard } from "@/components/UICard"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const eventsData = [
    { id: 1, timestamp: "2025-02-15 00:03:12", event: "Failed SSH login", source: "192.168.1.42", user: "root", severity: "High" },
    { id: 2, timestamp: "2025-02-15 00:11:45", event: "Port scan detected", source: "203.0.113.7", user: "—", severity: "Medium" },
    { id: 3, timestamp: "2025-02-15 01:22:09", event: "Sudo privilege escalation", source: "10.0.0.5", user: "jdoe", severity: "High" },
    { id: 4, timestamp: "2025-02-15 02:08:33", event: "Cron job modified", source: "10.0.0.5", user: "jdoe", severity: "Medium" },
    { id: 5, timestamp: "2025-02-15 03:44:01", event: "Successful SSH login", source: "10.0.0.11", user: "deploy", severity: "Info" },
    { id: 6, timestamp: "2025-02-15 04:17:58", event: "Firewall rule changed", source: "10.0.0.1", user: "admin", severity: "High" },
    { id: 7, timestamp: "2025-02-15 05:02:44", event: "/etc/passwd accessed", source: "10.0.0.5", user: "jdoe", severity: "High" },
    { id: 8, timestamp: "2025-02-15 06:30:19", event: "New user account created", source: "10.0.0.1", user: "admin", severity: "Medium" },
    { id: 9, timestamp: "2025-02-15 07:15:27", event: "SSH key added", source: "10.0.0.11", user: "deploy", severity: "Medium" },
    { id: 10, timestamp: "2025-02-15 08:49:03", event: "Service restarted: nginx", source: "10.0.0.1", user: "admin", severity: "Info" },
]
const badgeStyles: Record<string, string> = {
    High: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    Medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    Info: ""
}

export default function EventsPage(){
    return(
        <div className="">
            <UICard title="Events" desc="Current Security Events">
                <UITable caption={""} headers={["Timestamp", "Event", "Source", "User", "Severity"]}>
                    {eventsData.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.timestamp}</TableCell>
                            <TableCell>{item.event}</TableCell>
                            <TableCell>{item.source}</TableCell>
                            <TableCell>{item.user}</TableCell>
                            <TableCell>
                                <Badge className={badgeStyles[item.severity]}>
                                    {item.severity}
                                </Badge>
                                
                            </TableCell>
                        </TableRow>
                    ))}
                </UITable>
            </UICard>
        </div>
    )
}