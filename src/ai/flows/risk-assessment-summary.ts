'use server';

/**
 * @fileOverview A risk assessment summary AI agent.
 *
 * - getRiskAssessmentSummary - A function that handles the risk assessment summary process.
 * - RiskAssessmentSummaryInput - The input type for the getRiskAssessmentSummary function.
 * - RiskAssessmentSummaryOutput - The return type for the getRiskAssessmentSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
});
export type RiskAssessmentSummaryInput = z.infer<typeof RiskAssessmentSummaryInputSchema>;

const RiskAssessmentSummaryOutputSchema = z.object({
  compositeInvestmentSafetyScore: z
    .string()
    .describe('The composite investment safety score for the company.'),
  narrativeJustification: z
    .string()
    .describe('The narrative justification for the composite investment safety score.'),
  keyRisks: z.string().describe('Identified key risks associated with the company.'),
});
export type RiskAssessmentSummaryOutput = z.infer<typeof RiskAssessmentSummaryOutputSchema>;

export async function getRiskAssessmentSummary(input: RiskAssessmentSummaryInput): Promise<RiskAssessmentSummaryOutput> {
  return riskAssessmentSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskAssessmentSummaryPrompt',
  input: {schema: RiskAssessmentSummaryInputSchema},
  output: {schema: RiskAssessmentSummaryOutputSchema},
  prompt: `You are an expert risk assessment analyst.

  Based on the provided information about the company, generate a risk assessment summary, including the composite investment safety score, narrative justification, and identified key risks.

  Company Overview: {{{companyOverview}}}
  Market Analysis: {{{marketAnalysis}}}
  Business Model: {{{businessModel}}}
  Financials: {{{financials}}}
  Claims Analysis: {{{claimsAnalysis}}}
  Risk Metrics: {{{riskMetrics}}}
  Conclusion: {{{conclusion}}}

  Provide a summary of the risk assessment, including the composite investment safety score, narrative justification, and key risks.
`,
});

const riskAssessmentSummaryFlow = ai.defineFlow(
  {
    name: 'riskAssessmentSummaryFlow',
    inputSchema: RiskAssessmentSummaryInputSchema,
    outputSchema: RiskAssessmentSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
