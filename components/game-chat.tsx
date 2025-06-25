"use client"

import { useEffect, useRef } from "react"
import { User, Bot } from "lucide-react"

interface ChatMessage {
  id: number
  type: "question" | "answer"
  content: string
  timestamp: Date
}

interface GameChatProps {
  messages: ChatMessage[]
}

export default function GameChat({ messages }: GameChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-spotify-dark-gray rounded-lg">
      {messages.length === 0 ? (
        <div className="text-center text-spotify-light-gray py-8">
          <Bot className="h-12 w-12 mx-auto mb-4 text-spotify-orange" />
          <p className="text-lg font-medium text-spotify-white">Ready to play!</p>
          <p className="text-sm">Ask your first yes/no question to get started.</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.type === "question" ? "justify-end" : "justify-start"}`}
          >
            {message.type === "answer" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-spotify-orange rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-spotify-white" />
                </div>
              </div>
            )}

            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === "question"
                  ? "bg-spotify-orange text-spotify-white"
                  : "bg-spotify-medium-gray text-spotify-white border border-spotify-light-gray/20"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.type === "question" ? "text-spotify-white/70" : "text-spotify-light-gray"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.type === "question" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-spotify-orange rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-spotify-white" />
                </div>
              </div>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
