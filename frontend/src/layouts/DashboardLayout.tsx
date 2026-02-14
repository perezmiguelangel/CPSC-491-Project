import {Outlet} from 'react-router-dom'
import { AppSidebar } from '@/components/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function DashboardLayout() {
    return(
        <div className='flex h-screen'>
            <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger/>
            <h1 className='bg-amber-400'>DashboardLayout!!!</h1>
            

            <Outlet />
            </SidebarProvider>
        </div>
    )
}