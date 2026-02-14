import {Outlet} from 'react-router-dom'
import { AppSidebar } from '@/components/AppSidebar'
import { SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'

export default function DashboardLayout() {
    return(
        <div className='flex min-h-screen w-full'>
            <SidebarProvider>
                <AppSidebar />
                <main className='flex flex-1 flex-col overflow-hidden'>
                    <header className='flex h-16 items-center border-b px-4'>
                        <SidebarTrigger/>
                    </header>
                    <div className='flex-1 overflow-y-auto p-6'>
                         <Outlet />
                    </div>
                   
                </main>
                
            </SidebarProvider>
        </div>
    )
}