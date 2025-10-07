import React from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Code2, Database, Rocket } from "@/components/ui/icons";

const steps = [
  {
    icon: Rocket,
    step: "01",
    title: "Sign Up & Get API Key",
    description: "Create your free account and receive your API key instantly. No credit card required.",
  },
  {
    icon: Code2,
    step: "02",
    title: "Make Your First Request",
    description: "Use our simple REST API to query any public GitHub repository. Full documentation included.",
  },
  {
    icon: Database,
    step: "03",
    title: "Get Instant Insights",
    description: "Receive comprehensive JSON responses with all the data you need in milliseconds.",
  },
]

export function HowItWorks(): React.JSX.Element {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">Get started in minutes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Three simple steps to unlock powerful GitHub analytics for your projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2" />
              )}
              <Card className="p-8 bg-card border-border relative z-10 h-full">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <span className="text-5xl font-bold text-primary/20">{step.step}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Code example */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="p-6 bg-secondary/50 border-border">
            <pre className="text-sm text-foreground overflow-x-auto">
              <code>{`curl -X GET "https://api.appis.dev/v1/repos/vercel/next.js" \\
  -H "Authorization: Bearer YOUR_API_KEY"

{
  "name": "next.js",
  "stars": 125000,
  "star_growth": "+2.5k this month",
  "top_contributors": [...],
  "important_prs": [...]
}`}</code>
            </pre>
          </Card>
        </div>
      </div>
    </section>
  )
}
