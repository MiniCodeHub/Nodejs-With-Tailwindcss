import { useState } from 'react'
import './App.css'
import RandomQuoteGenerator from './pages/Random Quote Generator'
import DarkLightModeToggle from './pages/Dark Light Mode Toggle'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <DarkLightModeToggle/>
        {/* <RandomQuoteGenerator /> */}
      </div>
    </>
  )
}

export default App
