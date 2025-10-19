'use server';

/**
 * @fileOverview A risk assessment summary AI agent.
 *
 * - getRiskAssessmentSummary - A function that handles the risk assessment summary process.
 * - RiskAssessmentSummaryInput - The input type for the getRiskAssessmentSummary function.
 * - RiskAssessmentSummaryOutput - The return type for the getRiskAssessmentSummary function.
 */

import {z} from 'genkit';
import {ai} from '@/ai/genkit';
import {buildCompositeScoreString, computeDeterministicRiskSummary} from '@/lib/risk/deterministicRisk';

const RiskAssessmentSummaryInputSchema = z.object({
  companyOverview: z
    .string()
    .describe('A detailed overview of the company being analyzed.'),
  marketAnalysis: z.string().describe('An analysis of the market the company operates in.'),
  businessModel: z.string().describe('A description of the company business model.'),
  financials: z.string().describe('Financial data for the company.'),
  claimsAnalysis: z.string().describe('An analysis of the claims made by the company.'),
  riskMetrics: z.string().describe('Risk metrics for the company.'),
  conclusion: z.string().describe('Overall conclusion about the company.'),
  weights: z.object({
    teamStrength: z.number().optional(),
    marketOpportunity: z.number().optional(),
    traction: z.number().optional(),
    claimCredibility: z.number().optional(),
    financialHealth: z.number().optional(),
  }).optional().describe('Investor-defined weights for calculating the composite score.'),
});
export type RiskAssessmentSummaryInput = z.infer<typeof RiskAssessmentSummaryInputSchema>;

const RiskAssessmentSummaryOutputSchema = z.object({
  composite_investment_safety_score: z
    .string()
    .describe('The composite investment safety score for the company.'),
  narrative_justification: z
    .string()
    .describe('The narrative justification for the composite investment safety score.'),
});
export type RiskAssessmentSummaryOutput = z.infer<typeof RiskAssessmentSummaryOutputSchema>;

export async function getRiskAssessmentSummary(input: RiskAssessmentSummaryInput): Promise<RiskAssessmentSummaryOutput> {
  return riskAssessmentSummaryFlow(input);
}

const riskAssessmentSummaryFlow = ai.defineFlow(
  {
    name: 'riskAssessmentSummaryFlow',
    inputSchema: RiskAssessmentSummaryInputSchema,
    outputSchema: RiskAssessmentSummaryOutputSchema,
  },
  async input => {
    const {compositeScore, narrative} = computeDeterministicRiskSummary(input);
    return {
      composite_investment_safety_score: buildCompositeScoreString(compositeScore),
      narrative_justification: narrative,
    };
  }
);
