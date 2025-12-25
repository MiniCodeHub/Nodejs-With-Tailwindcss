import { useState } from 'react'
import './App.css'
import RandomQuoteGenerator from './pages/Random Quote Generator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <RandomQuoteGenerator />
      </div>
    </>
  )
}

export default App
