"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameChat from "@/components/game-chat"
import Timer from "@/components/timer"
import { Send, Target, ArrowLeft } from "lucide-react"

interface ChatMessage {
  id: number
  type: "question" | "answer"
  content: string
  timestamp: Date
}

export default function GamePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") as "country" | "city"

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [currentGuess, setCurrentGuess] = useState("")
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [gameStartTime] = useState(new Date())
  const [isGameOver, setIsGameOver] = useState(false)

  // Mock AI responses - in a real app, this would connect to an AI service
  const getAIResponse = (question: string): string => {
    const responses = ["Yes", "No", "Maybe"]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSubmitQuestion = () => {
    if (!currentQuestion.trim() || questionsAsked >= 20 || isGameOver) return

    const questionMessage: ChatMessage = {
      id: Date.now(),
      type: "question",
      content: currentQuestion,
      timestamp: new Date(),
    }

    const aiResponse = getAIResponse(currentQuestion)
    const answerMessage: ChatMessage = {
      id: Date.now() + 1,
      type: "answer",
      content: aiResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, questionMessage, answerMessage])
    setQuestionsAsked((prev) => prev + 1)
    setCurrentQuestion("")
  }

  const handleSubmitGuess = () => {
    if (!currentGuess.trim() || isGameOver) return

    // Mock guess validation - in a real app, this would check against the correct answer
    const isCorrect = Math.random() > 0.7 // 30% chance of being correct for demo

    const guessMessage: ChatMessage = {
      id: Date.now(),
      type: "question",
      content: `My guess: ${currentGuess}`,
      timestamp: new Date(),
    }

    const resultMessage: ChatMessage = {
      id: Date.now() + 1,
      type: "answer",
      content: isCorrect ? "Correct! 🎉" : "Incorrect, keep trying!",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, guessMessage, resultMessage])

    if (isCorrect) {
      setIsGameOver(true)
    }

    setCurrentGuess("")
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: "question" | "guess") => {
    if (e.key === "Enter") {
      if (type === "question") {
        handleSubmitQuestion()
      } else {
        handleSubmitGuess()
      }
    }
  }

  if (!mode) {
    router.push("/")
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 border-spotify-light-gray text-spotify-white hover:bg-spotify-medium-gray hover:border-spotify-green"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Menu</span>
        </Button>

        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-sm text-spotify-light-gray">Mode</p>
            <p className="font-semibold capitalize text-spotify-orange">{mode}</p>
          </div>
          <Timer startTime={gameStartTime} isActive={!isGameOver} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col bg-spotify-medium-gray border-spotify-medium-gray">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-spotify-white">
                <Target className="h-5 w-5 text-spotify-orange" />
                <span>Game Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <GameChat messages={messages} />

              {/* Question Input */}
              <div className="mt-4 space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask a yes/no question..."
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, "question")}
                    disabled={questionsAsked >= 20 || isGameOver}
                    className="flex-1 bg-spotify-dark-gray border-spotify-light-gray text-spotify-white placeholder:text-spotify-light-gray focus:border-spotify-orange"
                  />
                  <Button
                    onClick={handleSubmitQuestion}
                    disabled={!currentQuestion.trim() || questionsAsked >= 20 || isGameOver}
                    className="px-4 bg-spotify-orange hover:bg-spotify-orange-dark text-spotify-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Guess Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder={`Enter your ${mode} guess...`}
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, "guess")}
                    disabled={isGameOver}
                    className="flex-1 bg-spotify-dark-gray border-spotify-light-gray text-spotify-white placeholder:text-spotify-light-gray focus:border-spotify-green"
                  />
                  <Button
                    onClick={handleSubmitGuess}
                    disabled={!currentGuess.trim() || isGameOver}
                    className="px-4 bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-white border border-spotify-light-gray"
                  >
                    Guess
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Stats */}
        <div className="space-y-4">
          <Card className="bg-spotify-medium-gray border-spotify-medium-gray">
            <CardHeader>
              <CardTitle className="text-spotify-white">Questions Asked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">
                <span
                  className={
                    questionsAsked >= 18
                      ? "text-red-500"
                      : questionsAsked >= 15
                        ? "text-yellow-500"
                        : "text-spotify-orange"
                  }
                >
                  {questionsAsked}
                </span>
                <span className="text-spotify-light-gray"> / 20</span>
              </div>
              <div className="w-full bg-spotify-dark-gray rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    questionsAsked >= 18 ? "bg-red-500" : questionsAsked >= 15 ? "bg-yellow-500" : "bg-spotify-orange"
                  }`}
                  style={{ width: `${(questionsAsked / 20) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {questionsAsked >= 20 && !isGameOver && (
            <Card className="border-red-500 bg-red-500/10">
              <CardContent className="pt-6">
                <p className="text-red-400 text-center font-semibold">No more questions! Make your final guess!</p>
              </CardContent>
            </Card>
          )}

          {isGameOver && (
            <Card className="border-spotify-orange bg-spotify-orange/10">
              <CardContent className="pt-6">
                <p className="text-spotify-orange text-center font-semibold">🎉 Congratulations! You won!</p>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full mt-4 bg-spotify-orange hover:bg-spotify-orange-dark text-spotify-white"
                >
                  Play Again
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
