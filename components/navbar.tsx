"use client"

import { FileText, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NavbarProps {
  onNewNote: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Navbar({ onNewNote, searchQuery, onSearchChange }: NavbarProps) {
  return (
    <header className="sticky top-3 z-10 flex h-auto items-center justify-center px-2 sm:px-4">
      <div className="flex w-full max-w-7xl items-center justify-between flex-col sm:flex-row rounded-2xl sm:rounded-full bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3 shadow-lg border border-slate-200 gap-3 sm:gap-0">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mini Notes
            </h1>
          </div>

          <Button
            onClick={onNewNote}
            className="sm:hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-md transition-all duration-300 rounded-full p-2"
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">New Note</span>
          </Button>
        </div>

        <div className="flex-1 w-full sm:max-w-xl sm:mx-4 md:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-indigo-400" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 sm:pl-12 py-2 sm:py-5 border-slate-200 rounded-full shadow-md focus-visible:ring-indigo-500 transition-all duration-200 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Button
            onClick={onNewNote}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-md transition-all duration-300 rounded-full px-4 sm:px-6 py-2 sm:py-5 text-base sm:text-lg"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            New Note
          </Button>
        </div>
      </div>
    </header>
  )
}
