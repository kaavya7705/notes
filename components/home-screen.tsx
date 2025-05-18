"use client"

import { useState } from "react"
import { Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Note } from "@/components/notes-app"

interface HomeScreenProps {
  notes: Note[]
  onNoteClick: (note: Note) => void
  onDeleteNote: (id: string) => void
  onNewNote: () => void
  searchQuery: string // Add this prop
}

export function HomeScreen({ notes, onNoteClick, onDeleteNote, onNewNote, searchQuery }: HomeScreenProps) {
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null)

  // Extract title from markdown content (first heading or first line)
  const extractTitle = (content: string): string => {
    const headingMatch = content.match(/^# (.+)$/m)
    if (headingMatch) return headingMatch[1]

    const firstLine = content.split("\n")[0].trim()
    return firstLine || "Untitled Note"
  }

  // Extract preview content (first few lines after title)
  const extractPreview = (content: string): string => {
    const lines = content.split("\n")
    // Skip the title line if it starts with #
    const startIndex = lines[0].startsWith("# ") ? 1 : 0

    // Get the next few lines for preview
    return (
      lines
        .slice(startIndex, startIndex + 3)
        .join("\n")
        .replace(/[#*_~`]/g, "") // Remove markdown syntax
        .trim()
        .substring(0, 120) + (content.length > 120 ? "..." : "")
    )
  }

  // Format date to readable string
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  }

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => note.content.toLowerCase().includes(searchQuery.toLowerCase()))

  // Generate a random rotation between -2 and 2 degrees
  const getRandomRotation = () => {
    return `rotate-[${(Math.random() * 4 - 2).toFixed(1)}deg]`
  }

  return (
    <div className="flex-1 overflow-auto p-6 md:p-8 bg-pattern">
      <div className="mx-auto max-w-7xl">
        {/* Notes grid */}
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 p-5 shadow-md">
              <FileText className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-slate-800">No notes found</h3>
            <p className="mb-6 text-slate-500 max-w-md">
              {notes.length === 0 ? "Create your first note to get started" : "Try a different search query"}
            </p>
            {notes.length === 0 && (
              <Button
                onClick={onNewNote}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-md transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => {
              const title = extractTitle(note.content)
              const preview = extractPreview(note.content)
              const randomRotation = getRandomRotation()

              return (
                <div
                  key={note.id}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br border shadow-lg transition-all duration-300",
                    note.color || "from-amber-50 to-amber-100 border-amber-200",
                    randomRotation,
                    "hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1",
                  )}
                  onClick={() => onNoteClick(note)}
                  onMouseEnter={() => setHoveredNoteId(note.id)}
                  onMouseLeave={() => setHoveredNoteId(null)}
                >
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Pin effect */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-sm z-10"></div>

                  <div className="relative z-10 flex h-full flex-col p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="font-semibold text-lg line-clamp-1 text-slate-800">{title}</h3>
                    </div>
                    <p className="mb-4 text-sm text-slate-600 line-clamp-4">{preview}</p>
                    <div className="mt-auto text-xs text-slate-500 font-medium">{formatDate(note.updatedAt)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
