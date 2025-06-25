"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Target, Trophy, Play } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="bg-spotify-dark-gray shadow-sm border-b border-spotify-medium-gray">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Target className="h-8 w-8 text-spotify-orange" />
            <span className="text-2xl font-bold text-spotify-white">PinPoint</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-spotify-orange text-spotify-white"
                  : "text-spotify-light-gray hover:text-spotify-white hover:bg-spotify-medium-gray"
              }`}
            >
              <Play className="h-4 w-4" />
              <span className="font-medium">Play</span>
            </Link>

            <Link
              href="/leaderboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/leaderboard")
                  ? "bg-spotify-orange text-spotify-white"
                  : "text-spotify-light-gray hover:text-spotify-white hover:bg-spotify-medium-gray"
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span className="font-medium">Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
