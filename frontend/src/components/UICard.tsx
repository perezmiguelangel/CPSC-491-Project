import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    } from "@/components/ui/card"

interface UICardProps extends React.ComponentProps<typeof Card>{
    title?: string;
    desc?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    footer?: string;
}

export function UICard({title, desc, action, children, footer, className, ...props}: UICardProps){
    return(
        <Card className={className} {...props}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
                <CardAction>{action}</CardAction>
            </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        <CardFooter>
            {footer}
        </CardFooter>
        </Card>
    )
}