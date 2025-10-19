import type { RiskAssessmentSummaryInput } from '@/ai/flows/risk-assessment-summary';

export type FactorKey = 'teamStrength' | 'marketOpportunity' | 'traction' | 'claimCredibility' | 'financialHealth';
export type FactorResult = { score: number; rationale: string };
export type FactorResults = Record<FactorKey, FactorResult>;

const DEFAULT_WEIGHTS: Record<FactorKey, number> = {
  teamStrength: 20,
  marketOpportunity: 20,
  traction: 20,
  claimCredibility: 25,
  financialHealth: 15,
};

const FACTOR_LABELS: Record<FactorKey, string> = {
  teamStrength: 'Team Strength',
  marketOpportunity: 'Market Opportunity',
  traction: 'Traction',
  claimCredibility: 'Claim Credibility',
  financialHealth: 'Financial Health',
};

const PERCENT_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function computeDeterministicRiskSummary(
  input: RiskAssessmentSummaryInput
): { compositeScore: number; narrative: string; factorResults: FactorResults; normalizedWeights: Record<FactorKey, number> } {
  const weights = normaliseWeights(input.weights ?? DEFAULT_WEIGHTS);
  const factorResults: FactorResults = {
    teamStrength: evaluateTeamStrength(input.companyOverview),
    marketOpportunity: evaluateMarketOpportunity(input.marketAnalysis),
    traction: evaluateTraction(input.businessModel, input.financials, input.claimsAnalysis),
    claimCredibility: evaluateClaimCredibility(input.claimsAnalysis),
    financialHealth: evaluateFinancialHealth(input.financials),
  };

  const compositeScore = computeCompositeScore(factorResults, weights);
  const narrative = buildNarrative(factorResults, weights, compositeScore, input.weights);

  return { compositeScore, narrative, factorResults, normalizedWeights: weights };
}

function normaliseWeights(weights: Partial<Record<FactorKey, number>>): Record<FactorKey, number> {
  const merged = { ...DEFAULT_WEIGHTS, ...weights } as Record<FactorKey, number>;
  const sum = (Object.values(merged).reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0) || 100);
  if (sum === 0) {
    return normaliseWeights(DEFAULT_WEIGHTS);
  }
  const normalised = Object.entries(merged).reduce((acc, [key, value]) => {
    acc[key as FactorKey] = value / sum;
    return acc;
  }, {} as Record<FactorKey, number>);
  return normalised;
}

function computeCompositeScore(factorResults: FactorResults, weights: Record<FactorKey, number>): number {
  const weighted = (Object.entries(factorResults) as [FactorKey, FactorResult][]).reduce((acc, [key, { score }]) => {
    return acc + score * weights[key];
  }, 0);
  return weighted;
}

type KeywordMatchConfig = {
  keywords: RegExp[];
  scaling: { low: number; high: number };
  weight: number;
};

function evaluateTeamStrength(companyOverview: string): FactorResult {
  const text = companyOverview.toLowerCase();
  const keywordGroups: KeywordMatchConfig[] = [
    {
      keywords: [/\bexperience(?:d|)\b/, /\b15\s*\+?\s*years\b/, /\bserial\s+entrepreneur\b/, /\bprevious\s+exit\b/, /\bformer\b/],
      scaling: { low: 1, high: 4 },
      weight: 0.45,
    },
    {
      keywords: [/\bmba\b/, /\bphd\b/, /\bms\b/, /\bmsc\b/, /\bmit\b/, /\bstanford\b/],
      scaling: { low: 1, high: 3 },
      weight: 0.25,
    },
    {
      keywords: [/\btechnical\s+lead\b/, /\bcto\b/, /\bpatent\b/, /\baward\b/],
      scaling: { low: 1, high: 3 },
      weight: 0.2,
    },
    {
      keywords: [/\bteam\s+of\s+(\d+)/, /\bfounder\b/],
      scaling: { low: 2, high: 5 },
      weight: 0.1,
    },
  ];

  const rationale: string[] = [];
  let score = 0;
  keywordGroups.forEach(({ keywords, scaling, weight }) => {
    const matchCount = countMatches(text, keywords);
    const fuzzyScore = clamp01((matchCount - scaling.low) / Math.max(1, scaling.high - scaling.low));
    if (fuzzyScore > 0.6) {
      rationale.push(`${Math.round(fuzzyScore * 100)}% confidence signals for ${describeKeywords(keywords)}`);
    }
    score += fuzzyScore * weight;
  });

  if (rationale.length === 0) {
    rationale.push('limited references to experienced leadership or technical depth in the overview.');
  }

  return {
    score: Math.round(score * 100),
    rationale: sentenceCase(rationale.join('; ')),
  };
}

