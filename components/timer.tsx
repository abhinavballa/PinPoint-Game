"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface TimerProps {
  startTime: Date
  isActive: boolean
}

export default function Timer({ startTime, isActive }: TimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [startTime, isActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center space-x-2 text-center">
      <Clock className="h-4 w-4 text-spotify-light-gray" />
      <div>
        <p className="text-sm text-spotify-light-gray">Time</p>
        <p className="font-mono font-semibold text-lg text-spotify-white">{formatTime(elapsedTime)}</p>
      </div>
    </div>
  )
}
