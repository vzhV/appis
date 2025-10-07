import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";

export function CTA(): React.JSX.Element {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-chart-2/10 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl text-center">
        <div className="space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
            Ready to unlock GitHub insights?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Join thousands of developers using Appis to analyze repositories and make data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-12">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-12 border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required • Free tier available forever • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
