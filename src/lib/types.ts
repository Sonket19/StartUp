export type Founder = {
  name: string;
  education: string;
  professional_background: string;
  previous_ventures: string;
};

export type CompanyOverview = {
  name: string;
  sector: string;
  founders: Founder[];
  technology: string;
};

export type MarketValue = {
  name: string;
  value: string;
  cagr?: string;
  projection?: string;
};

export type MarketAnalysis = {
  industry_size_and_growth: {
    total_addressable_market: MarketValue;
    serviceable_obtainable_market: MarketValue;
  };
  sub_segment_opportunities: string;
  competitor_details: {
    name: string;
    description: string;
    business_model: string;
    funding: string;
    margins_and_growth: string;
  }[];
  recent_news: string;
};

export type PricingStrategy = {
  type: string;
  description: string;
};

export type BusinessModel = {
  revenue_streams: string;
  pricing_strategy: PricingStrategy[];
  scalability: string;
};

export type KeyMetrics = {
  arr: string;
  mrr: string;
  burn_rate_estimated: string;
  runway: string;
  gross_margin: string;
  cac_ltv: string;
};

export type FundingHistory = {
  round: string;
  ask: string;
  previous_funding: string;
};

export type Financials = {
  key_metrics: KeyMetrics;
  funding_history: FundingHistory;
  valuation_rationale: string;
  financial_projections: Record<string, string>;
};

export type ClaimsAnalysis = {
  claim_1: {
    claim: string;
    analysis_method: string;
    input_dataset_length: string;
    simulation_parameters: {
      iterations: number;
      random_seed: number;
      qualified_leads: number;
      conversion_rate_distribution: string;
      acv_distribution: string;
    };
    simulated_probability: string;
    result: string;
  };
};

export type RiskMetrics = {
  composite_investment_safety_score: string;
  narrative_justification: string;
};

export type KeyRisk = {
  risk: string;
  mitigation: string;
};

export type Conclusion = {
  summary_of_opportunity: string;
  key_risks: KeyRisk[];
  investment_recommendation: string;
};

export type AnalysisData = {
  company_overview: CompanyOverview;
  market_analysis: MarketAnalysis;
  business_model: BusinessModel;
  financials: Financials;
  claims_analysis: ClaimsAnalysis;
  risk_metrics: RiskMetrics;
  conclusion: Conclusion;
};
