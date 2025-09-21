
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { AnalysisData } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Download, Upload, Loader2, AlertTriangle } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import FileUpload from '@/components/file-upload';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function InvestorDashboard() {
  const [startups, setStartups] = useState<AnalysisData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/deals`);
        if (!response.ok) {
          throw new Error('Failed to fetch deals. Please try again later.');
        }
        const data = await response.json();
        setStartups(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);
  
  const handleDelete = (startupId: string) => {
    setStartups(currentStartups => currentStartups.filter(s => s.deal_id !== startupId));
  };

  const handleGenerate = () => {
    // This would ideally be a real navigation after a real analysis is created.
    // For now, it just navigates to the first mock startup if available.
    if(startups.length > 0){
        router.push(`/startup/${startups[0].deal_id}`);
    } else {
        // Maybe refresh or wait. For now, we do nothing.
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card>
           <Table>
              <TableHeader>
                <TableRow className="bg-secondary hover:bg-secondary">
                  <TableHead className="font-semibold">Startup</TableHead>
                  <TableHead className="hidden sm:table-cell text-center font-semibold">Safety Score</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Recommendation</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center"><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-9 w-[100px]" />
                        <Skeleton className="h-10 w-10" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </Card>
      );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="mt-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Failed to Load Deals</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (startups.length > 0) {
      return (
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-semibold">Startup</TableHead>
                <TableHead className="hidden sm:table-cell text-center font-semibold">Safety Score</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Recommendation</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {startups.map(startup => {
                const memo = startup.memo?.draft_v1;
                return (
                  <TableRow key={startup.deal_id}>
                    <TableCell>
                      <Link href={`/startup/${startup.deal_id}`} className='hover:underline'>
                        <div className="font-medium font-headline">{startup.metadata.company_name}</div>
                        <div className="text-sm text-muted-foreground">{startup.metadata.sector}</div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center font-semibold font-headline">
                      {memo ? memo.risk_metrics.composite_risk_score.value : 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm text-muted-foreground">
                        {memo ? memo.conclusion.recommendation : 'N/A'}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Download />
                          Word
                        </Button>
                        <AlertDialog>
                           <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="text-destructive"/>
                              </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   This action cannot be undone. This will permanently delete the analysis for <span className="font-bold">{startup.metadata.company_name}</span>.
                                 </Description>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                                 <AlertDialogAction onClick={() => handleDelete(startup.deal_id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                               </AlertDialogFooter>
                           </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      );
    }

    return (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-headline font-semibold">No Startups Analyzed</h2>
            <p className="text-muted-foreground mt-2">You haven&apos;t analyzed any startups yet.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <FileUpload onGenerate={handleGenerate} />
              </DialogContent>
            </Dialog>
        </div>
    );
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-headline font-bold">Investor Dashboard</h1>
              <p className="text-muted-foreground">Your portfolio of analyzed startups.</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <FileUpload onGenerate={handleGenerate} />
              </DialogContent>
            </Dialog>
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
}
