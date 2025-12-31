import { useState } from 'react'
import './App.css'
import RandomQuoteGenerator from './pages/Random Quote Generator'
import DarkLightModeToggle from './pages/Dark Light Mode Toggle'
import Rough from './pages/Rough.tsx'
import HabitTrackerApp from './pages/new year special/Habit Tracker Web App.tsx'
import Portfolio from './pages/new year special/Portfoilo.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Portfolio />
        {/* <HabitTrackerApp /> */}
        {/* <Rough /> */}
        {/* <DarkLightModeToggle/> */}
        {/* <RandomQuoteGenerator /> */}
      </div>
    </>
  )
}

export default App
