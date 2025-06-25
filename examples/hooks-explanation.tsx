"use client"

import { useState, useEffect } from "react"

// This is a simplified version showing how hooks work together
export default function HooksExample() {
  // 1. STATE HOOKS - Store component data
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [message, setMessage] = useState("")

  // 2. EFFECT HOOK - Run side effects when state changes
  useEffect(() => {
    console.log(`Count changed to: ${count}`)

    // Update message based on count
    if (count === 0) {
      setMessage("Click to start counting!")
    } else if (count < 5) {
      setMessage("Keep going...")
    } else {
      setMessage("Great job!")
    }
  }, [count]) // This runs whenever 'count' changes

  // 3. ANOTHER EFFECT - Timer example
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount + 1) // Update count every second
      }, 1000)
    }

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning]) // This runs whenever 'isRunning' changes

  // 4. EVENT HANDLERS - Functions that update state
  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setCount(0)
  }

  // 5. RENDER - JSX that uses the state
  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Hooks Example</h2>

      {/* Display current state */}
      <div className="mb-4">
        <p className="text-3xl font-bold">Count: {count}</p>
        <p className="text-gray-600">{message}</p>
        <p className="text-sm">Status: {isRunning ? "Running" : "Stopped"}</p>
      </div>

      {/* Buttons that trigger state changes */}
      <div className="space-x-2">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          Start
        </button>

        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop
        </button>

        <button onClick={handleReset} className="px-4 py-2 bg-blue-500 text-white rounded">
          Reset
        </button>
      </div>
    </div>
  )
}
