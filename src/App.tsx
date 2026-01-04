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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ProtectedRoutewithAuthState/>
        {/* <SkeletonLoaderForAPIData/> */}
        {/* <NotesApp /> */}
        {/* <Portfolio /> */}
        {/* <HabitTrackerApp /> */}
        {/*<Rough />*/}
        {/* <DarkLightModeToggle/> */}
        {/* <RandomQuoteGenerator /> */}
      </div>
    </>
  )
}

export default App
