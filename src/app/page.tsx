'use client';

import { useState } from 'react';
import Link from 'next/link';
import { allAnalysisData } from '@/lib/mock-data';
import type { AnalysisData } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight, LineChart, Briefcase, Building } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

const getRecommendationBadgeVariant = (recommendation: string) => {
  if (recommendation.toLowerCase().includes('proceed')) {
    return 'default';
  }
  return 'secondary';
};

export default function InvestorDashboard() {
  const [startups, setStartups] = useState<AnalysisData[]>(allAnalysisData);
  const [startupToDelete, setStartupToDelete] = useState<AnalysisData | null>(null);

  const handleDelete = () => {
    if (startupToDelete) {
      setStartups(startups.filter(s => s.company_overview.id !== startupToDelete.company_overview.id));
      setStartupToDelete(null);
    }
  };

  const openDeleteDialog = (e: React.MouseEvent, startup: AnalysisData) => {
    e.preventDefault();
    setStartupToDelete(startup);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
            <h1 className="text-4xl font-headline font-bold">Investor Dashboard</h1>
            <p className="text-muted-foreground">Your portfolio of analyzed startups.</p>
        </div>
        
        {startups.length > 0 ? (
          <div className="space-y-4">
            {startups.map(startup => (
              <Link key={startup.company_overview.id} href={`/startup/${startup.company_overview.id}`} passHref>
                <Card className="hover:shadow-md hover:border-primary/50 transition-all">
                  <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 items-center gap-4">
                    <div className="col-span-1 md:col-span-2 flex items-center gap-6">
                      <div className='hidden sm:block'>
                        <Building className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <div>
                        <h2 className="font-headline text-xl font-semibold">{startup.company_overview.name}</h2>
                        <p className="text-sm text-muted-foreground">{startup.company_overview.sector}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end md:items-start md:flex-row col-span-2 md:col-span-2 md:justify-end md:items-center gap-4">
                      <div className="flex items-center gap-2 text-sm w-full md:w-auto justify-end md:justify-start">
                          <LineChart className="w-4 h-4 text-primary" />
                          <span className="font-semibold hidden sm:inline">Safety Score:</span>
                          <span className="font-bold">{startup.risk_metrics.composite_investment_safety_score}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm w-full md:w-auto justify-end md:justify-start">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span className="font-semibold hidden sm:inline">Recommendation:</span>
                          <Badge variant={getRecommendationBadgeVariant(startup.conclusion.investment_recommendation)}>{startup.conclusion.investment_recommendation}</Badge>
                      </div>
                      <div className='flex items-center gap-2 w-full md:w-auto justify-end md:justify-start'>
                        <Button variant="outline" size="sm">
                          View Analysis <ArrowRight className="ml-2 hidden sm:inline" />
                        </Button>
                        <AlertDialog onOpenChange={(open) => !open && setStartupToDelete(null)}>
                           <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon" onClick={(e) => openDeleteDialog(e, startup)}>
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
                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                                 <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                               </AlertDialogFooter>
                           </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
