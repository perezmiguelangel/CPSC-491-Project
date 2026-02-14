import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {IconHome, IconShieldExclamation, IconTopologyRing2, IconSettings} from "@tabler/icons-react"
import { Link } from "react-router-dom"

const data = {
  navigation: [
    {
      title: "Dashboard",
      url:   "/dashboard",
      icon:  IconHome
    },
    {
      title: "Events",
      url:   "/events",
      icon:  IconShieldExclamation
    },
    {
      title: "Nodes",
      url:   "/nodes",
      icon:  IconTopologyRing2
    },
    {
      title: "Settings",
      url:   "/settings",
      icon:  IconSettings
    }
  ]
};

// props is used here to fetch primitive properties of Sidebar
export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="h-screen border-r" {...props}>
      <SidebarContent className="flex flex-col justify-center">
        <SidebarHeader className="flex border-b">
        <span className="font-extrabold">
            HEADER
        </span>
        </SidebarHeader>
        <SidebarMenu className="flex items-center">
          {data.navigation.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.url} className="text-blue-500">
                  <item.icon className="size-4"/>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <span>Username</span>
      </SidebarFooter>
    </Sidebar>
  )
}