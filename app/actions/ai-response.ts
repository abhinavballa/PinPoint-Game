"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import type { Location } from "@/lib/database"

export async function getAIResponse(question: string, location: Location): Promise<string> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
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
      maxTokens: 10,
    })

    // Ensure we only return valid responses
    const response = text.trim()
    if (["Yes", "No", "Maybe"].includes(response)) {
      return response
    }

    return "Maybe"
  } catch (error) {
    console.error("AI Response Error:", error)
    // Simple fallback if AI fails
    const responses = ["Yes", "No", "Maybe"]
    return responses[Math.floor(Math.random() * responses.length)]
  }
}
