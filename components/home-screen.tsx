"use client"

import { useState } from "react"
import { Plus, FileText, Trash2 } from 'lucide-react'
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
  const getTilt = () => {
    return 'rotate-[-2deg]'; // Fixed left tilt of -2 degrees
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-pattern">
      <div className="mx-auto max-w-7xl top-5">
        {/* Notes grid */}
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center top-5">
            <div className="mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 p-4 sm:p-5 shadow-md">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-500" />
            </div>
            <h3 className="mb-2 text-xl sm:text-2xl font-semibold text-slate-800">No notes found</h3>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-slate-500 max-w-md px-4">
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
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredNotes.map((note) => {
              const title = extractTitle(note.content)
              const preview = extractPreview(note.content)
              const tilt = getTilt()

              return (
                <div
                  key={note.id}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br border shadow-lg transition-all duration-300",
                    note.color || "from-amber-50 to-amber-100 border-amber-200",
                    tilt,
                    "hover:rotate-0",
                    "hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1",
                    "transform-gpu",
                    "min-h-[180px] h-full" // Adjusted minimum height and added h-full
                  )}
                  onClick={() => onNoteClick(note)}
                  onMouseEnter={() => setHoveredNoteId(note.id)}
                  onMouseLeave={() => setHoveredNoteId(null)}
                >
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Pin effect */}
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg z-10"></div>

                  <div className="relative z-10 flex h-full flex-col p-4 sm:p-7">
                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="font-semibold text-lg sm:text-xl line-clamp-1 text-slate-800">{title}</h3>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-black/5 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600 transition-colors" />
                      </button>
                    </div>
                    <p className="mb-4 text-sm sm:text-base text-slate-600 line-clamp-3 sm:line-clamp-4">{preview}</p>
                    <div className="mt-auto text-sm text-slate-500 font-medium">{formatDate(note.updatedAt)}</div>
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
