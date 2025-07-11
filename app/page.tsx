"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Globe, Target, Play } from "lucide-react"
import UserRegistration from "@/components/user-registration"

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState<"country" | "city" | null>(null)
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already registered
    const userId = localStorage.getItem("pinpoint_user_id")
    const username = localStorage.getItem("pinpoint_username")

    if (userId && username) {
      setUser({ id: userId, username })
    }
    setIsLoading(false)
  }, [])

  const handleUserRegistered = (userId: string, username: string) => {
    setUser({ id: userId, username })
  }

  const handleStartGame = () => {
    if (selectedMode && user) {
      router.push(`/game?mode=${selectedMode}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spotify-black">
        <div className="animate-spin h-8 w-8 border-2 border-spotify-orange border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <UserRegistration onUserRegistered={handleUserRegistered} />
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Message */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-spotify-white mb-2">
          Welcome back, <span className="text-spotify-orange">{user.username}</span>!
        </h2>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Target className="h-12 w-12 text-spotify-green mr-3" />
          <h1 className="text-5xl md:text-6xl font-bold text-spotify-white">PinPoint</h1>
        </div>
        <p className="text-xl text-spotify-light-gray max-w-2xl mx-auto">
          Test your geography knowledge by asking strategic yes/no questions to discover hidden locations around the
          world!
        </p>
      </div>

      {/* Game Mode Selection */}
      <Card className="mb-8 bg-spotify-medium-gray border-spotify-medium-gray">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-spotify-white">Choose Your Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className={`h-24 text-lg font-semibold transition-all border-2 ${
                selectedMode === "country"
                  ? "bg-spotify-orange hover:bg-spotify-orange-dark text-spotify-white border-spotify-orange"
                  : "bg-spotify-dark-gray hover:bg-spotify-medium-gray border-spotify-light-gray hover:border-spotify-orange text-spotify-white"
              }`}
              onClick={() => setSelectedMode("country")}
            >
              <div className="flex flex-col items-center space-y-2">
                <Globe className="h-8 w-8" />
                <span>Pinpoint the Country</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className={`h-24 text-lg font-semibold transition-all border-2 ${
                selectedMode === "city"
                  ? "bg-spotify-orange hover:bg-spotify-orange-dark text-spotify-white border-spotify-orange"
                  : "bg-spotify-dark-gray hover:bg-spotify-medium-gray border-spotify-light-gray hover:border-spotify-orange text-spotify-white"
              }`}
              onClick={() => setSelectedMode("city")}
            >
              <div className="flex flex-col items-center space-y-2">
                <MapPin className="h-8 w-8" />
                <span>Pinpoint the City</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mb-8 bg-spotify-medium-gray border-spotify-medium-gray">
        <CardContent className="pt-6">
          <div className="bg-spotify-dark-gray border border-spotify-orange/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-spotify-orange mb-2">How to Play</h3>
            <p className="text-spotify-light-gray">
              Ask up to 20 yes/no questions to figure out the place. You can make a guess at any time! The faster you
              guess correctly, the higher your score on the leaderboard.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Start Game Button */}
      <div className="text-center">
        <Button
          onClick={handleStartGame}
          disabled={!selectedMode}
          className={`px-12 py-4 text-xl font-semibold transition-all ${
            selectedMode
              ? "bg-spotify-orange hover:bg-spotify-orange-dark text-spotify-white"
              : "bg-spotify-medium-gray text-spotify-light-gray cursor-not-allowed"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>{selectedMode ? "Start Game" : "Select a Mode First"}</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
