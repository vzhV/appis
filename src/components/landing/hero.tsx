import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Sparkles, Zap } from "@/components/ui/icons";
import LoginButton from "@/components/auth/LoginButton";

export function Hero(): React.JSX.Element {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          {/* Special Alert */}
          <Alert className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-chart-2/10 border-primary/20">
            <Zap className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground font-medium">
              🚀 <strong>Early Access Available!</strong> Be among the first to experience our advanced GitHub analytics API. Pro and Enterprise plans launching soon!
            </AlertDescription>
          </Alert>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">Analyze GitHub repos in seconds</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground text-balance leading-tight">
            Unlock insights from{" "}
            <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              any GitHub repository
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Get instant API access to comprehensive repository analysis, star trends, important PRs, and contributor
            insights. Perfect for developers, researchers, and teams.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <LoginButton className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-12 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </LoginButton>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-12 border-border text-foreground hover:bg-secondary bg-transparent"
            >
              View Documentation
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Trusted by developers at</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <span className="text-lg font-semibold text-foreground">Vercel</span>
              <span className="text-lg font-semibold text-foreground">GitHub</span>
              <span className="text-lg font-semibold text-foreground">Stripe</span>
              <span className="text-lg font-semibold text-foreground">Linear</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
