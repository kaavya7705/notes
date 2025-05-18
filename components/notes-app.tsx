"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HomeScreen } from "@/components/home-screen"
import { EditorScreen } from "@/components/editor-screen"
import { useIsMobile } from "@/hooks/use-mobile"

export type Note = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  color?: string
}

// Array of professional gradient colors for sticky notes
const NOTE_COLORS = [
  "from-amber-50 to-amber-100 border-amber-200",
  "from-blue-50 to-blue-100 border-blue-200",
  "from-emerald-50 to-emerald-100 border-emerald-200",
  "from-violet-50 to-violet-100 border-violet-200",
  "from-rose-50 to-rose-100 border-rose-200",
  "from-yellow-50 to-yellow-100 border-yellow-200",
  "from-sky-50 to-sky-100 border-sky-200",
  "from-teal-50 to-teal-100 border-teal-200",
]

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useIsMobile()

  // Initialize with default notes if no notes exist
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes) as Note[]

      // Add colors to existing notes if they don't have them
      const notesWithColors = parsedNotes.map((note) => {
        if (!note.color) {
          return {
            ...note,
            color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
          }
        }
        return note
      })

      setNotes(notesWithColors)
    } else {
      createNewNote()
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  }, [notes])

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "# Untitled Note\n\nStart writing your note here...",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    }

    setNotes((prev) => [newNote, ...prev])
    return newNote
  }

  const updateNote = (updatedNote: Note) => {
    setNotes((prev) => prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
    setCurrentNote(updatedNote)
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))

    if (currentNote?.id === id) {
      setCurrentNote(null)
      setIsEditorOpen(false)
    }
  }

  const openNote = (note: Note) => {
    setCurrentNote(note)
    setIsEditorOpen(true)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
  }

  const handleCreateNewNote = () => {
    const newNote = createNewNote()
    openNote(newNote)
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {!isEditorOpen && (
        <Navbar 
          onNewNote={handleCreateNewNote} 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
      )}

      {isEditorOpen && currentNote ? (
        <EditorScreen note={currentNote} updateNote={updateNote} onClose={closeEditor} />
      ) : (
        <HomeScreen 
          notes={notes} 
          onNoteClick={openNote} 
          onDeleteNote={deleteNote} 
          onNewNote={handleCreateNewNote}
          searchQuery={searchQuery}
        />
      )}
    </div>
  )
}
