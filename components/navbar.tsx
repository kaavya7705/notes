"use client"

import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onNewNote: () => void
}

export function Navbar({ onNewNote }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white/90 backdrop-blur-md px-4 shadow-md">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Markdown Notes
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onNewNote}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-md transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>
    </header>
  )
}
