"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Download, Save, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { ExportMenu } from "@/components/export-menu"
import type { Note } from "@/components/notes-app"

interface EditorProps {
  note: Note
  updateNote: (note: Note) => void
}

export function Editor({ note, updateNote }: EditorProps) {
  const [content, setContent] = useState(note.content)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [splitPosition, setSplitPosition] = useState(50) // percentage
  const resizeDivRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null!)
  const isMobile = useIsMobile()

  // Update content when note changes
  useEffect(() => {
    setContent(note.content)
  }, [note.id, note.content])

  // Update word and character count
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    const chars = content.length

    setWordCount(words)
    setCharCount(chars)
  }, [content])

  // Handle saving the note
  const handleSave = () => {
    setIsSaving(true)

    const updatedNote = {
      ...note,
      content,
      updatedAt: Date.now(),
    }

    updateNote(updatedNote)

    setTimeout(() => {
      setIsSaving(false)
    }, 500)
  }

  // Handle exporting the note as .md file
  const handleExportMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")

    // Extract title from content for filename
    const titleMatch = content.match(/^# (.+)$/m)
    const fileName = titleMatch ? `${titleMatch[1]}.md` : "untitled.md"

    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle resizing the split panes
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Limit the resizing range
      if (newPosition > 20 && newPosition < 80) {
        setSplitPosition(newPosition)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  // Auto-save on content change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== note.content) {
        const updatedNote = {
          ...note,
          content,
          updatedAt: Date.now(),
        }
        updateNote(updatedNote)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, note, updateNote])

  // Extract title for export filename
  const getDocumentTitle = () => {
    const titleMatch = content.match(/^# (.+)$/m)
    return titleMatch ? titleMatch[1] : "Untitled Note"
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className={cn("flex flex-1 overflow-hidden", isMobile ? "flex-col" : "flex-row")}>
        {/* Editor Pane */}
        <div
          className={cn("flex flex-col overflow-hidden", isMobile ? "h-1/2" : `w-[${splitPosition}%]`)}
          style={!isMobile ? { width: `${splitPosition}%` } : undefined}
        >
          <div className="border-b bg-gradient-to-r from-indigo-50 via-purple-50 to-white px-4 py-2 text-sm font-medium text-slate-700 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-indigo-500" />
            <span>Editor</span>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none rounded-none border-0 border-r border-r-slate-200 font-mono text-sm shadow-none focus-visible:ring-0 bg-white/50 p-4"
            placeholder="Start writing your markdown here..."
          />
        </div>

        {/* Resize Handle */}
        {!isMobile && (
          <div
            ref={resizeDivRef}
            className={cn(
              "w-1 cursor-col-resize bg-slate-200 hover:bg-indigo-400 active:bg-indigo-500 transition-colors",
              isResizing && "bg-indigo-500",
            )}
            onMouseDown={handleMouseDown}
          />
        )}

        {/* Preview Pane */}
        <div
          className={cn("flex flex-col overflow-hidden", isMobile ? "h-1/2" : `w-[${100 - splitPosition}%]`)}
          style={!isMobile ? { width: `${100 - splitPosition}%` } : undefined}
        >
          <div className="border-b bg-gradient-to-r from-indigo-50 via-purple-50 to-white px-4 py-2 text-sm font-medium text-slate-700 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-indigo-500" />
              <span>Preview</span>
            </div>
            <ExportMenu documentTitle={getDocumentTitle()} previewRef={previewRef} />
          </div>
          <div ref={previewRef} className="prose prose-sm max-w-none flex-1 overflow-auto p-5 bg-white/50">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>

      {/* Footer with stats and actions */}
      <div className="border-t bg-gradient-to-r from-indigo-50 via-purple-50 to-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-slate-500 font-medium flex items-center">
            <div className="flex items-center mr-4">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-2"></span>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
              {charCount} {charCount === 1 ? "character" : "characters"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 shadow-sm"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Note"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 shadow-sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Export as .md
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
