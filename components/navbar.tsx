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
    <header className="sticky top-3 z-10 flex h-15 items-center justify-center px-4">
      <div className="flex w-full max-w-7xl items-center justify-between rounded-full bg-white/90 backdrop-blur-md px-6 py-3 shadow-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mini Notes
            </h1>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400 " />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 py-5  border-slate-200 rounded-full shadow-md focus-visible:ring-indigo-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onNewNote}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-md transition-all duration-300 rounded-full px-6 py-5 text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Note
          </Button>
        </div>
      </div>
    </header>
  )
}
