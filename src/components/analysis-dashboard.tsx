import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AnalysisData } from '@/lib/types';
import CompanyOverview from './company-overview';
import MarketAnalysis from './market-analysis';
import BusinessModel from './business-model';
import Financials from './financials';
import RiskAnalysis from './risk-analysis';
import Chatbot from './chatbot';
import { Briefcase, ShoppingCart, BarChart, Banknote, ShieldAlert, MessageCircle } from 'lucide-react';

type AnalysisDashboardProps = {
  analysisData: AnalysisData;
};

export default function AnalysisDashboard({ analysisData }: AnalysisDashboardProps) {
  return (
    <Tabs defaultValue="overview" className="w-full animate-in fade-in-50 duration-500">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto mb-6">
        <TabsTrigger value="overview" className="h-12"><Briefcase className="mr-2"/>Overview</TabsTrigger>
        <TabsTrigger value="market" className="h-12"><ShoppingCart className="mr-2"/>Market</TabsTrigger>
        <TabsTrigger value="model" className="h-12"><BarChart className="mr-2"/>Business Model</TabsTrigger>
        <TabsTrigger value="financials" className="h-12"><Banknote className="mr-2"/>Financials</TabsTrigger>
        <TabsTrigger value="risks" className="h-12"><ShieldAlert className="mr-2"/>Risks</TabsTrigger>
        <TabsTrigger value="chatbot" className="h-12"><MessageCircle className="mr-2"/>Chatbot</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <CompanyOverview data={analysisData.company_overview} />
      </TabsContent>
      <TabsContent value="market">
        <MarketAnalysis data={analysisData.market_analysis} />
      </TabsContent>
      <TabsContent value="model">
        <BusinessModel data={analysisData.business_model} />
      </TabsContent>
      <TabsContent value="financials">
        <Financials data={analysisData.financials} claims={analysisData.claims_analysis}/>
      </TabsContent>
      <TabsContent value="risks">
        <RiskAnalysis riskMetrics={analysisData.risk_metrics} conclusion={analysisData.conclusion} fullAnalysisData={analysisData} />
      </TabsContent>
      <TabsContent value="chatbot">
        <Chatbot analysisData={analysisData} />
      </TabsContent>
    </Tabs>
  );
}
