
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { SettingsProvider } from "@/contexts/SettingsContext"
import { NotificationManager } from "@/components/notifications/Notification"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Appis - API Management Platform",
  description: "Comprehensive API management platform for creating, managing, and monitoring API keys with advanced security features.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <AuthProvider>
          <SettingsProvider>
            <NotificationManager>
              {children}
            </NotificationManager>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

