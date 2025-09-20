'use client';

import { useState, useEffect } from 'react';
import type { RiskMetrics, Conclusion, AnalysisData } from '@/lib/types';
import { getRiskAssessmentSummary, RiskAssessmentSummaryInput } from '@/ai/flows/risk-assessment-summary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, CheckCircle, Info, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ScoreCircle = ({ score, isLoading }: { score: string; isLoading?: boolean }) => {
    const numericScore = parseFloat(score);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (numericScore / 100) * circumference;
  
    let colorClass = 'text-chart-2';
    if (numericScore < 70) colorClass = 'text-chart-4';
    if (numericScore < 50) colorClass = 'text-chart-1';

    return (
        <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-secondary"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
                { !isLoading && (
                  <circle
                      className={colorClass}
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="45"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                      style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isLoading ? (
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              ) : (
                <>
                  <span className={`font-headline font-bold text-4xl ${colorClass}`}>{score}</span>
                  <span className="text-sm text-muted-foreground">Safety Score</span>
                </>
              )}
            </div>
        </div>
    );
};

type Weightages = {
    teamStrength: number;
    marketOpportunity: number;
    traction: number;
    claimCredibility: number;
    financialHealth: number;
};

export default function RiskAnalysis({ riskMetrics: initialRiskMetrics, conclusion, fullAnalysisData }: { riskMetrics: RiskMetrics, conclusion: Conclusion, fullAnalysisData: AnalysisData }) {
  const [riskMetrics, setRiskMetrics] = useState(initialRiskMetrics);
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
    setIsRecalculating(true);
    const input: RiskAssessmentSummaryInput = {
      companyOverview: JSON.stringify(fullAnalysisData.company_overview),
      marketAnalysis: JSON.stringify(fullAnalysisData.market_analysis),
      businessModel: JSON.stringify(fullAnalysisData.business_model),
      financials: JSON.stringify(fullAnalysisData.financials),
      claimsAnalysis: JSON.stringify(fullAnalysisData.claims_analysis),
      riskMetrics: JSON.stringify(riskMetrics),
      conclusion: JSON.stringify(conclusion),
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
      setRiskMetrics(result);
    } catch (error) {
      console.error("Failed to recalculate score", error);
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-3"><ShieldCheck className="w-7 h-7 text-primary"/>Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ScoreCircle score={riskMetrics.composite_investment_safety_score} isLoading={isRecalculating} />
          </div>
          <div className="space-y-4">
            <h3 className="font-headline text-xl">Narrative Justification</h3>
            <p className="text-muted-foreground">{riskMetrics.narrative_justification}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-3"><SlidersHorizontal className="w-7 h-7 text-primary"/>Customize Score Weightage</CardTitle>
          <CardDescription>Adjust the importance of each factor to recalculate the safety score. Current total must be 100%.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <div className="flex items-center justify-between">
                <Button onClick={handleRecalculate} disabled={totalWeight !== 100 || isRecalculating}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {isRecalculating ? 'Recalculating...' : 'Recalculate Score'}
                </Button>
                <div className="flex items-center gap-2">
                    <Label>Total Weight:</Label>
                    <Badge variant={totalWeight === 100 ? 'default' : 'destructive'}>{totalWeight}%</Badge>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-3"><AlertTriangle className="w-7 h-7 text-destructive"/>Key Risks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {conclusion.key_risks.map(riskItem => (
            <div key={riskItem.risk} className="p-4 border rounded-lg">
                <h4 className="font-semibold flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />{riskItem.risk}</h4>
                <p className="text-sm text-muted-foreground mt-2 pl-7"><span className="font-medium">Mitigation:</span> {riskItem.mitigation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-3"><CheckCircle className="w-7 h-7 text-primary"/>Conclusion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold">Summary of Opportunity</h3>
                <p className="text-muted-foreground">{conclusion.summary_of_opportunity}</p>
            </div>
            <div>
                <h3 className="font-semibold">Investment Recommendation</h3>
                <p className="text-muted-foreground">{conclusion.investment_recommendation}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
