
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AnalysisData, RiskMetrics, Conclusion } from '@/lib/types';
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
import { getRiskAssessmentSummary, RiskAssessmentSummaryInput } from '@/ai/flows/risk-assessment-summary';

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

export default function AnalysisDashboard({ analysisData: initialAnalysisData }: AnalysisDashboardProps) {
  const [analysisData, setAnalysisData] = useState(initialAnalysisData);
  const [isRecalculating, setIsRecalculating] = useState(false);
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
    if (!analysisData.memo) return;
    setIsRecalculating(true);
    const memo = analysisData.memo.draft_v1;
    const input: RiskAssessmentSummaryInput = {
      companyOverview: JSON.stringify(memo.company_overview),
      marketAnalysis: JSON.stringify(memo.market_analysis),
      businessModel: JSON.stringify(memo.business_model),
      financials: JSON.stringify(memo.financials),
      claimsAnalysis: JSON.stringify(memo.claims_analysis),
      riskMetrics: JSON.stringify(memo.risk_metrics),
      conclusion: JSON.stringify(memo.conclusion),
      weights: {
        teamStrength: weights.teamStrength / 100,
        marketOpportunity: weights.marketOpportunity / 100,
        traction: weights.traction / 100,
        claimCredibility: weights.claimCredibility / 100,
        financialHealth: weights.financialHealth / 100,
      }
    };

    try {
      const result = await getRiskAssessmentSummary(input);
      setAnalysisData(prev => {
        if (!prev.memo) return prev;
        return {
        ...prev,
        memo: {
          ...prev.memo,
          draft_v1: {
            ...prev.memo.draft_v1,
            risk_metrics: {
              ...prev.memo.draft_v1.risk_metrics,
              composite_investment_safety_score: result.composite_investment_safety_score,
              narrative_justification: result.narrative_justification,
            }
          }
        }
      }});
    } catch (error) {
      console.error("Failed to recalculate score", error);
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
        <Dialog>
            <DialogTrigger asChild>
              <Button><SlidersHorizontal /> Generate Summary</Button>
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
                <DialogClose asChild>
                  <Button onClick={handleRecalculate} disabled={totalWeight !== 100 || isRecalculating}>
                    {isRecalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                    {isRecalculating ? 'Recalculating...' : 'Generate Summary'}
                  </Button>
                </DialogClose>
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
        {memo ? (
          <>
            <TabsContent value="overview">
              <CompanyOverview data={memo.company_overview} />
            </TabsContent>
            <TabsContent value="market">
              <MarketAnalysis data={memo.market_analysis} />
            </TabsContent>
            <TabsContent value="model">
              <BusinessModel data={memo.business_model} dealId={analysisData.deal_id}/>
            </TabsContent>
            <TabsContent value="financials">
              <Financials data={memo.financials} claims={memo.claims_analysis}/>
            </TabsContent>
            <TabsContent value="risks">
              <RiskAnalysis riskMetrics={memo.risk_metrics} conclusion={memo.conclusion} fullAnalysisData={analysisData} isRecalculating={isRecalculating} />
            </TabsContent>
            <TabsContent value="chatbot">
              <Chatbot analysisData={analysisData} />
            </TabsContent>
          </>
        ) : (
          <TabsContent value="overview">
            <div className="text-center py-20">
                <h2 className="text-2xl font-headline font-semibold text-destructive">Analysis data is not available.</h2>
                <p className="text-muted-foreground mt-2">The analysis for this startup might still be in progress or has failed.</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

  