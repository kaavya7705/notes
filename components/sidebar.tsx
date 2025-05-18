"use client"

import { useState } from "react"
import { ChevronRight, FilePlus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Note } from "@/components/notes-app"

interface SidebarProps {
  notes: Note[]
  currentNote: Note | null
  setCurrentNote: (note: Note) => void
  createNewNote: () => void
  deleteNote: (id: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({
  notes,
  currentNote,
  setCurrentNote,
  createNewNote,
  deleteNote,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const isMobile = useIsMobile()
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null)

  // Extract title from markdown content (first heading or first line)
  const extractTitle = (content: string): string => {
    const headingMatch = content.match(/^# (.+)$/m)
    if (headingMatch) return headingMatch[1]

    const firstLine = content.split("\n")[0].trim()
    return firstLine || "Untitled Note"
  }

  // Format date to readable string
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div
      className={cn(
        "border-r bg-muted/40 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0",
        isMobile && isOpen ? "absolute inset-y-0 left-0 z-20 w-64" : "",
      )}
    >
      {isOpen && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold">Notes</h2>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between p-2">
            <Button variant="outline" size="sm" className="w-full" onClick={createNewNote}>
              <FilePlus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "relative flex cursor-pointer flex-col rounded-md p-2 transition-colors",
                    currentNote?.id === note.id ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                  )}
                  onClick={() => setCurrentNote(note)}
                  onMouseEnter={() => setHoveredNoteId(note.id)}
                  onMouseLeave={() => setHoveredNoteId(null)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{extractTitle(note.content)}</span>
                    {hoveredNoteId === note.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id)
                        }}
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(note.updatedAt)}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      {!isOpen && !isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-[72px] h-8 w-4 rounded-none rounded-r-md border border-l-0 bg-muted/40"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
