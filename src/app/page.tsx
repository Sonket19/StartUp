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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Download, Upload } from 'lucide-react';
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

export default function InvestorDashboard() {
  const [startups, setStartups] = useState<AnalysisData[]>(allAnalysisData);
  const router = useRouter();
  
  const handleDelete = (startupId: string) => {
    setStartups(currentStartups => currentStartups.filter(s => s.company_overview.id !== startupId));
  };

  const handleGenerate = () => {
    // This would ideally be a real navigation after a real analysis is created.
    // For now, it just navigates to the first mock startup.
    router.push('/startup/sia');
  }

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
        
        {startups.length > 0 ? (
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
                  return (
                    <TableRow key={startup.company_overview.id}>
                      <TableCell>
                        <Link href={`/startup/${startup.company_overview.id}`} className='hover:underline'>
                          <div className="font-medium font-headline">{startup.company_overview.name}</div>
                          <div className="text-sm text-muted-foreground">{startup.company_overview.sector}</div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center font-semibold font-headline">{startup.risk_metrics.composite_investment_safety_score}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm text-muted-foreground">{startup.conclusion.investment_recommendation}</p>
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
                                     This action cannot be undone. This will permanently delete the analysis for <span className="font-bold">{startup.company_overview.name}</span>.
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                                   <AlertDialogAction onClick={() => handleDelete(startup.company_overview.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
        ) : (
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
        )}
      </main>
    </div>
  );
}
