'use client';

import { useState } from 'react';
import Link from 'next/link';
import { allAnalysisData } from '@/lib/mock-data';
import type { AnalysisData } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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

const getRecommendationBadgeVariant = (recommendation: 'Proceed' | 'Monitor' | 'Decline') => {
  switch (recommendation) {
    case 'Proceed':
      return 'default';
    case 'Monitor':
      return 'secondary';
    case 'Decline':
      return 'destructive';
    default:
      return 'outline';
  }
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
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Startup</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Safety Score</TableHead>
                  <TableHead className="hidden md:table-cell text-center">Recommendation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {startups.map(startup => (
                  <TableRow key={startup.company_overview.id}>
                    <TableCell>
                      <Link href={`/startup/${startup.company_overview.id}`} className='hover:underline'>
                        <div className="font-medium font-headline">{startup.company_overview.name}</div>
                        <div className="text-sm text-muted-foreground">{startup.company_overview.sector}</div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center font-semibold font-headline">{startup.risk_metrics.composite_investment_safety_score}</TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <Badge variant={getRecommendationBadgeVariant(startup.conclusion.recommendation_short)}>
                        {startup.conclusion.recommendation_short}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/startup/${startup.company_overview.id}`}>View</Link>
                        </Button>
                        <AlertDialog onOpenChange={(open) => !open && setStartupToDelete(null)}>
                           <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={(e) => openDeleteDialog(e, startup)}>
                                <Trash2 className="text-destructive"/>
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
                                 <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                               </AlertDialogFooter>
                           </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <CardContent className='pt-6'>
                <h2 className="text-2xl font-headline font-semibold">No Startups Analyzed</h2>
                <p className="text-muted-foreground mt-2">You haven&apos;t analyzed any startups yet.</p>
              </CardContent>
            </div>
        )}
      </main>
    </div>
  );
}
