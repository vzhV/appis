import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Code, CheckCircle2 } from "@/components/ui/icons";

export function InstallationGuide(): React.JSX.Element {
  return (
    <section id="installation" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">Installation & Usage</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get up and running with Appis in under 5 minutes. Choose your preferred method.
          </p>
        </div>

        <Tabs defaultValue="rest" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="rest">REST API</TabsTrigger>
            <TabsTrigger value="node">Node.js</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>

          {/* REST API */}
          <TabsContent value="rest" className="space-y-6">
            <Card className="p-8 bg-card border-border">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      Get Your API Key
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Sign up for a free account and copy your API key from the dashboard.
                    </p>
                    <Card className="p-4 bg-secondary/50 border-border/50">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{`# Your API key will look like this:
appis_1a2b3c4d5e6f7g8h9i0j`}</code>
                      </pre>
                    </Card>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      Make Your First Request
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Use any HTTP client to query GitHub repositories.
                    </p>
                    <Card className="p-4 bg-secondary/50 border-border/50">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{`curl -X GET "https://api.appis.dev/v1/repos/facebook/react" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
                      </pre>
                    </Card>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Get Instant Results
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Receive comprehensive JSON data with all repository insights.
                    </p>
                    <Card className="p-4 bg-secondary/50 border-border/50">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{`{
  "repository": {
    "name": "react",
    "owner": "facebook",
    "stars": 228000,
    "star_growth": {
      "last_week": 1250,
      "last_month": 5400,
      "last_year": 42000
    },
    "summary": "A declarative, efficient, and flexible...",
    "top_contributors": [
      { "username": "gaearon", "contributions": 1523 },
      { "username": "sophiebits", "contributions": 892 }
    ],
    "important_prs": [
      {
        "number": 28569,
        "title": "Add React Server Components",
        "impact_score": 9.8,
        "merged_at": "2024-03-15"
      }
    ],
    "health_metrics": {
      "activity_score": 9.5,
      "maintenance_score": 9.8,
      "community_score": 9.9
    }
  }
}`}</code>
                      </pre>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Node.js */}
          <TabsContent value="node" className="space-y-6">
            <Card className="p-8 bg-card border-border">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Install the SDK</h3>
                    <Card className="p-4 bg-secondary/50 border-border/50">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{`npm install @appis/sdk
# or
yarn add @appis/sdk
# or
pnpm add @appis/sdk`}</code>
                      </pre>
                    </Card>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Initialize the Client</h3>
                    <Card className="p-4 bg-secondary/50 border-border/50">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{`import { Appis } from '@appis/sdk';

const appis = new Appis({
  apiKey: process.env.APPIS_API_KEY
});`}</code>
                      </pre>
                    </Card>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Analyze Repositories</h3>
                    <Card className="p-4 bg-secondary/50 border-border/50">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{`// Get repository analysis
const analysis = await appis.repos.analyze('vercel/next.js');


// Get important PRs
const prs = await appis.repos.getImportantPRs('vercel/next.js', {
  limit: 10,
  minImpactScore: 8.0
});

// Get top contributors
const contributors = await appis.repos.getTopContributors(
  'vercel/next.js',
  { limit: 20 }
);`}</code>
                      </pre>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Python */}
          <TabsContent value="python" className="space-y-6">
            <Card className="p-8 bg-card border-border">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Install the Package</h3>
                    <Card className="p-4 bg-secondary/50 border-border/50">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{`pip install appis-sdk`}</code>
                      </pre>
                    </Card>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Initialize the Client</h3>
                    <Card className="p-4 bg-secondary/50 border-border/50">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{`from appis import Appis
import os

client = Appis(api_key=os.environ.get("APPIS_API_KEY"))`}</code>
                      </pre>
                    </Card>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Analyze Repositories</h3>
                    <Card className="p-4 bg-secondary/50 border-border/50">
                      <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{`# Get repository analysis
analysis = client.repos.analyze("tensorflow/tensorflow")

print(f"Stars: {analysis.stars}")
print(f"Monthly growth: {analysis.star_growth.last_month}")

# Get important PRs
prs = client.repos.get_important_prs(
    "tensorflow/tensorflow",
    limit=10,
    min_impact_score=8.0
)

for pr in prs:
    print(f"PR #{pr.number}: {pr.title} (Impact: {pr.impact_score})")

# Get top contributors
contributors = client.repos.get_top_contributors(
    "tensorflow/tensorflow",
    limit=20
)`}</code>
                      </pre>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Endpoints Reference */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Available Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 bg-card border-border">
              <code className="text-sm text-primary">GET /v1/repos/:owner/:repo</code>
              <p className="text-muted-foreground mt-2 text-sm">Get complete repository analysis</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <code className="text-sm text-primary">GET /v1/repos/:owner/:repo/prs</code>
              <p className="text-muted-foreground mt-2 text-sm">Get important pull requests</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <code className="text-sm text-primary">GET /v1/repos/:owner/:repo/contributors</code>
              <p className="text-muted-foreground mt-2 text-sm">Get top contributors</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <code className="text-sm text-primary">GET /v1/repos/:owner/:repo/stars</code>
              <p className="text-muted-foreground mt-2 text-sm">Get star history and growth</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
