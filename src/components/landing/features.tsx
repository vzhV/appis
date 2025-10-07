import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, GitPullRequest, Star, TrendingUp, Users, Zap, Sparkles } from "@/components/ui/icons";

const features = [
  {
    icon: BarChart3,
    title: "Repository Analytics",
    description: "Get comprehensive metrics on commits, contributors, and code activity over time.",
    badge: "Available",
  },
  {
    icon: Star,
    title: "Star Tracking",
    description: "Monitor star growth trends and identify viral moments for any repository.",
    badge: "Available",
  },
  {
    icon: GitPullRequest,
    title: "Important PRs",
    description: "Automatically identify and surface the most impactful pull requests.",
    badge: "Coming Soon",
  },
  {
    icon: Users,
    title: "Contributor Insights",
    description: "Analyze contributor patterns, top contributors, and community health.",
    badge: "Coming Soon",
  },
  {
    icon: TrendingUp,
    title: "Growth Metrics",
    description: "Track repository growth, engagement trends, and community momentum.",
    badge: "Available",
  },
  {
    icon: Zap,
    title: "Lightning Fast API",
    description: "Sub-second response times with cached data and real-time updates.",
    badge: "Available",
  },
]

export function Features(): React.JSX.Element {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Everything you need to analyze GitHub
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful features designed for developers who need deep insights into open source projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 relative"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge 
                    variant={feature.badge === "Available" ? "default" : "secondary"}
                    className={`text-xs ${
                      feature.badge === "Available" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    }`}
                  >
                    {feature.badge === "Available" ? (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        Available
                      </>
                    ) : (
                      "Coming Soon"
                    )}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
