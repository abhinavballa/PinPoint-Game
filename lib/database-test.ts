import { supabase } from "./database"

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("users").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Database connection test failed:", error)
      return false
    }

    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection test error:", error)
    return false
  }
}
