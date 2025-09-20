'use client';

import { useState } from 'react';
import type { AnalysisData } from '@/lib/types';
import { analysisData as mockData } from '@/lib/mock-data';
import FileUpload from '@/components/file-upload';
import AnalysisDashboard from '@/components/analysis-dashboard';
import { Loader2 } from 'lucide-react';
import Header from '@/components/header';

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setAnalysisData(mockData);
      setIsLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setAnalysisData(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onReset={analysisData ? handleReset : undefined} />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
            <h2 className="text-2xl font-headline font-semibold text-primary">Analyzing Startup...</h2>
            <p className="text-muted-foreground mt-2">Our AI is hard at work. This might take a moment.</p>
          </div>
        ) : analysisData ? (
          <AnalysisDashboard analysisData={analysisData} />
        ) : (
          <FileUpload onGenerate={handleGenerateAnalysis} />
        )}
      </main>
    </div>
  );
}
