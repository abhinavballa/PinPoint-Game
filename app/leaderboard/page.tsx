"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, Clock, HelpCircle, Globe, MapPin, Users } from "lucide-react"
import { GameService, type LeaderboardEntry } from "@/lib/game-service"

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-spotify-orange" />
    case 2:
      return <Medal className="h-6 w-6 text-spotify-light-gray" />
    case 3:
      return <Award className="h-6 w-6 text-yellow-500" />
    default:
      return <span className="text-lg font-bold text-spotify-light-gray">#{rank}</span>
  }
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"country" | "city">("country")
  const [countryLeaderboard, setCountryLeaderboard] = useState<LeaderboardEntry[]>([])
  const [cityLeaderboard, setCityLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const loadLeaderboards = async () => {
    setLoading(true)
    try {
      const [countryData, cityData] = await Promise.all([
        GameService.getDailyLeaderboard("country"),
        GameService.getDailyLeaderboard("city"),
      ])
      setCountryLeaderboard(countryData)
      setCityLeaderboard(cityData)
    } catch (error) {
      console.error("Error loading leaderboards:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaderboards()
  }, [])

  const currentLeaderboard = activeTab === "country" ? countryLeaderboard : cityLeaderboard

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-spotify-white mb-2">Daily Leaderboard</h1>
        <p className="text-spotify-light-gray">Top players today</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-spotify-medium-gray rounded-lg p-1 flex space-x-1">
          <Button
            onClick={() => setActiveTab("country")}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-all ${
              activeTab === "country"
                ? "bg-spotify-orange text-spotify-white"
                : "bg-transparent text-spotify-light-gray hover:text-spotify-white hover:bg-spotify-dark-gray"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Countries</span>
          </Button>
          <Button
            onClick={() => setActiveTab("city")}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-all ${
              activeTab === "city"
                ? "bg-spotify-orange text-spotify-white"
                : "bg-transparent text-spotify-light-gray hover:text-spotify-white hover:bg-spotify-dark-gray"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Cities</span>
          </Button>
        </div>
      </div>

      <Card className="bg-spotify-medium-gray border-spotify-medium-gray">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-spotify-white">
              <Trophy className="h-5 w-5 text-spotify-orange" />
              <span>{activeTab === "country" ? "Country" : "City"} Champions</span>
            </CardTitle>
            <Button
              onClick={loadLeaderboards}
              variant="outline"
              size="sm"
              className="border-spotify-light-gray text-spotify-white hover:bg-spotify-dark-gray bg-transparent"
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-spotify-orange border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-spotify-light-gray">Loading leaderboard...</p>
            </div>
          ) : currentLeaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-spotify-light-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-spotify-white mb-2">No games played yet!</h3>
              <p className="text-spotify-light-gray">Be the first to play and claim the top spot!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-spotify-dark-gray">
                    <th className="text-left py-3 px-2 font-semibold text-spotify-light-gray">Rank</th>
                    <th className="text-left py-3 px-2 font-semibold text-spotify-light-gray">Player</th>
                    <th className="text-left py-3 px-2 font-semibold text-spotify-light-gray">Time</th>
                    <th className="text-left py-3 px-2 font-semibold text-spotify-light-gray">Questions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeaderboard.map((entry, index) => (
                    <tr
                      key={`${entry.username}-${index}`}
                      className={`border-b border-spotify-dark-gray hover:bg-spotify-dark-gray/50 transition-colors ${
                        index < 3 ? "bg-spotify-orange/5" : ""
                      }`}
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center">{getRankIcon(index + 1)}</div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="font-medium text-spotify-white">{entry.username}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-spotify-light-gray" />
                          <span className="font-mono text-spotify-white">
                            {formatTime(entry.completion_time_seconds)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-1">
                          <HelpCircle className="h-4 w-4 text-spotify-light-gray" />
                          <span className="text-spotify-white">{entry.questions_asked}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-spotify-light-gray">
          Leaderboard resets daily at midnight UTC. Play now to claim your spot!
        </p>
      </div>
    </div>
  )
}
