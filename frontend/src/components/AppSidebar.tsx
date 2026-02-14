import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1>Dashboard</h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />
          <Link to="/dashboard" className='text-blue-300'>Dashboard</Link>
          <Link to="/settings" className='text-blue-300'>Settings</Link>
          <Link to="/events" className='text-blue-300'>Events</Link>
          <Link to="/nodes" className='text-blue-300'>Nodes</Link>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}