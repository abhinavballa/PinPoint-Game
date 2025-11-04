"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Target, AlertCircle } from "lucide-react"
import { GameService } from "@/lib/game-service"

interface UserRegistrationProps {
  onUserRegistered: (userId: string, username: string) => void
}

export default function UserRegistration({ onUserRegistered }: UserRegistrationProps) {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    setError("")

    try {
      // Clean the username
      const cleanUsername = username.trim()

      // Validate username
      if (cleanUsername.length < 2) {
        setError("Username must be at least 2 characters long")
        setIsLoading(false)
        return
      }

      if (cleanUsername.length > 50) {
        setError("Username must be less than 50 characters")
        setIsLoading(false)
        return
      }

      // Create user
      const userId = await GameService.createUser(cleanUsername)

      if (userId) {
        // Store user info in localStorage
        localStorage.setItem("pinpoint_user_id", userId)
        localStorage.setItem("pinpoint_username", cleanUsername)
        onUserRegistered(userId, cleanUsername)
      } else {
        setError("Failed to create user. Please try a different username.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An error occurred. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black">
      <Card className="w-full max-w-md bg-spotify-medium-gray border-spotify-medium-gray">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-12 w-12 text-spotify-orange mr-3" />
            <h1 className="text-4xl font-bold text-spotify-white">PinPoint</h1>
          </div>
          <CardTitle className="text-2xl text-spotify-white">Welcome to PinPoint!</CardTitle>
          <p className="text-spotify-light-gray">Enter your name to start playing</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-spotify-white mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-spotify-light-gray" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-spotify-dark-gray border-spotify-light-gray text-spotify-white placeholder:text-spotify-light-gray focus:border-spotify-orange"
                  maxLength={50}
                  minLength={2}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={!username.trim() || isLoading}
              className="w-full bg-spotify-orange hover:bg-spotify-orange-dark text-spotify-white disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Creating Profile...</span>
                </div>
              ) : (
                "Start Playing"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-spotify-light-gray">
              Your name will be displayed on the leaderboard when you complete games.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
