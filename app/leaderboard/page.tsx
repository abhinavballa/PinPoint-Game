"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, Clock, HelpCircle, Globe, MapPin } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  username: string
  mode: "country" | "city"
  time: string
  questions: number
}

// Mock leaderboard data for countries
const countryLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "GeoMaster", mode: "country", time: "2:34", questions: 8 },
  { rank: 2, username: "WorldTraveler", mode: "country", time: "3:45", questions: 10 },
  { rank: 3, username: "AtlasKing", mode: "country", time: "4:23", questions: 14 },
  { rank: 4, username: "Compass", mode: "country", time: "5:12", questions: 18 },
  { rank: 5, username: "Explorer", mode: "country", time: "5:47", questions: 19 },
  { rank: 6, username: "Navigator", mode: "country", time: "6:15", questions: 16 },
  { rank: 7, username: "Wanderer", mode: "country", time: "6:32", questions: 17 },
  { rank: 8, username: "Adventurer", mode: "country", time: "7:02", questions: 20 },
  { rank: 9, username: "Globetrotter", mode: "country", time: "7:18", questions: 19 },
  { rank: 10, username: "Cartographer", mode: "country", time: "7:45", questions: 18 },
]

// Mock leaderboard data for cities
const cityLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "CityHunter", mode: "city", time: "3:12", questions: 12 },
  { rank: 2, username: "MapExplorer", mode: "city", time: "4:01", questions: 15 },
  { rank: 3, username: "UrbanExplorer", mode: "city", time: "4:56", questions: 16 },
  { rank: 4, username: "MetroMaster", mode: "city", time: "5:34", questions: 17 },
  { rank: 5, username: "CityScout", mode: "city", time: "6:02", questions: 20 },
  { rank: 6, username: "StreetWise", mode: "city", time: "6:28", questions: 18 },
  { rank: 7, username: "UrbanNavigator", mode: "city", time: "6:55", questions: 19 },
  { rank: 8, username: "CitySlicker", mode: "city", time: "7:21", questions: 16 },
  { rank: 9, username: "TownExplorer", mode: "city", time: "7:48", questions: 17 },
  { rank: 10, username: "CityWalker", mode: "city", time: "8:15", questions: 20 },
]

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

  const currentLeaderboard = activeTab === "country" ? countryLeaderboard : cityLeaderboard

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-spotify-white mb-2">Daily Leaderboard</h1>
        <p className="text-spotify-light-gray">Top 10 fastest players today</p>
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
          <CardTitle className="flex items-center space-x-2 text-spotify-white">
            <Trophy className="h-5 w-5 text-spotify-orange" />
            <span>{activeTab === "country" ? "Country" : "City"} Champions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                {currentLeaderboard.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={`border-b border-spotify-dark-gray hover:bg-spotify-dark-gray/50 transition-colors ${
                      entry.rank <= 3 ? "bg-spotify-orange/5" : ""
                    }`}
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center">{getRankIcon(entry.rank)}</div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-medium text-spotify-white">{entry.username}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-spotify-light-gray" />
                        <span className="font-mono text-spotify-white">{entry.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-1">
                        <HelpCircle className="h-4 w-4 text-spotify-light-gray" />
                        <span className="text-spotify-white">{entry.questions}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