function evaluateMarketOpportunity(marketAnalysis: string): FactorResult {
  const text = marketAnalysis.toLowerCase();
  const tam = extractLargestCurrencyValue(text);
  const growth = extractPercentageNearKeyword(text, /cagr|growth|growing|expanding|increase/);

  const tamScore = tam ? clamp01(Math.log10(tam) / Math.log10(1_000_000_000)) : 0.3;
  const growthScore = growth ? clamp01((growth - 5) / 45) : text.includes('niche') ? 0.2 : 0.5;
  const opportunityScore = tamScore * 0.6 + growthScore * 0.4;

  const rationale: string[] = [];
  if (tam) {
    rationale.push(`total addressable market estimated at $${formatNumber(tam)} supporting scale`);
  }
  if (growth) {
    rationale.push(`growth indicators around ${growth.toFixed(1)}% CAGR`);
  }
  if (rationale.length === 0) {
    rationale.push('market description lacks clear size or growth signals');
  }

  return {
    score: Math.round(opportunityScore * 100),
    rationale: sentenceCase(rationale.join('; ')),
  };
}

function evaluateTraction(businessModel: string, financials: string, claimsAnalysis: string): FactorResult {
  const text = `${businessModel}\n${financials}\n${claimsAnalysis}`.toLowerCase();
  const revenue = extractLargestCurrencyValue(text);
  const userMetrics = extractCountNearKeyword(text, /users|customers|contracts|installs|retention|pilots/);
  const growth = extractPercentageNearKeyword(text, /month(?:ly)?\s+growth|mom|growth|increase|expansion/);

  const revenueScore = revenue ? clamp01(Math.log10(revenue) / Math.log10(50_000_000)) : 0.35;
  const userScore = userMetrics ? clamp01(Math.log10(userMetrics) / Math.log10(1_000_000)) : 0.3;
  const growthScore = growth ? clamp01((growth - 5) / 40) : 0.4;

  const combined = revenueScore * 0.5 + userScore * 0.3 + growthScore * 0.2;

  const rationale: string[] = [];
  if (revenue) {
    rationale.push(`reported revenue or pipeline near $${formatNumber(revenue)}`);
  }
  if (userMetrics) {
    rationale.push(`traction signals from roughly ${formatNumber(userMetrics)} users/customers`);
  }
  if (growth) {
    rationale.push(`growth rates approximated at ${growth.toFixed(1)}%`);
  }
  if (rationale.length === 0) {
    rationale.push('no quantitative traction metrics detected across business model and financial sections');
  }

  return {
    score: Math.round(combined * 100),
    rationale: sentenceCase(rationale.join('; ')),
  };
}

function evaluateClaimCredibility(claimsAnalysis: string): FactorResult {
  const probabilities = extractPercentages(claimsAnalysis);
  const validations = countMatches(claimsAnalysis.toLowerCase(), [/validated/, /confirmed/, /third[-\s]?party/, /evidence/]);
  const flags = countMatches(claimsAnalysis.toLowerCase(), [/unverified/, /inflated/, /risk/, /uncertain/]);

  const probabilityScore = probabilities.length
    ? probabilities.reduce((acc, value) => acc + value, 0) / (probabilities.length * 100)
    : 0.45;
  const validationScore = clamp01((validations - flags) / 5 + 0.5);
  const combined = probabilityScore * 0.65 + validationScore * 0.35;

  const avgProbability = probabilities.length
    ? probabilities.reduce((acc, value) => acc + value, 0) / probabilities.length
    : undefined;

  const rationale: string[] = [];
  if (avgProbability !== undefined) {
    rationale.push(`claims average approximately ${avgProbability.toFixed(1)}% simulated success probability`);
  }
  if (validations > 0) {
    rationale.push(`${validations} independent validation signals detected`);
  }
  if (flags > validations) {
    rationale.push('multiple cautionary phrases present in claims analysis');
  }
  if (rationale.length === 0) {
    rationale.push('insufficient quantitative evidence accompanying claims');
  }

  return {
    score: Math.round(combined * 100),
    rationale: sentenceCase(rationale.join('; ')),
  };
}

