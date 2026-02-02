import { useState } from 'react'
import './App.css'
import RandomQuoteGenerator from './pages/Random Quote Generator'
import DarkLightModeToggle from './pages/Dark Light Mode Toggle'
import Rough from './pages/Rough.tsx'
import HabitTrackerApp from './pages/new year special/Habit Tracker Web App.tsx'
import Portfolio from './pages/new year special/Portfoilo.tsx'
import NotesApp from './pages/new year special/Notes App.tsx'
import SkeletonLoaderForAPIData from './pages/Skeleton Loader for API Data .tsx'
import ProtectedRoutewithAuthState from './pages/Protected Route with Auth State.tsx'
import ToastNotificationSystem from './pages/Toast Notification System.tsx'
import ClientSidePaginationComponent from './pages/Client-Side Pagination Component.tsx'
import SearchFilterComponent from './pages/Search Filter Component.tsx'
import MultiStepForm from './pages/Multi-Step Form (Stepper).tsx'
import ReusableCardComponents from './pages/Reusable Card Component.tsx'
import RoleBasedUI from './pages/Role-Based UI Rendering.tsx'
import ResponsiveNavbarwithMobileMenu from './pages/Responsive Navbar with Mobile Menu.tsx'
import ReusableButtonComponentSystem from './pages/Reusable Button Component System.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ReusableButtonComponentSystem />
        {/* <ResponsiveNavbarwithMobileMenu /> */}
        {/* <RoleBasedUI/> */}
        {/* <ReusableCardComponents /> */}
        {/* <MultiStepForm /> */}
        {/* <SearchFilterComponent /> */}
        {/* <ClientSidePaginationComponent /> */}
        {/* <ToastNotificationSystem /> */}
        {/* <ProtectedRoutewithAuthState/> */}
        {/* <SkeletonLoaderForAPIData/> */}
        {/* <NotesApp /> */}
        {/* <Portfolio /> */}
        {/* <HabitTrackerApp /> */}
        {/* <Rough /> */}
        {/* <DarkLightModeToggle/> */}
        {/* <RandomQuoteGenerator /> */}
      </div>
    </>
  )
}

export default App
