import {Routes, Route} from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import EventsPage from './pages/EventsPage';
import NodesPage from './pages/NodesPage';
import { ThemeProvider } from "@/components/theme-provider"
import './App.css'


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />}/>
      
          <Route path='dashboard' element={<DashboardPage />} />
          <Route path='settings' element={<SettingsPage />} />
          <Route path='nodes' element={<NodesPage />} />
          <Route path='events' element={<EventsPage />} />
        
        </Route>
      </Routes>
    </ThemeProvider>
    
  )
}

export default App