function evaluateFinancialHealth(financials: string): FactorResult {
  const text = financials.toLowerCase();
  const { baseRevenue, monthlyBurn, fundingCapacity, runwayMonths, growthRate } = extractFinancialMetrics(text);

  const rng = createDeterministicRng(text);
  const trials = 750;
  let runwaySuccess = 0;
  let cumulativeRunway = 0;

  for (let i = 0; i < trials; i++) {
    const simulatedGrowth = sampleNormal(growthRate ?? 0.2, 0.15, rng);
    const simulatedBurn = (monthlyBurn ?? 250000) * (1 + sampleNormal(0, 0.2, rng));
    const simulatedRevenue = (baseRevenue ?? 1_000_000) * (1 + simulatedGrowth);
    const buffer = (fundingCapacity ?? 2_000_000) + simulatedRevenue * 0.35;
    const months = buffer / Math.max(simulatedBurn, 1);
    if (months >= 12) {
      runwaySuccess += 1;
    }
    cumulativeRunway += months;
  }

  const successProbability = runwaySuccess / trials;
  const medianRunway = cumulativeRunway / trials;

  const healthScore = clamp01(0.5 * successProbability + 0.5 * clamp01((medianRunway - 6) / 18));

  const rationale: string[] = [];
  rationale.push(`deterministic Monte Carlo indicates ${(successProbability * 100).toFixed(1)}% chance of 12-month runway`);
  rationale.push(`median simulated runway of ${medianRunway.toFixed(1)} months`);
  if (monthlyBurn) {
    rationale.push(`base monthly burn inferred at ~$${formatNumber(monthlyBurn)}`);
  }

  return {
    score: Math.round(healthScore * 100),
    rationale: sentenceCase(rationale.join('; ')),
  };
}

function buildNarrative(
  factorResults: FactorResults,
  weights: Record<FactorKey, number>,
  compositeScore: number,
  customWeights?: Partial<Record<FactorKey, number>>
): string {
  const contributions = (Object.entries(factorResults) as [FactorKey, FactorResult][]).map(([key, result]) => ({
    key,
    label: FACTOR_LABELS[key],
    weighted: result.score * weights[key],
    result,
    weight: weights[key],
  }));

  contributions.sort((a, b) => b.weighted - a.weighted);

  const top = contributions[0];
  const bottom = contributions[contributions.length - 1];

  const lines: string[] = [];
  lines.push(
    `Deterministic scoring yields a composite investment safety score of ${PERCENT_FORMATTER.format(compositeScore)}%.`
  );
  lines.push(`${top.label} exerted the strongest influence (${(top.weight * 100).toFixed(0)}% weight) because ${top.result.rationale}.`);
  lines.push(`Key downside risk remains ${bottom.label} where ${bottom.result.rationale}.`);

  if (customWeights) {
    const changes = describeWeightChanges(customWeights);
    if (changes) {
      lines.push(changes);
    }
  }

  return lines.join(' ');
}

function describeWeightChanges(weights: Partial<Record<FactorKey, number>>): string | null {
  const differences: string[] = [];
  (Object.entries(weights) as [FactorKey, number | undefined][]).forEach(([key, value]) => {
    if (value === undefined) return;
    const defaultWeight = DEFAULT_WEIGHTS[key];
    const delta = value - defaultWeight;
    if (Math.abs(delta) >= 3) {
      const direction = delta > 0 ? 'higher' : 'lower';
      differences.push(`${FACTOR_LABELS[key]} weighted ${direction} by ${Math.abs(delta).toFixed(0)} points versus baseline`);
    }
  });
  if (differences.length === 0) {
    return null;
  }
  return `Investor-adjusted weights noted: ${differences.join('; ')}.`;
}

function countMatches(text: string, expressions: RegExp[]): number {
  let total = 0;
  expressions.forEach(regex => {
    const pattern = cloneRegex(regex, 'g');
    const matches = text.match(pattern);
    total += matches ? matches.length : 0;
  });
  return total;
}

