import React from "react";
import Link from "next/link";
import { Github } from "@/components/ui/icons";
import LoginButton from "@/components/auth/LoginButton";

export function Header(): React.JSX.Element {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Appis</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link href="/dashboards/github-summarizer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub Summarizer
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>

          <div className="flex items-center">
            <LoginButton className="bg-primary text-primary-foreground hover:bg-primary/90 border-0" />
          </div>
        </div>
      </div>
    </header>
  )
}
