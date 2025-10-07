import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Send, Database } from "@/components/ui/icons"

export function ApiShowcase() {
  return (
    <section id="api-showcase" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            See it in action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get instant insights from any GitHub repository with our powerful API. Here's how easy it is to use.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Request Section */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Request</h3>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  POST
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Endpoint</p>
                  <code className="block bg-muted px-3 py-2 rounded text-sm font-mono text-foreground">
                    https://appis-omega.vercel.app/api/github-summarizer
                  </code>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Request Body</p>
                  <pre className="bg-muted p-4 rounded text-sm font-mono text-foreground overflow-x-auto">
{`{
  "githubUrl": "https://github.com/vzhV/vz-env"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </Card>

          {/* Response Section */}
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-chart-2" />
                  <h3 className="text-xl font-semibold text-foreground">Response</h3>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  200 OK
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Response Body</p>
                  <pre className="bg-muted p-4 rounded text-sm font-mono text-foreground overflow-x-auto max-h-96">
{`{
  "success": true,
  "data": {
    "githubUrl": "https://github.com/vzhV/vz-env",
    "summary": "vz-env is a powerful CLI tool designed to streamline the management and validation of environment variables...",
    "coolFacts": [
      "vz-env supports syncing variables between .env files",
      "It offers encryption for sensitive information",
      "Generates Markdown documentation automatically",
      "Provides validation for required variables",
      "Highly configurable with .vz-envrc settings"
    ]
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Try It Yourself Section */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-chart-2/10 border-primary/20">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Ready to try it yourself?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get your API key and start analyzing GitHub repositories in seconds. 
                Perfect for developers, researchers, and teams who need deep insights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Your API Key
                </Button>
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
                  View Documentation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}