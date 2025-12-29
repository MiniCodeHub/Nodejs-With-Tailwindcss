import { useState } from 'react'
import './App.css'
import RandomQuoteGenerator from './pages/Random Quote Generator'
import DarkLightModeToggle from './pages/Dark Light Mode Toggle'
import Rough from './pages/Rough.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Rough />
        {/* <DarkLightModeToggle/> */}
        {/* <RandomQuoteGenerator /> */}
      </div>
    </>
  )
}

export default App
