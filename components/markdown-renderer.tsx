"use client"

import { useEffect, useState } from "react"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    // Enhanced markdown parser
    const parseMarkdown = (markdown: string) => {
      const parsedContent = markdown
        // Headers
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
        .replace(/^##### (.*$)/gm, "<h5>$1</h5>")
        .replace(/^###### (.*$)/gm, "<h6>$1</h6>")

        // Bold and Italic
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>")
        .replace(/_(.*?)_/g, "<em>$1</em>")

        // Links
        .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

        // Images
        .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" />')

        // Lists
        .replace(/^\s*\*\s(.*$)/gm, "<li>$1</li>")
        .replace(/^\s*-\s(.*$)/gm, "<li>$1</li>")
        .replace(/^\s*\d\.\s(.*$)/gm, "<li>$1</li>")

        // Code blocks
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")

        // Blockquotes
        .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")

        // Horizontal rule
        .replace(/^---$/gm, "<hr />")

        // Tables (basic support)
        .replace(/\|(.+)\|/g, "<tr><td>$1</td></tr>")
        .replace(/<tr><td>(.+)\|(.+)<\/td><\/tr>/g, "<tr><td>$1</td><td>$2</td></tr>")
        .replace(/<tr><td>(.+)\|(.+)\|(.+)<\/td><\/tr>/g, "<tr><td>$1</td><td>$2</td><td>$3</td></tr>")
        .replace(/(<tr>.+<\/tr>){2,}/g, "<table>$&</table>")

        // Paragraphs
        .replace(/^(?!<[a-z])(.*$)/gm, (match) => (match.trim() ? "<p>" + match + "</p>" : ""))

        // Fix for lists
        .replace(/<\/li>\s*<li>/g, "</li><li>")
        .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>")
        .replace(/<\/ul>\s*<ul>/g, "")

      return parsedContent
    }

    setHtml(parseMarkdown(content))
  }, [content])

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
