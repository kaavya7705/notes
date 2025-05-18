"use client"

import type React from "react"

import { useState } from "react"
import { FileText, FileIcon as FileWord, Download, File, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface ExportMenuProps {
  documentTitle: string
  previewRef: React.RefObject<HTMLDivElement>
}

export function ExportMenu({ documentTitle, previewRef }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportAsPDF = async () => {
    if (!previewRef.current) return

    setIsExporting(true)
    try {
      // Load the html2pdf script dynamically
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
      script.async = true

      script.onload = () => {
        // Clone the preview div to avoid modifying the original
        const element = previewRef.current!.cloneNode(true) as HTMLElement

        // Apply some styling for better PDF output
        element.style.padding = "20px"
        element.style.fontSize = "14px"
        element.style.color = "#000"
        element.style.background = "#fff"

        // Use the globally loaded html2pdf
        const html2pdfInstance = (window as any).html2pdf

        if (typeof html2pdfInstance !== "function") {
          throw new Error("html2pdf is not available as a function")
        }

        const opt = {
          margin: [15, 15, 15, 15],
          filename: `${documentTitle}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        }

        html2pdfInstance()
          .set(opt)
          .from(element)
          .save()
          .then(() => {
            toast({
              title: "Export successful",
              description: `${documentTitle}.pdf has been downloaded.`,
              variant: "default",
            })
            setIsExporting(false)
          })
          .catch((error: any) => {
            console.error("PDF generation error:", error)
            toast({
              title: "Export failed",
              description: "There was an error generating the PDF. Please try again.",
              variant: "destructive",
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            setIsExporting(false)
          })
      }

      script.onerror = () => {
        console.error("Failed to load html2pdf script")
        toast({
          title: "Export failed",
          description:
            "Failed to load the PDF generation library. Please check your internet connection and try again.",
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        setIsExporting(false)
      }

      document.body.appendChild(script)

      // Clean up script tag after use
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    } catch (error) {
      console.error("PDF export failed:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting to PDF. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      setIsExporting(false)
    }
  }

  const exportAsWord = async () => {
    if (!previewRef.current) return

    setIsExporting(true)
    try {
      // Use a simple approach to convert HTML to a Word-compatible format
      const header =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>"
      const footer = "</body></html>"
      const sourceHTML = header + previewRef.current.innerHTML + footer

      const source = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(sourceHTML)
      const fileDownload = document.createElement("a")
      document.body.appendChild(fileDownload)
      fileDownload.href = source
      fileDownload.download = `${documentTitle}.doc`
      fileDownload.click()
      document.body.removeChild(fileDownload)

      toast({
        title: "Export successful",
        description: `${documentTitle}.doc has been downloaded.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Word export failed:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting to Word. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsHTML = () => {
    if (!previewRef.current) return

    setIsExporting(true)
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${documentTitle}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              font-weight: 600;
              line-height: 1.25;
            }
            h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h3 { font-size: 1.25em; }
            p, ul, ol { margin-bottom: 16px; }
            code {
              background-color: rgba(27, 31, 35, 0.05);
              border-radius: 3px;
              font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
              font-size: 85%;
              padding: 0.2em 0.4em;
            }
            pre {
              background-color: #f6f8fa;
              border-radius: 3px;
              font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
              font-size: 85%;
              line-height: 1.45;
              overflow: auto;
              padding: 16px;
            }
            blockquote {
              border-left: 0.25em solid #dfe2e5;
              color: #6a737d;
              padding: 0 1em;
              margin: 0 0 16px 0;
            }
            img { max-width: 100%; }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 16px;
            }
            table th, table td {
              border: 1px solid #dfe2e5;
              padding: 6px 13px;
            }
            table tr { background-color: #fff; }
            table tr:nth-child(2n) { background-color: #f6f8fa; }
          </style>
        </head>
        <body>
          ${previewRef.current.innerHTML}
        </body>
        </html>
      `

      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${documentTitle}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: `${documentTitle}.html has been downloaded.`,
        variant: "default",
      })
    } catch (error) {
      console.error("HTML export failed:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting to HTML. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isExporting}
          className="h-8 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportAsPDF} disabled={isExporting} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2 text-red-500" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsWord} disabled={isExporting} className="cursor-pointer">
          <FileWord className="h-4 w-4 mr-2 text-blue-500" />
          <span>Export as Word</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsHTML} disabled={isExporting} className="cursor-pointer">
          <File className="h-4 w-4 mr-2 text-orange-500" />
          <span>Export as HTML</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
