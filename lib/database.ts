import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface User {
  id: string
  username: string
  email?: string
  created_at: string
}

export interface Location {
  id: string
  name: string
  type: "country" | "city"
  continent?: string
  country?: string
  difficulty_level: number
}

export interface Game {
  id: string
  user_id: string
  mode: "country" | "city"
  location_name: string
  questions_asked: number
  completion_time_seconds: number
  completed_at: string
  won: boolean
}

export interface LeaderboardEntry {
  username: string
  mode: "country" | "city"
  questions_asked: number
  completion_time_seconds: number
  completed_at: string
}
