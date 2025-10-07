'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Sparkles, Loader2, ExternalLink, BookOpen, Star, Key } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NavigationLayout from '@/components/layout/NavigationLayout';
import { useApiKeys } from '@/hooks/useApiKeys';
import { ApiKey } from '@/types/api-keys';
import { authenticatedFetchWithApiKey } from '@/lib/api/auth-helpers';

export default function GitHubSummarizerPage(): React.JSX.Element {
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const { apiKeys, isLoading: apiKeysLoading } = useApiKeys();

  // Auto-select first active API key when available
  useEffect(() => {
    if (apiKeys.length > 0 && !selectedApiKey) {
      const firstActiveKey = apiKeys.find(key => key.is_active);
      if (firstActiveKey) {
        setSelectedApiKey(firstActiveKey.id);
      }
    }
  }, [apiKeys, selectedApiKey]);

  const getSelectedApiKey = (): ApiKey | null => {
    return apiKeys.find(key => key.id === selectedApiKey) || null;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!input.trim()) {
      setError('Please enter a GitHub repository URL or username/repo');
      return;
    }

    if (!selectedApiKey) {
      setError('Please select an API key to use');
      return;
    }

    const apiKey = getSelectedApiKey();
    if (!apiKey || !apiKey.is_active) {
      setError('Selected API key is not active');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await authenticatedFetchWithApiKey('/api/github-summarizer', apiKey.key, {
        method: 'POST',
        body: JSON.stringify({ githubUrl: input }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to summarize the repository');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !isLoading) {
      void handleSubmit();
    }
  };

  return (
    <ProtectedRoute>
      <NavigationLayout pageTitle="GitHub Summarizer" pageSubtitle="AI-Powered Repository Analysis">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full mr-3">
                <Github className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">GitHub Summarizer</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant AI-powered summaries of any GitHub repository. Just paste the URL or enter username/repo!
            </p>
          </div>

          {/* API Keys Loading */}
          {apiKeysLoading && (
            <Card className="mb-8">
              <CardContent className="py-6">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading API keys...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Key Selection */}
          {!apiKeysLoading && apiKeys.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-primary" />
                  Select API Key
                </CardTitle>
                <CardDescription>
                  Choose which API key to use for this request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {apiKeys.map((apiKey) => (
                      <div
                        key={apiKey.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedApiKey === apiKey.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedApiKey(apiKey.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              apiKey.is_active ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                            <div>
                              <h4 className="font-medium text-foreground">{apiKey.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {apiKey.type} • {apiKey.is_active ? 'Active' : 'Inactive'} • Limit: {apiKey.monthly_limit || 'Unlimited'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Used: {apiKey.usage || 0} / {apiKey.monthly_limit || '∞'}
                            </p>
                            <div className="w-20 h-2 bg-secondary rounded-full mt-1">
                              <div 
                                className="h-2 bg-primary rounded-full transition-all"
                                style={{ 
                                  width: `${apiKey.monthly_limit ? Math.min(((apiKey.usage || 0) / apiKey.monthly_limit) * 100, 100) : 0}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No API Keys Message */}
          {!apiKeysLoading && apiKeys.length === 0 && (
            <Card className="mb-8 border-destructive">
              <CardContent className="py-6">
                <div className="text-center">
                  <Key className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-destructive mb-2">No API Keys Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to create an API key first to use the GitHub Summarizer.
                  </p>
                  <Button asChild>
                    <a href="/dashboards/keys">
                      <Key className="w-4 h-4 mr-2" />
                      Go to API Keys
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Repository Input
              </CardTitle>
              <CardDescription>
                Enter a GitHub repository URL or username/repo format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="https://github.com/username/repo or username/repo"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading || !input.trim() || !selectedApiKey || apiKeysLoading || apiKeys.length === 0}
                    className="px-8"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Summarize
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Example formats */}
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Examples:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-secondary/50 rounded text-xs">facebook/react</span>
                    <span className="px-2 py-1 bg-secondary/50 rounded text-xs">microsoft/vscode</span>
                    <span className="px-2 py-1 bg-secondary/50 rounded text-xs">https://github.com/vercel/next.js</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="mb-8 border-destructive">
              <CardContent className="py-4">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="mb-8">
              <CardContent className="py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Analyzing Repository</h3>
                  <p className="text-muted-foreground">
                    Our AI is reading through the codebase and generating insights...
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-6">
              {/* Repository Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Github className="w-5 h-5 mr-2 text-primary" />
                      Repository Summary
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(result.githubUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on GitHub
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    <code className="text-sm bg-secondary/50 px-2 py-1 rounded">
                      {result.githubUrl.replace('https://github.com/', '')}
                    </code>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {/* Stars */}
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-foreground">
                        {result.stars?.toLocaleString() || '0'} stars
                      </span>
                    </div>
                    
                    {/* Latest Version */}
                    {result.latestVersion && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-foreground">
                          Latest: {result.latestVersion}
                        </span>
                      </div>
                    )}
                    
                    {/* Owner/Repo */}
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        {result.owner}/{result.repo}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed text-lg">
                    {result.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Cool Facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-primary" />
                    Cool Facts
                  </CardTitle>
                  <CardDescription>
                    Interesting insights about this repository
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.coolFacts.map((fact: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-secondary/30 rounded-lg border border-border/30">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-semibold text-primary">{index + 1}</span>
                        </div>
                        <p className="text-foreground leading-relaxed">{fact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Try Another Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setError(null);
                    setInput('');
                  }}
                  className="px-8"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Another Repository
                </Button>
              </div>
            </div>
          )}
        </div>
      </NavigationLayout>
    </ProtectedRoute>
  );
}