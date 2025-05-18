import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mini Notes",
  description: "A modern markdown notes application",
  icons: {
    icon: "https://img.freepik.com/premium-vector/3d-illustration-sticky-note-isolated-white-background_598925-972.jpg",
    shortcut: "https://img.freepik.com/premium-vector/3d-illustration-sticky-note-isolated-white-background_598925-972.jpg",
    apple: "https://img.freepik.com/premium-vector/3d-illustration-sticky-note-isolated-white-background_598925-972.jpg",
  },
    
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
