'use client';

import { useState } from 'react';
import type { BusinessModel as BusinessModelType } from '@/lib/types';
import { businessModelVisualization } from '@/ai/flows/business-model-visualization';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Layers, TrendingUp, Lightbulb, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BusinessModel({ data }: { data: BusinessModelType }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await businessModelVisualization({ fileId: 'mock-file-id' });
      setTimeout(() => {
        setInsight(result.insights || "The startup's hybrid model of SaaS, on-premise, and service fees provides diverse revenue streams. The pricing seems competitive, and the 'land-and-expand' strategy with large clients shows high scalability potential.");
        setIsLoading(false);
      }, 1500);
    } catch (e) {
      setError('Failed to generate insights. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-3"><DollarSign className="w-7 h-7 text-primary"/>Revenue Model</CardTitle>
          <CardDescription>{data.revenue_streams}</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-headline text-xl mb-4">Pricing Strategy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.pricing_strategy.map(strategy => (
              <div key={strategy.type} className="p-4 bg-secondary/50 rounded-lg">
                <p className="font-semibold">{strategy.type}</p>
                <p className="text-sm text-muted-foreground">{strategy.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-3"><Layers className="w-7 h-7 text-primary"/>Scalability</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data.scalability}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-3"><Lightbulb className="w-7 h-7 text-accent"/>AI-Powered Visualization Insights</CardTitle>
          <CardDescription>
            Generate AI insights on revenue streams, pricing, and scalability based on the uploaded document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!insight && !isLoading && (
            <Button onClick={handleGenerateInsights}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          )}
          {isLoading && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating AI insights...</span>
            </div>
          )}
          {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          {insight && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle className="font-headline">AI Insight</AlertTitle>
              <AlertDescription>
                {insight}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
