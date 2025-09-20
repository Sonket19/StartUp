import type { RiskMetrics, Conclusion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, CheckCircle, Info } from 'lucide-react';

const ScoreCircle = ({ score }: { score: string }) => {
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
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-headline font-bold text-4xl ${colorClass}`}>{score}</span>
                <span className="text-sm text-muted-foreground">Safety Score</span>
            </div>
        </div>
    );
};


export default function RiskAnalysis({ riskMetrics, conclusion }: { riskMetrics: RiskMetrics, conclusion: Conclusion }) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-3"><ShieldCheck className="w-7 h-7 text-primary"/>Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ScoreCircle score={riskMetrics.composite_investment_safety_score} />
          </div>
          <div className="space-y-4">
            <h3 className="font-headline text-xl">Narrative Justification</h3>
            <p className="text-muted-foreground">{riskMetrics.narrative_justification}</p>
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
