"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Location } from "@/lib/database"

export async function getAIResponse(question: string, location: Location): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"), // Using a faster, cheaper model for yes/no questions
      system: `You are an AI assistant helping with a geography guessing game. You must answer ONLY with "Yes", "No", or "Maybe" to yes/no questions about a specific location.

Rules:
- Answer "Yes" if the question is clearly true about the location
- Answer "No" if the question is clearly false about the location  
- Answer "Maybe" only if the question is ambiguous or partially true
- Be accurate based on real geographical, cultural, and factual information
- Do not reveal the location name in your response
- Keep responses to exactly one word: "Yes", "No", or "Maybe"

Location Information:
- Name: ${location.name}
- Type: ${location.type}
- Continent: ${location.continent || "N/A"}
- Country: ${location.country || "N/A"}
- Difficulty Level: ${location.difficulty_level}/5`,
      prompt: `Question: "${question}"
      
Please answer with only "Yes", "No", or "Maybe" based on whether this question is true about ${location.name}.`,
      maxTokens: 10, // Keep it short
    })

    // Ensure we only return valid responses
    const response = text.trim()
    if (["Yes", "No", "Maybe"].includes(response)) {
      return response
    }

    // Fallback if AI doesn't follow format
    return "Maybe"
  } catch (error) {
    console.error("AI Response Error:", error)
    // Fallback to simple logic if AI fails
    return getSimpleFallbackResponse(question, location)
  }
}

// Fallback function for when AI is unavailable
function getSimpleFallbackResponse(question: string, location: Location): string {
  const questionLower = question.toLowerCase()

  // Basic continent checks
  if (questionLower.includes("europe") && location.continent === "Europe") return "Yes"
  if (questionLower.includes("asia") && location.continent === "Asia") return "Yes"
  if (questionLower.includes("africa") && location.continent === "Africa") return "Yes"
  if (questionLower.includes("america") && location.continent?.includes("America")) return "Yes"
  if (questionLower.includes("oceania") && location.continent === "Oceania") return "Yes"

  // Basic size checks for countries
  if (location.type === "country") {
    const largeCountries = ["russia", "china", "canada", "united states", "brazil", "australia", "india"]
    if (questionLower.includes("large") && largeCountries.includes(location.name.toLowerCase())) return "Yes"
    if (questionLower.includes("small") && !largeCountries.includes(location.name.toLowerCase())) return "Maybe"
  }

  // Default responses
  const responses = ["Yes", "No", "Maybe"]
  return responses[Math.floor(Math.random() * responses.length)]
}
