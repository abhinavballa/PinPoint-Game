"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TableData {
  users: any[]
  locations: any[]
  games: any[]
  user_played_locations: any[]
}

export default function DebugPage() {
  const [data, setData] = useState<TableData>({
    users: [],
    locations: [],
    games: [],
    user_played_locations: [],
  })
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, locationsRes, gamesRes, playedRes] = await Promise.all([
        supabase.from("users").select("*").limit(10),
        supabase.from("locations").select("*").limit(20),
        supabase.from("games").select("*").limit(10),
        supabase.from("user_played_locations").select("*").limit(10),
      ])

      setData({
        users: usersRes.data || [],
        locations: locationsRes.data || [],
        games: gamesRes.data || [],
        user_played_locations: playedRes.data || [],
      })
    } catch (error) {
      console.error("Error loading data:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading database data...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-spotify-white">Database Debug View</h1>
        <Button onClick={loadData} className="bg-spotify-orange hover:bg-spotify-orange-dark">
          Refresh Data
        </Button>
      </div>

      {/* Users Table */}
      <Card className="bg-spotify-medium-gray border-spotify-medium-gray">
        <CardHeader>
          <CardTitle className="text-spotify-white">Users ({data.users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-spotify-white">
              <thead>
                <tr className="border-b border-spotify-dark-gray">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Username</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id} className="border-b border-spotify-dark-gray/50">
                    <td className="p-2 font-mono text-xs">{user.id.slice(0, 8)}...</td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.email || "N/A"}</td>
                    <td className="p-2">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Locations Table */}
      <Card className="bg-spotify-medium-gray border-spotify-medium-gray">
        <CardHeader>
          <CardTitle className="text-spotify-white">Locations ({data.locations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-spotify-white">
              <thead>
                <tr className="border-b border-spotify-dark-gray">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Continent/Country</th>
                  <th className="text-left p-2">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {data.locations.map((location) => (
                  <tr key={location.id} className="border-b border-spotify-dark-gray/50">
                    <td className="p-2 font-semibold">{location.name}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          location.type === "country" ? "bg-blue-600" : "bg-green-600"
                        }`}
                      >
                        {location.type}
                      </span>
                    </td>
                    <td className="p-2">{location.continent || location.country}</td>
                    <td className="p-2">
                      <div className="flex">
                        {Array.from({ length: location.difficulty_level }, (_, i) => (
                          <span key={i} className="text-spotify-orange">
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Games Table */}
      <Card className="bg-spotify-medium-gray border-spotify-medium-gray">
        <CardHeader>
          <CardTitle className="text-spotify-white">Recent Games ({data.games.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-spotify-white">
              <thead>
                <tr className="border-b border-spotify-dark-gray">
                  <th className="text-left p-2">Mode</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Questions</th>
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Won</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.games.map((game) => (
                  <tr key={game.id} className="border-b border-spotify-dark-gray/50">
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          game.mode === "country" ? "bg-blue-600" : "bg-green-600"
                        }`}
                      >
                        {game.mode}
                      </span>
                    </td>
                    <td className="p-2 font-semibold">{game.location_name}</td>
                    <td className="p-2">{game.questions_asked}</td>
                    <td className="p-2">
                      {Math.floor(game.completion_time_seconds / 60)}:
                      {(game.completion_time_seconds % 60).toString().padStart(2, "0")}
                    </td>
                    <td className="p-2">
                      {game.won ? (
                        <span className="text-green-400">✓ Won</span>
                      ) : (
                        <span className="text-red-400">✗ Lost</span>
                      )}
                    </td>
                    <td className="p-2">{new Date(game.completed_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Played Locations */}
      <Card className="bg-spotify-medium-gray border-spotify-medium-gray">
        <CardHeader>
          <CardTitle className="text-spotify-white">
            User Played Locations ({data.user_played_locations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-spotify-white">
              <thead>
                <tr className="border-b border-spotify-dark-gray">
                  <th className="text-left p-2">User ID</th>
                  <th className="text-left p-2">Location ID</th>
                  <th className="text-left p-2">Played At</th>
                </tr>
              </thead>
              <tbody>
                {data.user_played_locations.map((record) => (
                  <tr key={record.id} className="border-b border-spotify-dark-gray/50">
                    <td className="p-2 font-mono text-xs">{record.user_id.slice(0, 8)}...</td>
                    <td className="p-2 font-mono text-xs">{record.location_id.slice(0, 8)}...</td>
                    <td className="p-2">{new Date(record.played_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-spotify-medium-gray border-spotify-medium-gray">
        <CardHeader>
          <CardTitle className="text-spotify-white">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-spotify-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-spotify-orange">{data.users.length}</div>
              <div className="text-sm text-spotify-light-gray">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-spotify-orange">
                {data.locations.filter((l) => l.type === "country").length}
              </div>
              <div className="text-sm text-spotify-light-gray">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-spotify-orange">
                {data.locations.filter((l) => l.type === "city").length}
              </div>
              <div className="text-sm text-spotify-light-gray">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-spotify-orange">{data.games.length}</div>
              <div className="text-sm text-spotify-light-gray">Games Played</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
