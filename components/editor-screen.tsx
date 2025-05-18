"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, FileText, Save, X, HelpCircle, Palette, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Editor } from "@/components/editor"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Note } from "@/components/notes-app"

// Array of professional gradient colors for sticky notes (copied from notes-app)
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

interface EditorScreenProps {
  note: Note
  updateNote: (note: Note) => void
  onClose: () => void
  onDeleteNote?: (id: string) => void
}

export function EditorScreen({ note, updateNote, onClose, onDeleteNote }: EditorScreenProps) {
  const [title, setTitle] = useState<string>(note.content.match(/^# (.+)$/m)?.[1] || "Untitled Note")
  const [wordCount, setWordCount] = useState<number>(0)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [showTutorial, setShowTutorial] = useState<boolean>(localStorage.getItem("markdown_tutorial_seen") !== "true")
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false)
  const [originalContent, setOriginalContent] = useState<string>(note.content)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false)

  // Calculate word count
  useEffect(() => {
    const text = note.content.replace(/^#.*$/gm, "").trim() // Remove headings
    const words = text.split(/\s+/).filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [note.content])

  // Update title when content changes
  useEffect(() => {
    const newTitle = note.content.match(/^# (.+)$/m)?.[1] || "Untitled Note"
    setTitle(newTitle)
  }, [note.content])

  // Format timestamp
  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Save note with updated timestamp
  const handleSave = useCallback(() => {
    setIsSaving(true)

    const updatedNote = {
      ...note,
      updatedAt: Date.now(),
      title: title, // Update title based on content
    }

    updateNote(updatedNote)

    setTimeout(() => {
      setIsSaving(false)
    }, 600)
  }, [note, title, updateNote])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save on Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSave])

  // Change note color
  const changeNoteColor = (color: string) => {
    const updatedNote = {
      ...note,
      color,
      updatedAt: Date.now(),
    }
    updateNote(updatedNote)
  }

  // Reset note to original content
  const resetNote = () => {
    const updatedNote = {
      ...note,
      content: originalContent,
      updatedAt: Date.now(),
    }
    updateNote(updatedNote)
    setShowResetDialog(false)
  }

  // Delete the current note
  const deleteNote = () => {
    onClose()
    // We assume onDeleteNote is passed as a prop
    if (typeof onDeleteNote === "function") {
      onDeleteNote(note.id)
    }
    setShowDeleteDialog(false)
  }

  // Close tutorial and remember
  const closeTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem("markdown_tutorial_seen", "true")
  }

  // Export note as text
  const exportAsText = () => {
    const element = document.createElement("a")
    const file = new Blob([note.content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Export note as HTML
  const exportAsHTML = () => {
    // Simple Markdown to HTML conversion (basic implementation)
    const html = note.content
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />")

    const element = document.createElement("a")
    const file = new Blob(
      [
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`,
      ],
      { type: "text/html" },
    )
    element.href = URL.createObjectURL(file)
    element.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Store original content when note changes
  useEffect(() => {
    setOriginalContent(note.content)
  }, [note.id])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b bg-white/90 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-3 shadow-sm sticky top-0 z-10 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to notes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div
            className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br ${note.color?.split(" ")[0] || "from-indigo-50"} ${note.color?.split(" ")[1] || "to-purple-100"} text-slate-700 shadow-md`}
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div className="flex flex-col">
            <h2 className="text-sm sm:text-base font-medium text-slate-700 truncate max-w-[180px] sm:max-w-[240px] md:max-w-[400px]">
              {title}
            </h2>
            <p className="text-xs text-slate-500">Last edited: {formatDate(note.updatedAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors h-8 w-8 sm:h-10 sm:w-10"
              >
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto p-3 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Markdown Guide</DialogTitle>
              </DialogHeader>
              <MarkdownTutorial />
            </DialogContent>
          </Dialog>

          

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition-all text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
                >
                  {isSaving ? (
                    <span className="animate-pulse">Saving...</span>
                  ) : (
                    <>
                      <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save changes (Ctrl+S)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Tutorial Dialog */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto w-full">
            <div className="p-3 sm:p-6">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Welcome to Markdown Notes!</h2>
                <Button variant="ghost" size="icon" onClick={closeTutorial} className="text-slate-500">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <MarkdownTutorial />
              <div className="mt-4 sm:mt-6 flex justify-end">
                <Button
                  onClick={closeTutorial}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base"
                >
                  Got it! Let's start writing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <Editor note={note} updateNote={updateNote} />
      </div>

      {/* Footer */}
      <div className="border-t bg-white/90 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm text-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge
            variant="outline"
            className="bg-slate-50 border-slate-200 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1"
          >
            {wordCount} words
          </Badge>

          <span className="hidden sm:inline">
            Press{" "}
            <kbd className="px-1 sm:px-2 py-0.5 bg-slate-100 border rounded text-xs sm:text-sm font-mono">Ctrl+S</kbd>{" "}
            to save
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-indigo-600 text-xs sm:text-sm h-7 sm:h-8"
              >
                <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Colors
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <div className="p-2">
                <div className="grid grid-cols-4 gap-2">
                  {NOTE_COLORS.map((color, index) => (
                    <button
                      key={index}
                      className={`h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br ${color.split(" ")[0]} ${color.split(" ")[1]} border ${color.split(" ")[2]} hover:opacity-80 transition-opacity`}
                      onClick={() => changeNoteColor(color)}
                    />
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Export Panel */}
      {showExportOptions && (
        <div className="border-t bg-slate-50 p-2 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsText}
            className="text-slate-700 hover:bg-slate-100 text-xs sm:text-sm"
          >
            Export as Markdown
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsHTML}
            className="text-slate-700 hover:bg-slate-100 text-xs sm:text-sm"
          >
            Export as HTML
          </Button>
        </div>
      )}
    </div>
  )
}

// Markdown Tutorial Component
function MarkdownTutorial() {
  return (
    <div className="space-y-4 sm:space-y-6 py-2 sm:py-4 text-sm sm:text-base">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-indigo-600">Headings</h3>
        <div className="bg-slate-50 p-3 sm:p-4 rounded-md space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm">
          <p># Heading 1</p>
          <p>## Heading 2</p>
          <p>### Heading 3</p>
        </div>
        <p className="mt-1 sm:mt-2 text-slate-600 text-xs sm:text-sm">
          Use hashtags for headings. More hashtags = smaller heading.
        </p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-indigo-600">Text Formatting</h3>
        <div className="bg-slate-50 p-3 sm:p-4 rounded-md space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm">
          <p>**Bold text**</p>
          <p>*Italic text*</p>
          <p>~~Strikethrough~~</p>
        </div>
        <p className="mt-1 sm:mt-2 text-slate-600 text-xs sm:text-sm">
          Format your text to emphasize important points.
        </p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-indigo-600">Lists</h3>
        <div className="bg-slate-50 p-3 sm:p-4 rounded-md space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm">
          <p>- Unordered item</p>
          <p>- Another item</p>
          <p className="mt-1 sm:mt-2">1. Ordered item</p>
          <p>2. Second item</p>
        </div>
        <p className="mt-1 sm:mt-2 text-slate-600 text-xs sm:text-sm">
          Create organized lists with bullets or numbers.
        </p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-indigo-600">Links and Images</h3>
        <div className="bg-slate-50 p-3 sm:p-4 rounded-md space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm">
          <p>[Link text](https://example.com)</p>
          <p>![Image alt text](image-url.jpg)</p>
        </div>
        <p className="mt-1 sm:mt-2 text-slate-600 text-xs sm:text-sm">
          Add hyperlinks to websites or embed images in your notes.
        </p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-indigo-600">Code</h3>
        <div className="bg-slate-50 p-3 sm:p-4 rounded-md space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm">
          <p>`Inline code`</p>
          <div className="mt-1 sm:mt-2">
            <p>\`\`\`</p>
            <p>Code block</p>
            <p>with multiple lines</p>
            <p>\`\`\`</p>
          </div>
        </div>
        <p className="mt-1 sm:mt-2 text-slate-600 text-xs sm:text-sm">
          Format code snippets with proper syntax highlighting.
        </p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-indigo-600">Blockquotes</h3>
        <div className="bg-slate-50 p-3 sm:p-4 rounded-md space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm">
          <p>{">"} This is a blockquote</p>
          <p>{">"} You can have multiple lines</p>
        </div>
        <p className="mt-1 sm:mt-2 text-slate-600 text-xs sm:text-sm">Quote text or highlight important sections.</p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-indigo-600">Tables</h3>
        <div className="bg-slate-50 p-3 sm:p-4 rounded-md space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm">
          <p>| Header 1 | Header 2 |</p>
          <p>| -------- | -------- |</p>
          <p>| Cell 1 | Cell 2 |</p>
          <p>| Cell 3 | Cell 4 |</p>
        </div>
        <p className="mt-1 sm:mt-2 text-slate-600 text-xs sm:text-sm">Create structured tables for organized data.</p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-indigo-600">Horizontal Rule</h3>
        <div className="bg-slate-50 p-3 sm:p-4 rounded-md font-mono text-xs sm:text-sm">
          <p>---</p>
        </div>
        <p className="mt-1 sm:mt-2 text-slate-600 text-xs sm:text-sm">Add a horizontal line to separate sections.</p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-indigo-600">Keyboard Shortcuts</h3>
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-slate-600 text-xs sm:text-sm">
          <li>
            <kbd className="px-1 sm:px-2 py-0.5 bg-slate-100 border rounded text-xs">Ctrl+S</kbd> - Save note
          </li>
          <li>
            <kbd className="px-1 sm:px-2 py-0.5 bg-slate-100 border rounded text-xs">Ctrl+B</kbd> - Bold text
          </li>
          <li>
            <kbd className="px-1 sm:px-2 py-0.5 bg-slate-100 border rounded text-xs">Ctrl+I</kbd> - Italic text
          </li>
        </ul>
      </div>

      <div className="bg-indigo-50 p-3 sm:p-4 rounded-md border border-indigo-100">
        <p className="text-slate-700 text-xs sm:text-sm">
          <strong>Pro tip:</strong> Your first line with a # heading will automatically become your note title!
        </p>
      </div>
    </div>
  )
}