function describeKeywords(keywords: RegExp[]): string {
  const descriptors = keywords.map(exp => exp.source.replace(/\\b/g, '').replace(/\s\+/g, ' '));
  return descriptors.slice(0, 2).join(', ');
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function sentenceCase(value: string): string {
  if (!value) return value;
  const trimmed = value.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function extractLargestCurrencyValue(text: string): number | null {
  const pattern = /(\$?\d[\d,\.]*)\s*(billion|bn|million|m|thousand|k)?/gi;
  let match: RegExpExecArray | null;
  let max = 0;
  while ((match = pattern.exec(text)) !== null) {
    const numeric = parseFloat(match[1].replace(/[$,]/g, ''));
    if (Number.isNaN(numeric)) continue;
    const magnitude = unitMagnitude(match[2]);
    const value = numeric * magnitude;
    if (value > max) {
      max = value;
    }
  }
  return max > 0 ? max : null;
}

function extractPercentageNearKeyword(text: string, keyword: RegExp): number | null {
  const windowSize = 80;
  let match: RegExpExecArray | null;
  const pattern = cloneRegex(keyword, 'gi');
  while ((match = pattern.exec(text)) !== null) {
    const start = Math.max(0, match.index - windowSize);
    const end = Math.min(text.length, match.index + windowSize);
    const snippet = text.slice(start, end);
    const percentMatch = snippet.match(/(\d+(?:\.\d+)?)\s*%/i);
    if (percentMatch) {
      return parseFloat(percentMatch[1]);
    }
  }
  return null;
}

function extractCountNearKeyword(text: string, keyword: RegExp): number | null {
  const windowSize = 60;
  const pattern = cloneRegex(keyword, 'gi');
  let match: RegExpExecArray | null;
  let max = 0;
  while ((match = pattern.exec(text)) !== null) {
    const start = Math.max(0, match.index - windowSize);
    const end = Math.min(text.length, match.index + windowSize);
    const snippet = text.slice(start, end);
    const numberMatch = snippet.match(/(\d{1,3}(?:[,\d]*))/);
    if (numberMatch) {
      const numeric = parseInt(numberMatch[1].replace(/,/g, ''), 10);
      if (numeric > max) {
        max = numeric;
      }
    }
  }
  return max > 0 ? max : null;
}

function extractPercentages(text: string): number[] {
  const matches = text.match(/(\d+(?:\.\d+)?)\s*%/g);
  if (!matches) return [];
  return matches
    .map(match => parseFloat(match.replace('%', '')))
    .filter(value => Number.isFinite(value));
}

type FinancialMetrics = {
  baseRevenue: number | null;
  monthlyBurn: number | null;
  fundingCapacity: number | null;
  runwayMonths: number | null;
  growthRate: number | null;
};

function extractFinancialMetrics(text: string): FinancialMetrics {
  const baseRevenue = extractCurrencyWithKeywords(text, [/arr/, /annual\s+revenue/, /revenue/, /pipeline/]);
  const monthlyBurn = extractCurrencyWithKeywords(text, [/burn/, /burn\s+rate/, /monthly\s+spend/], 12);
  const fundingCapacity = extractCurrencyWithKeywords(text, [/funding\s+ask/, /raise/, /capital/]);
  const runwayMonths = extractRunwayMonths(text);
  const growthRate = extractPercentageNearKeyword(text, /growth|cagr|increase|expansion/);

  let inferredBurn = monthlyBurn;
  if (!inferredBurn && fundingCapacity && runwayMonths) {
    inferredBurn = (fundingCapacity / Math.max(runwayMonths, 1));
  }

  return {
    baseRevenue,
    monthlyBurn: inferredBurn,
    fundingCapacity,
    runwayMonths,
    growthRate: growthRate ? growthRate / 100 : null,
  };
}

function extractCurrencyWithKeywords(text: string, keywords: RegExp[], annualiseDivider = 1): number | null {
  let max = 0;
  keywords.forEach(keyword => {
    const pattern = new RegExp(
      `${keyword.source}[^\d$]{0,20}(\$?\d[\d,\.]*)\s*(billion|bn|million|m|thousand|k)?`,
      'gi'
    );
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const numeric = parseFloat(match[1].replace(/[$,]/g, ''));
      if (Number.isNaN(numeric)) continue;
      const value = numeric * unitMagnitude(match[2]);
      if (value > max) {
        max = value;
      }
    }
  });
  if (max === 0) return null;
  return max / annualiseDivider;
}

function extractRunwayMonths(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:month|mo)/i);
  if (!match) return null;
  return parseFloat(match[1]);
}

function unitMagnitude(unit?: string): number {
  if (!unit) return 1;
  const normalized = unit.toLowerCase();
  if (['billion', 'bn'].includes(normalized)) return 1_000_000_000;
  if (['million', 'm'].includes(normalized)) return 1_000_000;
  if (['thousand', 'k'].includes(normalized)) return 1_000;
  return 1;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

type Rng = () => number;

function createDeterministicRng(seedText: string): Rng {
  let seed = 1779033703;
  for (let i = 0; i < seedText.length; i++) {
    seed ^= seedText.charCodeAt(i);
    seed = (seed * 3432918353 + 0x9e3779b9) >>> 0;
  }
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return (seed & 0xffffffff) / 0x100000000;
  };
}

function sampleNormal(mean: number, stdDev: number, rng: Rng): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const mag = Math.sqrt(-2.0 * Math.log(u));
  const z0 = mag * Math.cos(2.0 * Math.PI * v);
  return mean + z0 * stdDev;
}

function cloneRegex(regex: RegExp, extraFlags = ''): RegExp {
  const combinedFlags = `${regex.flags}${extraFlags}`
    .split('')
    .filter((flag, index, arr) => arr.indexOf(flag) === index)
    .join('');
  return new RegExp(regex.source, combinedFlags);
}

export function buildCompositeScoreString(score: number): string {
  return `${PERCENT_FORMATTER.format(score)}%`;
}

export function factorLabels(): Record<FactorKey, string> {
  return FACTOR_LABELS;
}
