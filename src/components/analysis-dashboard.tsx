
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AnalysisData } from '@/lib/types';
import CompanyOverview from './company-overview';
import MarketAnalysis from './market-analysis';
import BusinessModel from './business-model';
import Financials from './financials';
import RiskAnalysis from './risk-analysis';
import Chatbot from './chatbot';
import { Briefcase, ShoppingCart, BarChart, Banknote, ShieldAlert, MessageCircle, SlidersHorizontal, Loader2, FileArchive, FileText, Video, Mic, Type } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

type AnalysisDashboardProps = {
  analysisData: AnalysisData;
};

type Weightages = {
    teamStrength: number;
    marketOpportunity: number;
    traction: number;
    claimCredibility: number;
    financialHealth: number;
};

const NoDataComponent = ({ onGenerateClick }: { onGenerateClick: () => void }) => (
    <div className="text-center py-20 border-2 border-dashed rounded-lg">
        <h2 className="text-2xl font-headline font-semibold text-destructive">Analysis data is not available.</h2>
        <p className="text-muted-foreground mt-2">The analysis for this startup might still be in progress or has failed. You can try generating a summary.</p>
    </div>
);


export default function AnalysisDashboard({ analysisData: initialAnalysisData }: AnalysisDashboardProps) {
  const [analysisData, setAnalysisData] = useState(initialAnalysisData);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const { toast } = useToast();

  console.log('analysisData:', analysisData);

  const [weights, setWeights] = useState<Weightages>({
    teamStrength: 20,
    marketOpportunity: 20,
    traction: 20,
    claimCredibility: 25,
    financialHealth: 15,
  });

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  const handleWeightChange = (key: keyof Weightages, value: number[]) => {
    setWeights(prev => ({...prev, [key]: value[0]}));
  };

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    
    try {
      const requestBody = {
        team_strength: weights.teamStrength,
        market_opportunity: weights.marketOpportunity,
        traction: weights.traction,
        claim_credibility: weights.claimCredibility,
        financial_health: weights.financialHealth
      };

      console.log('Request Payload:', JSON.stringify(requestBody, null, 2));

      // 1. Call generate_memo endpoint
      const generateMemoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/generate_memo/${analysisData.deal_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!generateMemoResponse.ok) {
        throw new Error('Failed to generate the new memo summary.');
      }
      
      const generateResult = await generateMemoResponse.json();

      // 2. Fetch the updated deal data
      const dealResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/deals/${generateResult.deal_id}`);
      if (!dealResponse.ok) {
        throw new Error('Failed to fetch the updated analysis data.');
      }
      const updatedAnalysisData = await dealResponse.json();
      
      // 3. Update state and close dialog
      setAnalysisData(updatedAnalysisData);
      setIsCustomizeDialogOpen(false);
      
      toast({
        title: "Summary Generated",
        description: "The investment summary has been updated with your new weightages.",
      });

    } catch (error: any) {
      console.error("Failed to recalculate score", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An unexpected error occurred while regenerating the summary.",
      });
    } finally {
      setIsRecalculating(false);
    }
  };

  const memo = analysisData.memo?.draft_v1;

  return (
    <div className="w-full animate-in fade-in-50 duration-500">
      <div className="flex justify-end gap-4 mb-4">
        <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><FileArchive /> Uploaded Data</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl flex items-center gap-3"><FileArchive className="w-7 h-7 text-primary"/>Uploaded Data Sources</DialogTitle>
                  <DialogDescription>
                    Download the original source files used for this analysis.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-muted-foreground" />
                            <span className="font-medium">pitch_deck_v3.pdf</span>
                        </div>
                        <Button size="sm">Download</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Video className="w-6 h-6 text-muted-foreground" />
                            <span className="font-medium">founder_interview.mp4</span>
                        </div>
                        <Button size="sm">Download</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Mic className="w-6 h-6 text-muted-foreground" />
                            <span className="font-medium">demo_walkthrough.mp3</span>
                        </div>
                        <Button size="sm">Download</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Type className="w-6 h-6 text-muted-foreground" />
                            <span className="font-medium">additional_notes.txt</span>
                        </div>
                        <Button size="sm">Download</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        <Dialog open={isCustomizeDialogOpen} onOpenChange={setIsCustomizeDialogOpen}>
            <DialogTrigger asChild>
              <Button><SlidersHorizontal /> {memo ? 'Regenerate' : 'Generate'} Summary</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl flex items-center gap-3"><SlidersHorizontal className="w-7 h-7 text-primary"/>Customize Score Weightage</DialogTitle>
                <DialogDescription>
                  Adjust the importance of each factor to recalculate the safety score. The total must be 100%.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {(Object.keys(weights) as Array<keyof Weightages>).map(key => (
                      <div key={key} className="grid gap-2">
                          <div className="flex justify-between">
                              <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                              <span className="text-sm font-medium">{weights[key]}%</span>
                          </div>
                          <Slider id={key} value={[weights[key]]} onValueChange={(val) => handleWeightChange(key, val)} max={100} step={5} />
                      </div>
                  ))}
                </div>
                <div className="flex items-center justify-end">
                    <div className="flex items-center gap-2">
                        <Label>Total Weight:</Label>
                        <Badge variant={totalWeight === 100 ? 'default' : 'destructive'}>{totalWeight}%</Badge>
                    </div>
                </div>
              </div>
              <DialogFooter>
                  <Button onClick={handleRecalculate} disabled={totalWeight !== 100 || isRecalculating}>
                    {isRecalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                    {isRecalculating ? 'Recalculating...' : 'Generate Summary'}
                  </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto mb-6">
          <TabsTrigger value="overview" className="h-12"><Briefcase className="mr-2"/>Overview</TabsTrigger>
          <TabsTrigger value="market" className="h-12"><ShoppingCart className="mr-2"/>Market</TabsTrigger>
          <TabsTrigger value="model" className="h-12"><BarChart className="mr-2"/>Business Model</TabsTrigger>
          <TabsTrigger value="financials" className="h-12"><Banknote className="mr-2"/>Financials</TabsTrigger>
          <TabsTrigger value="risks" className="h-12"><ShieldAlert className="mr-2"/>Risks</TabsTrigger>
          <TabsTrigger value="chatbot" className="h-12"><MessageCircle className="mr-2"/>Chatbot</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {memo ? <CompanyOverview data={memo.company_overview} /> : <NoDataComponent onGenerateClick={() => setIsCustomizeDialogOpen(true)} />}
        </TabsContent>
        <TabsContent value="market">
          {memo ? <MarketAnalysis data={memo.market_analysis} /> : <NoDataComponent onGenerateClick={() => setIsCustomizeDialogOpen(true)} />}
        </TabsContent>
        <TabsContent value="model">
          {memo ? <BusinessModel data={memo.business_model} dealId={analysisData.deal_id}/> : <NoDataComponent onGenerateClick={() => setIsCustomizeDialogOpen(true)} />}
        </TabsContent>
        <TabsContent value="financials">
          {memo ? <Financials data={memo.financials} claims={memo.claims_analysis}/> : <NoDataComponent onGenerateClick={() => setIsCustomizeDialogOpen(true)} />}
        </TabsContent>
        <TabsContent value="risks">
          {memo ? <RiskAnalysis riskMetrics={memo.risk_metrics} conclusion={memo.conclusion} isRecalculating={isRecalculating} /> : <NoDataComponent onGenerateClick={() => setIsCustomizeDialogOpen(true)} />}
        </TabsContent>
        <TabsContent value="chatbot">
          {memo ? <Chatbot analysisData={analysisData} /> : <NoDataComponent onGenerateClick={() => setIsCustomizeDialogOpen(true)} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
