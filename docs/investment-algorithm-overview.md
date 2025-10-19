# Investment Risk Assessment & Dashboard Enhancements

## 1. Design Goals
- Replace opaque LLM-only heuristics with deterministic, auditable analytics for high-stakes investment decisions.
- Preserve the ability to ingest imperfect OCR/PDF-derived data while constraining the downstream scoring model to well-defined numerical ranges.
- Equip investors with direct control over portfolio weighting assumptions via the dashboard UI.

## 2. Risk Assessment Architecture
### 2.1 Composite Safety Score
- **Technique:** Weighted Scoring Model (WSM).
- **Inputs:** Normalized factor scores for Team Strength, Market Opportunity, Financials, Product Readiness, and Compliance.
- **Computation:** `score = Σ(weight_i × factor_i)` with explicit investor-defined weights that must sum to 1.0.
- **Outcome:** Transparent, auditable safety score on a 0–100 scale.

### 2.2 Subjective Factor Normalization
- **Technique:** Fuzzy Logic Inference System (FIS).
- **Goal:** Map qualitative evidence (e.g., founder experience descriptors) to consistent 0–100 confidence levels.
- **Method:**
  - Define linguistic variables ("Low", "Medium", "High" experience, traction, etc.).
  - Apply membership functions to OCR-extracted signals.
  - Defuzzify using centroid method to produce crisp scores for the WSM inputs.

### 2.3 Financial Projection Analysis
- **Technique:** ML-enhanced Monte Carlo Simulation (MCS).
- **Inputs:** OCR-extracted base projections, historical benchmarks, and uncertainty priors.
- **Process:**
  - Fit a lightweight regression model to estimate parameter distributions for growth, burn, and revenue volatility.
  - Run Monte Carlo trials to generate probability distributions for runway sufficiency and revenue milestones.
- **Outputs:** Percentile curves (P10, P50, P90) and risk flags when probability of shortfall exceeds configured thresholds.

## 3. Frontend Dashboard Workflow
### 3.1 Customize Score Weightage Dialog
- Adds investor-controlled sliders bound to `weightages` state for each scoring factor.
- Enforces normalization after each adjustment to maintain Σ weight = 1.0.

### 3.2 Recalculation Loop
1. User selects **Generate Summary**.
2. `handleRecalculate` assembles payload: current `weightages` + serialized `AnalysisData`.
3. Payload sent via RPC to `getRiskAssessmentSummary` Genkit flow.
4. Server returns updated `composite_investment_safety_score` and `narrative_justification`.
5. `setAnalysisData` immutably updates dashboard state, refreshing the Risk Analysis tab.

## 4. Implementation Notes
- Maintain explicit logging around each deterministic step to support audits.
- Guardrail inputs with schema validation to ensure weight vectors, fuzzy scores, and simulation priors stay within defined bounds.
- Cache simulation results per pitch deck version to avoid redundant Monte Carlo runs when only weightages change.

## 5. Future Extensions
- Expand fuzzy rule base with domain-specific heuristics (e.g., regulated industries).
- Surface Monte Carlo percentile bands visually within the dashboard.
- Allow exporting investor-defined weight profiles for reuse across deals.
