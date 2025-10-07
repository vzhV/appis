import React from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Sparkles } from "@/components/ui/icons";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out Appis",
    features: [
      "100 API requests/month",
      "Basic repository analytics",
      "Star tracking",
      "Community support",
      "Rate limit: 10 req/min",
    ],
    cta: "Start Free",
    popular: false,
    comingSoon: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious developers and teams",
    features: [
      "10,000 API requests/month",
      "Advanced analytics",
      "PR importance scoring",
      "Contributor insights",
      "Priority support",
      "Rate limit: 100 req/min",
      "Custom webhooks",
    ],
    cta: "Start Pro Trial",
    popular: true,
    comingSoon: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Unlimited API requests",
      "All Pro features",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "On-premise deployment",
      "Advanced security",
    ],
    cta: "Contact Sales",
    popular: false,
    comingSoon: true,
  },
]

export function Pricing(): React.JSX.Element {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">Simple, transparent pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 bg-card border-border relative transition-all duration-300 hover:shadow-lg ${
                plan.popular ? "border-primary shadow-lg shadow-primary/20 scale-105" : "hover:border-primary/50"
              } ${plan.comingSoon ? "opacity-90" : ""}`}
            >
              {/* Badges */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
                {plan.popular && (
                  <Badge className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground text-sm font-semibold px-4 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                {plan.comingSoon && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-sm font-semibold px-4 py-1">
                    Coming Soon
                  </Badge>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  } ${plan.comingSoon ? "opacity-60 cursor-not-allowed" : ""}`}
                  size="lg"
                  disabled={plan.comingSoon}
                >
                  {plan.comingSoon ? "Coming Soon" : plan.cta}
                </Button>

                <Separator className="my-6" />

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
