import { supabase, type Location, type Game, type LeaderboardEntry } from "./database"

export class GameService {
  // Get a random location that the user hasn't played recently
  static async getRandomLocation(userId: string, mode: "country" | "city"): Promise<Location | null> {
    try {
      // Get locations the user has played in the last 10 games
      const { data: recentlyPlayed } = await supabase
        .from("user_played_locations")
        .select("location_id")
        .eq("user_id", userId)
        .order("played_at", { ascending: false })
        .limit(10)

      const excludeIds = recentlyPlayed?.map((item) => item.location_id) || []

      // Get a random location not in the recently played list
      let query = supabase.from("locations").select("*").eq("type", mode)

      if (excludeIds.length > 0) {
        query = query.not("id", "in", `(${excludeIds.join(",")})`)
      }

      const { data: locations } = await query

      if (!locations || locations.length === 0) {
        // If no unplayed locations, reset and get any location
        const { data: allLocations } = await supabase.from("locations").select("*").eq("type", mode)

        if (!allLocations || allLocations.length === 0) return null

        return allLocations[Math.floor(Math.random() * allLocations.length)]
      }

      return locations[Math.floor(Math.random() * locations.length)]
    } catch (error) {
      console.error("Error getting random location:", error)
      return null
    }
  }

  // Record that a user played a location
  static async recordLocationPlayed(userId: string, locationId: string): Promise<void> {
    try {
      await supabase.from("user_played_locations").upsert({ user_id: userId, location_id: locationId })
    } catch (error) {
      console.error("Error recording location played:", error)
    }
  }

  // Save a completed game
  static async saveGame(gameData: Omit<Game, "id" | "completed_at">): Promise<void> {
    try {
      await supabase.from("games").insert(gameData)
    } catch (error) {
      console.error("Error saving game:", error)
    }
  }

  // Get daily leaderboard
  static async getDailyLeaderboard(mode: "country" | "city"): Promise<LeaderboardEntry[]> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data } = await supabase
        .from("games")
        .select(`
          questions_asked,
          completion_time_seconds,
          completed_at,
          users!inner(username)
        `)
        .eq("mode", mode)
        .eq("won", true)
        .gte("completed_at", today.toISOString())
        .order("completion_time_seconds", { ascending: true })
        .order("questions_asked", { ascending: true })
        .limit(10)

      return (
        data?.map((game: any) => ({
          username: game.users.username,
          mode,
          questions_asked: game.questions_asked,
          completion_time_seconds: game.completion_time_seconds,
          completed_at: game.completed_at,
        })) || []
      )
    } catch (error) {
      console.error("Error getting leaderboard:", error)
      return []
    }
  }

  // Create or get user
  static async createUser(username: string, email?: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .upsert({ username, email }, { onConflict: "username" })
        .select("id")
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error("Error creating user:", error)
      return null
    }
  }
}
