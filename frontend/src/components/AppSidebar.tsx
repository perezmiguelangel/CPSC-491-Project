import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Home} from "lucide-react"
import { Link } from "react-router-dom"

const data = {
  navigation: [
    {
      title: "Dashboard",
      url:   "/dashboard",
      icon:  Home
    },
    {
      title: "Events",
      url:   "/events",
      icon:  Home
    },
    {
      title: "Nodes",
      url:   "/nodes",
      icon:  Home
    },
    {
      title: "Settings",
      url:   "/settings",
      icon:  Home
    }
  ]
};

// props is used here to fetch primitive properties of Sidebar
export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="h-auto border-r" {...props}>
      <SidebarHeader className="flex justify-center border-b">
        <span className="font-extrabold">
            HEADER
        </span>
      </SidebarHeader>

      <SidebarContent className="">
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