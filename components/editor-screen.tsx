"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Editor } from "@/components/editor"
import type { Note } from "@/components/notes-app"

interface EditorScreenProps {
  note: Note
  updateNote: (note: Note) => void
  onClose: () => void
}

export function EditorScreen({ note, updateNote, onClose }: EditorScreenProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center border-b bg-white/90 backdrop-blur-md px-4 py-2 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="mr-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-medium text-slate-700">
          {note.content.match(/^# (.+)$/m)?.[1] || "Untitled Note"}
        </h2>
      </div>
      <Editor note={note} updateNote={updateNote} />
    </div>
  )
}
