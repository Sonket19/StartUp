
export type Founder = {
  name: string;
  role: string | null;
  education: string | null;
  experience: string | null;
  previous_ventures: string | null;
};

export type CompanyOverview = {
  name: string;
  sector: string;
  founders: Founder[];
  technology: {
    stack: string;
    facilities: string;
  };
};

export type MarketValue = {
  value: string;
  cagr: string;
  source: string;
};

export type MarketAnalysis = {
  market_size: {
    som: MarketValue;
    tam: MarketValue;
  };
  latest_news: string;
  competitor_analysis: {
    name: string;
    business_model: string;
    funding: string;
    margins: string;
    growth_rate: string;
  }[];
  sub_segment_opportunities: string;
  industry_overview: string;
};

export type PricingStrategy = {
  type: string;
  description: string;
};

export type BusinessModel = {
  revenue_model: string;
  pricing: string;
  unit_economics: {
    customer_lifetime_value_ltv: string;
    customer_acquisition_cost_cac: string;
    average_contract_value_acv: string;
    gross_margins: string;
  };
  scalability: string;
};

export type FinancialMetrics = {
  projected_revenue_fy26_27: string;
  burn_rate_monthly: string;
  runway_months: string;
  projected_revenue_fy25_26: string;
  mrr: string;
  arr: string;
};

export type Financials = {
  funding_history: string;
  financial_metrics: FinancialMetrics;
  valuation_rationale: string;
  current_round: {
    ask_amount_inr: string;
    stage: string;
    ask_amount_usd: string;
    use_of_funds: {
      product_development: string;
      sales_and_marketing: string;
      operational_costs: string;
    };
  };
};

export type Claim = {
  result: string;
  simulated_probability: string;
  simulation_parameters: {
    runs: string;
    new_customer_acquisition?: string;
    pilot_conversions?: string;
    time_horizon_months: number;
    initial_customers?: number;
    acv_distribution?: string;
    assumptions?: string;
  };
  analysis_method: string;
  claim: string;
  rationale_for_method: string;
}

export type ClaimsAnalysis = {
  claims: Claim[];
};

export type RiskMetrics = {
  narrative_justification: string;
  composite_risk_score: {
    value: string;
    interpretation: string;
  };
};

export type Conclusion = {
  risks: string[];
  investment_thesis: string;
  recommendation: string;
  strengths: string[];
};

export type Memo = {
  draft_v1: {
    claims_analysis: ClaimsAnalysis;
    market_analysis: MarketAnalysis;
    financials: Financials;
    company_overview: CompanyOverview;
    conclusion: Conclusion;
    business_model: BusinessModel;
    risk_metrics: RiskMetrics;
  }
}

export type Metadata = {
  created_at: string;
  sector: string;
  deal_id: string;
  company_name: string;
  founder_names: string[];
  error: string | null;
  status: string;
  processed_at: string;
}

export type AnalysisData = {
  memo: Memo;
  raw_files: {
    pitch_deck_url: string;
  };
  extracted_text: any;
  metadata: Metadata;
  public_data: any;
  deal_id: string;
};
