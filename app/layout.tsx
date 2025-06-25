import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PinPoint - Geography Guessing Game",
  description: "Test your geography knowledge by asking yes/no questions",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-spotify-black">
          <Navigation />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
