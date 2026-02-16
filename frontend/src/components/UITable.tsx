import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface UITableProps extends React.ComponentProps<typeof Table>{
  caption?: string;
  headers: string[];
  children: React.ReactNode;
}

export function UITable({caption, headers, children }){
    return(
        <Table>
          <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="text-center">{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {children}
        </TableBody>
        </Table>
    )
}