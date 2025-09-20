'use client';

import { useState } from 'react';
import Link from 'next/link';
import { allAnalysisData } from '@/lib/mock-data';
import type { AnalysisData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight, LineChart, Briefcase } from 'lucide-react';
import Header from '@/components/header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function InvestorDashboard() {
  const [startups, setStartups] = useState<AnalysisData[]>(allAnalysisData);
  const [startupToDelete, setStartupToDelete] = useState<AnalysisData | null>(null);

  const handleDelete = () => {
    if (startupToDelete) {
      setStartups(startups.filter(s => s.company_overview.id !== startupToDelete.company_overview.id));
      setStartupToDelete(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
            <h1 className="text-4xl font-headline font-bold">Investor Dashboard</h1>
            <p className="text-muted-foreground">Your portfolio of analyzed startups.</p>
        </div>
        
        {startups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map(startup => (
              <Card key={startup.company_overview.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{startup.company_overview.name}</CardTitle>
                  <CardDescription>{startup.company_overview.sector}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <LineChart className="w-4 h-4 text-primary" />
                            <span className="font-semibold">Safety Score:</span>
                            <span className="font-bold">{startup.risk_metrics.composite_investment_safety_score}</span>
                        </div>
                         <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <span className="font-semibold">Recommendation:</span>
                            <span className="font-medium">{startup.conclusion.investment_recommendation}</span>
                        </div>
                    </div>
                  <div className="flex items-center justify-between mt-auto">
                    <Link href={`/startup/${startup.company_overview.id}`} passHref>
                      <Button>
                        View Details <ArrowRight className="ml-2" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => setStartupToDelete(startup)}>
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the analysis for <span className="font-bold">{startupToDelete?.company_overview.name}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setStartupToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <h2 className="text-2xl font-headline font-semibold">No Startups Analyzed</h2>
                <p className="text-muted-foreground mt-2">You haven&apos;t analyzed any startups yet.</p>
            </div>
        )}
      </main>
    </div>
  );
}
