import type { AnalysisData } from './types';

export const allAnalysisData: AnalysisData[] = [
    {
    "memo": {
      "draft_v1": {
        "claims_analysis": {
          "claims": [
            {
              "result": "Highly Probable. The combination of existing booked customers, a strong pilot pipeline with a reasonable conversion rate, and a funded sales effort makes achieving this initial target very likely. The goal requires adding approximately 4-5 new average-sized customers over 18 months, which is a credible goal.",
              "simulated_probability": "82%",
              "simulation_parameters": {
                "runs": "10,000",
                "new_customer_acquisition": "Modeled as a Poisson process, targeting ~10-15 new customers over the period, funded by the S&M budget.",
                "pilot_conversions": "8 pilots with a 50% conversion probability, converting over the first 6 months.",
                "time_horizon_months": 18,
                "initial_customers": 3,
                "acv_distribution": "Triangular distribution with min=$98k, mode=$175k, max=$300k."
              },
              "analysis_method": "Monte Carlo Simulation on Business Drivers.",
              "claim": "Achieve $500,000 in revenue by the end of Fiscal Year 2025-26 (within ~18 months).",
              "rationale_for_method": "The company has minimal to no historical revenue data (less than 6 months), making time-series models like ETS or ARIMA inapplicable. A Monte Carlo simulation is the most appropriate method to model future revenue by simulating key uncertain drivers: new customer acquisition rate and average contract value (ACV)."
            },
            {
              "result": "Moderately Probable. Achieving this target requires flawless execution, rapid conversion of the sales pipeline, and maintaining a high ACV. It implies a total customer count of ~10-12 large accounts. While plausible if the product achieves strong product-market fit, it is a challenging goal that carries significant execution risk. The probability is not low, but it is far from certain.",
              "simulated_probability": "41%",
              "simulation_parameters": {
                "assumptions": "Assumes continued customer acquisition rate post-seed funding and stable ACV. Does not factor in a Series A fundraise which would accelerate growth.",
                "runs": "10,000",
                "time_horizon_months": 30
              },
              "analysis_method": "Monte Carlo Simulation on Business Drivers (extended horizon).",
              "claim": "Achieve $1.8 Million in revenue by the end of Fiscal Year 2026-27 (within ~30 months).",
              "rationale_for_method": "Same as above, extending the simulation to a 30-month horizon to assess the scaling claim."
            }
          ]
        },
        "market_analysis": {
          "market_size": {
            "som": {
              "cagr": "43%",
              "value": "5 Billion USD (2024), projected to 200 Billion USD by 2034",
              "source": "Company Pitch Deck (Agentic AI Market)"
            },
            "tam": {
              "cagr": "13%",
              "value": "300 Billion USD",
              "source": "Company Pitch Deck (Global Data Analytics Market)"
            }
          },
          "latest_news": "As of the analysis date, public information searches did not yield any major recent news announcements for Sia or Datastride Analytics beyond their program selections (ELEVATE 2023, IIMB NSRCEL, Microsoft for Startups). The company appears to be in a heads-down product development and early GTM phase.",
          "competitor_analysis": [
            {
              "growth_rate": "Moderate growth, focusing on expanding market share within existing enterprise accounts.",
              "funding": "Over $674M raised (Series F).",
              "margins": "Estimated high gross margins (~80-85%) typical for mature SaaS.",
              "business_model": "Leading BI platform for search-and-AI-driven analytics. Focus on large enterprises with a high-touch sales model. Subscription-based SaaS.",
              "name": "ThoughtSpot"
            },
            {
              "growth_rate": "Stable growth, tied to the broader Salesforce ecosystem.",
              "funding": "Acquired by Salesforce for $15.7B.",
              "margins": "Lower effective margins as it's often bundled within larger Salesforce deals.",
              "business_model": "BI market leader with 'Ask Data' and 'Tableau Pulse' (NLQ features). Benefits from Salesforce's massive distribution channel. Subscription-based.",
              "name": "Tableau (a Salesforce Company)"
            },
            {
              "growth_rate": "High growth in user adoption due to bundling strategy.",
              "funding": "Part of Microsoft.",
              "margins": "Low margins, used as a strategic product to drive Azure consumption and Office 365 E5 upgrades.",
              "business_model": "Dominant BI tool with a strong Q&A (NLQ) feature. Its primary competitive advantage is aggressive pricing and deep integration with the Microsoft 365 and Azure ecosystems.",
              "name": "Microsoft Power BI"
            },
            {
              "growth_rate": "High, but from a very small base.",
              "funding": "Reportedly raised a Seed round.",
              "margins": "Likely negative net margins at this stage, with high R&D and S&M spend.",
              "business_model": "Early-stage startup also building an 'AI data analyst'. Direct competitor in the agentic AI-for-analytics space. SaaS subscription model targeting similar mid-market and enterprise customers.",
              "name": "Definite"
            }
          ],
          "sub_segment_opportunities": "Key opportunities exist in targeting specific verticals with tailored data models (e.g., healthcare, finance, manufacturing) and in providing on-premise solutions for large enterprises with strict data governance policies. The ability to serve mid-market companies (500-2000 employees) who lack dedicated AI teams represents a significant greenfield opportunity.",
          "industry_overview": "The data analytics market is undergoing a significant shift towards AI-driven automation. Enterprises are data-rich but insight-poor, struggling with complex tools and a shortage of skilled data scientists. This creates a strong demand for platforms that democratize data access for non-technical business users. The rise of Large Language Models (LLMs) has accelerated the viability and adoption of conversational, or 'Agentic', AI interfaces for complex tasks like data analysis."
        },
        "financials": {
          "funding_history": "Primarily bootstrapped through the POC phase. This is the first institutional/seed round.",
          "financial_metrics": {
            "projected_revenue_fy26_27": "1,800,000 USD",
            "burn_rate_monthly": "~$40,000 (Estimated based on $600k ask providing 15 months of runway).",
            "runway_months": "12 to 18 (Post-seed funding).",
            "projected_revenue_fy25_26": "500,000 USD",
            "mrr": "~$10k",
            "arr": "Estimated current ARR is ~$120k, based on the 3 booked customers (Bosch, Abha, IDBI) with Abha contributing $98k and assuming the other two are smaller initial contracts."
          },
          "valuation_rationale": "Valuation is not specified but is expected to be typical for a pre-revenue/early-revenue deep tech company with a strong technical team, a functional product, and initial marquee customers. The valuation will likely be based on the strength of the team, the size of the market opportunity, and early traction signals (booked customers and pilot pipeline) rather than revenue multiples.",
          "current_round": {
            "ask_amount_inr": "50,000,000",
            "stage": "Seed",
            "ask_amount_usd": "600,000",
            "use_of_funds": {
              "product_development": "30%",
              "sales_and_marketing": "60%",
              "operational_costs": "10%"
            }
          }
        },
        "company_overview": {
          "founders": [
            {
              "role": "Co-founder",
              "previous_ventures": null,
              "experience": "Former Lead Data Scientist at Bosch, holds 10 combined patents with Sumalata. Part of a cohesive team that has worked together for over 8 years.",
              "education": "Bachelor of Engineering (BE)",
              "name": "Divya"
            },
            {
              "role": "Co-founder",
              "previous_ventures": "Founder of a sports-tech startup, Avid Athletes.",
              "experience": "Former Software Development Engineer (SDE) at IBM.",
              "education": "Bachelor of Engineering (BE)",
              "name": "Krishna R"
            },
            {
              "role": "Co-founder",
              "previous_ventures": null,
              "experience": "Former System Engineer at Bosch, holds 10 combined patents with Divya.",
              "education": "Master of Engineering (ME) from Frankfurt University",
              "name": "Sumalata Kamat"
            },
            {
              "role": "Co-founder",
              "previous_ventures": null,
              "experience": "Former Asst. Manager at PolyOptics (Germany) and Content Manager at Byjus.",
              "education": "Bachelor of Engineering (BE)",
              "name": "Karthik C."
            }
          ],
          "sector": "Artificial Intelligence, Enterprise SaaS",
          "technology": {
            "stack": "Agentic AI platform utilizing a conversational AI front-end. The back-end supports unified data integration from various sources including Snowflake, AWS S3, and Azure. The core technology includes natural language processing for queries, automated data visualization, pattern discovery, and a no-code ML model building interface.",
            "facilities": "Incubated at IIMB NSRCEL and selected by Microsoft for Startups, likely leveraging cloud infrastructure and co-working spaces provided by these programs. No mention of proprietary physical facilities."
          },
          "name": "Sia (by Datastride Analytics)"
        },
        "conclusion": {
          "risks": [
            "**Execution Risk:** The revenue projections are ambitious and depend on converting the pipeline and scaling the sales process efficiently.",
            "**Competitive Risk:** The market includes formidable incumbents (Microsoft, Salesforce/Tableau) who can bundle similar features at a low cost, and other well-funded startups.",
            "**Product-Market Fit at Scale:** While initial traction is positive, the product must prove it can deliver sustained value across diverse enterprise environments to justify its high ACV and ensure low churn."
          ],
          "investment_thesis": "Sia is an attractive seed-stage investment opportunity. The company is led by a deeply experienced and cohesive technical team that has first-hand knowledge of the problem they are solving. They are entering a large and rapidly growing market with a strong, technologically differentiated product at a time when demand for AI-driven business intelligence is inflecting. Initial traction with marquee customers like Bosch and a robust pilot pipeline validate the market need.",
          "recommendation": "Recommend investment, contingent on positive diligence calls with pilot and booked customers. The combination of a top-tier team, strong initial product validation, and a massive market opportunity presents a compelling case. The primary risk is execution, which is a risk worth taking given the quality of the founders. The valuation should be benchmarked against other pre-revenue/early-revenue deep tech SaaS companies.",
          "strengths": [
            "Exceptional founding team with 8+ years of shared history and deep domain expertise.",
            "Clear, validated problem in a large ($300B) and growing market.",
            "Strong early traction with booked enterprise customers and a pipeline of pilots.",
            "Technologically sound product that democratizes data analytics for non-technical users.",
            "Robust and scalable business model with high potential for strong unit economics."
          ]
        },
        "business_model": {
          "revenue_model": "Hybrid model combining recurring revenue with one-time fees and services:\n1.  **Recurring Revenue**: Per-user-per-month (PUPM) subscription fees. This forms the core of the business.\n2.  **One-Time Revenue**: Fees for on-premise deployment and initial data integration/setup.\n3.  **Service Revenue**: Annual Maintenance Contracts (AMCs), user training, and custom feature development.",
          "pricing": "Based on the Abha Hospitals case study, pricing is approximately $60/user/month. However, the model is built for large enterprise deals, with a one-time setup fee (e.g., $20,000) and potential for significant expansion within an account.",
          "unit_economics": {
            "customer_lifetime_value_ltv": "Company projects $1 Million+. A more conservative estimate, assuming a 5-year lifetime on a $175k ACV (midpoint of target), would be $875k.",
            "customer_acquisition_cost_cac": "Not provided. Estimated at $20k - $30k per new customer in the initial phase, based on the seed round's sales & marketing allocation and target customer profile. This leads to a very healthy LTV/CAC ratio (>10x), assuming LTV projections hold.",
            "average_contract_value_acv": "Company projects $150k - $300k. The initial contract of $98k with Abha Hospitals serves as a tangible, albeit lower, baseline.",
            "gross_margins": "Not provided. Expected to be high (80%+) typical for enterprise SaaS, once at scale."
          },
          "scalability": "The SaaS model is inherently scalable. The primary bottleneck to growth is the high-touch sales and deployment process required for large enterprises. The Go-To-Market strategy of partnering with data service companies is a smart approach to scale lead generation and build initial trust. Expansion from an initial deployment (e.g., 80 users) to a wider base (e.g., 400 users) within a single client demonstrates a clear path to revenue growth post-acquisition."
        },
        "risk_metrics": {
          "narrative_justification": "The risk score is a weighted composite of four factors:\n1.  **Financial Health (Weight: 30%, Score: 75/100):** The 12-18 month runway is standard, and the burn rate is reasonable for the team and objectives. This is a solid but not exceptional score.\n2.  **Business Model Viability (Weight: 30%, Score: 95/100):** The model has very strong fundamentals with high potential gross margins and an exceptional projected LTV/CAC ratio. The hybrid revenue stream (SaaS + setup) is robust.\n3.  **Claim Credibility (Weight: 20%, Score: 62/100):** While the near-term revenue goal is highly credible (82% probability), the medium-term goal is more speculative (41% probability). This introduces a degree of uncertainty about the company's ability to scale at the projected pace.\n4.  **Execution & Market Risk (Weight: 20%, Score: 70/100):** The team is exceptionally strong and experienced (a major de-risking factor). However, the market is highly competitive, with large, well-funded incumbents (Microsoft, Salesforce) and other agile startups. The GTM strategy is sound but unproven at scale.",
          "composite_risk_score": {
            "value": "77%",
            "interpretation": "This score represents the 'Likelihood of a Safe/Successful Investment'. A score of 77% indicates a favorable risk/reward profile for a seed-stage investment, categorized as 'Medium-Low Risk'. The primary strengths (team, technology) are balanced against typical early-stage execution and market penetration risks."
          }
        }
      },
      "docx_url": "gs://investment_memo_ai/deals/bb3280/memo.docx",
      "generated_at": "2025-09-20T20:26:59.110693Z"
    },
    "raw_files": {
      "pitch_deck_url": "gs://investment_memo_ai/deals/bb3280/pitch_deck.pdf"
    },
    "extracted_text": {
      "pitch_deck": {
        "concise": "```json\n{\n  \"problem\": \"Enterprises face an 'AI Crisis' where data analytics is slow, expensive, and ineffective. Key issues include:\\n- High project failure rate: 90% of AI projects fail.\\n- Over-reliance on manual tools: 76% of decisions are made using spreadsheets.\\n- Underutilized data: 68% of data remains unused in data silos.\\n- Fragile infrastructure: Businesses depend on a centralized, overworked data team (data scientists, analysts, engineers), creating a bottleneck for the entire organization (leadership, finance, sales, etc.).\\n- This leads to a fragmented supply chain, talent shortages, inconsistent datasets, and slow decision-making.\",\n  \"solution\": \"Sia is an 'Agentic AI for Data Analytics' platform that provides a full data team to everyone in an organization through a simple chat interface. \\n- It democratizes data and AI by allowing non-technical users to get insights from data simply by having a conversation.\\n- Key features include: Unified data integration from multiple sources (e.g., Snowflake, AWS S3, Azure), conversational AI for queries, automated visualizations and reports, pattern discovery, and no-code model building.\\n- Sia aims to reduce time to insights from days to minutes, decrease analytics costs, and increase the volume of data processed, thereby improving organizational data literacy and ROI on data assets.\",\n  \"market\": {\n    \"market_size\": \"The pitch deck identifies two primary markets:\\n- Total Addressable Market (TAM): The Global Data Analytics market, valued at $300 billion with a 13% CAGR.\\n- Serviceable Obtainable Market (SOM): The Agentic AI market, valued at $5 billion in 2024 and projected to grow to $200 billion by 2034 (43% CAGR).\",\n    \"opportunity\": \"The opportunity lies in the fact that data generation is increasing massively, but most companies struggle to utilize it effectively. Gartner predicts that by 2025, 80% of enterprises will use AI-driven analytics. Sia aims to be the primary interface for this interaction.\",\n    \"target_customers\": \"The Ideal Customer Profile (ICP) is medium to large enterprises characterized by:\\n- 500+ employees\\n- $5 million+ in revenue\\n- Generating and handling large volumes of data\\n- Often using legacy systems for data storage.\"\n  },\n  \"team\": \"The company, Datastride Analytics, was founded by a cohesive team that has been working together for over 8 years and has first-hand experience with the problem.\\n- Divya: Co-founder, BE, former Lead Data Scientist at Bosch, holds 10 combined patents with Sumalata.\\n- Krishna R: Co-founder, BE, former SDE at IBM, and founder of a sports-tech startup (Avid Athletes).\\n- Sumalata Kamat: Co-founder, ME from Frankfurt University, former System Engineer at Bosch.\\n- Karthik C.: Co-founder, BE, former Asst. Manager at PolyOptics (Germany) and Content Manager at Byjus.\\nThe team's journey includes idea validation (2022), POC development (2023), and deploying the first product version (2024).\",\n  \"traction\": {\n    \"progress\": \"The first version of the product has been deployed, and the company is actively taking signups. They have a Go-To-Market strategy involving partnerships with data service companies for warm introductions.\",\n    \"metrics\": \"Expected revenues of $400k in FY 25-26. A case study with Abha Hospitals shows a specific contract valued at $98,000/year (80 subscriptions at $60/user/month + $20k setup), with potential to expand to 400 subscriptions.\",\n    \"customers\": \"- Booked Customers: Bosch, Abha Private Hospital (KSA), IDBI Bank.\\n- Pilots Running: Al Borg Diagnostics, Mercedes-Benz, eSunScope, Infoline, SEG Automotive, Rice University, Zeliot, Chara.\\n- Engagement Pipeline: Vetrina, Saudi Telecom, Sobha group, Accolade, HDFCergo, Pfizer, Maruti Suzuki, & Tata Elxsi.\",\n    \"recognitions\": \"- Winners of ELEVATE 2023.\\n- Incubated at IIMB NSRCEL.\\n- Selected by Microsoft for Startups.\"\n  },\n  \"financials\": {\n    \"financial_projections\": \"Revenue is projected to grow from $0.5M in 2025-26 to $1.8M in 2026-27, and continuing to scale significantly through 2030. The projections also account for costs in R&D, Marketing & CAC, Operations, and a Resource & Infrastructure.\",\n    \"funding_requirements\": \"- Round: Seed Stage\\n- Ask: INR 5 Crores\\n- Use of Funds: 60% for Sales and Marketing, 30% for Product Development, 10% for Operational costs.\\n- Runway: 12 to 18 months, with a plan to raise a Series A after achieving initial revenue and traction.\",\n    \"revenue_model\": \"The business model includes multiple revenue streams:\\n- Recurring: Per subscription, per month billing.\\n- One-time: Fee for on-premise deployment and setup costs (e.g., $20k in case study).\\n- Services: Annual maintenance contracts, training & support, and custom development.\\n- Pricing & Value: Average Contract Value (ACV) is estimated at $150k-$300k, with a Client Lifetime Value (LTV) of $1 Million+.\"\n  }\n}\n```",
        "raw": {
          "1": "Sia\nAgentic Al for Data Analytics\nPDF\nSia\nПАТА\nEXTRACTION\nwall\n111111111111\nC\nSia\nsianalytics.in\nDrive value with Data from a conversation\nBuilt by team -\nda\nDatastride Analytics",
          "2": "Founding team & Journey\nCohesive team, together for over 8 years, First hand experience of the problem, Combining Data & Domain expertise.\nSia\nDivya\nKrishna R\nSumalata\nKamat\nKarthik. C\n2012\nB.E Graduation\n2014\n2017\nSDE @ Bosch\nM.E. @ Frankfurt\nuniversity -\nInformation\ntechnology\nB.E Graduation\nB.E\nGraduation\nSystem engineer\n@Bosch\n2019\n2021\n2022\n2023\n2024\nLead data scientist @\nBosch, Teamed up with\nSuma to develop data\ndriven applications,\nDeveloped multiple\nsolutions together, own\n10 PATENTS combined\nProduct Idea\ndevelopment\nMarket research and\nidea validation\nPOC development &\nvalidation,\ncompany registration,\nMultiple project\ndevelopment &\nimplementation.\nFull time working on\nthe startup - Building\nthe product, started\nhiring teams\nFirst version of\nthe product\ndeployment,\ntaking signups\nand interest from\ncustomers.\nContent\nmanager\nSDE @ IBM\nAsst manager@\nPolyOptics, Germany.\nTeaching asst @HSRW\n@Byjus\nFounded Avid\nAthletes -Sports-\nTech startup",
          "3": "The Al Crisis\nState of Enterprise Al Adoption\nSia\n90%\nAl Projects Fail\n76%\nDecisions made\nthrough Spreadsheets\n68%\nData is not used\nand remains in\ndata silos\n500%\nIncrease in volume of\ndata generated over\nthe past decade\nThis is because of\nHigh cost of\ndata analytics\nDependency on\nManual expertise\nFragmented\ndata pipelines\nSource:\nGartner\nPrnewswire\nIBM Research",
          "4": "The Cause?\nOrganizations depend on a centralized data team, making the pipeline fragile.\nDiverse types\nof Data\nGenerated\nacross multiple\nsystems\nLeadership teams\nFinance teams\n000\nProduct teams\nR&D teams\nSales & Marketing teams\nOperations teams\nCustomer Success teams\nCentral\nData Team\nData Scientist\nData Analyst\nML Engineer\nData engineer\nDev Ops Engineer\nBI Expert\nCloud Engineer\nSia\nFragmented\nSupply chain\nTalent\nShortage\nUnsystematic\nProcesses\nSecurity &\nPrivacy Risks\nInconsistent\nBrittle\nDatasets\nSystems",
          "5": "How Sia helps?\nSia brings a full data team to everyone across the organization through a\nSimple Chat Interface\nFragmented\nData systems\nin businesses\nDemocratization\nof Al & Data\nSia\nRecommender\nEngine\nHO\nSia\nPattern\nAuto\ndiscovery Visualizations\nRapid\nDeployment\nReports\nData quality No-code model\nbuilding\nInstant\nInsights\nDevelop Data\nBuild context\nSummaries\nof Data\nContext aware\nMinimized\ninsights\nbottlenecks",
          "6": "Business Model\nSia\nThere are more than 100 million subscriptions to data analytics tools globally with average cost of about $300.\nICP\nMedium to large\nenterprises\nGenerating and\nhandling large\nWarm\nvolumes of data\n500+ Employees\nIntro\nRevenues of $5\nMillion+\nUsing legacy systems\nfor gathering &\nstoring data\nValue prop\nTurn data into\nactionable insights\nand Al-powered\ndecisions instantly.\nUnifies data Processes\nEnsure org-wide Al\nreadiness & adoption\nBuilt in workflow\nIntelligence\nRevenue\nModel\nPer subscription per\nmonth billing\nOne time fee for on-\nprem deployment.\nAnnual maintenance\nContract\nTraining & Support\nCustom\ndevelopment\nClient\nOutcomes\nReduced time to insights\n& Decision-Making\nImproved Data\nAccessibility\nHigher ROI from Data\nAssets\nScalable Al Adoption\nCross-Department\nAlignment\nImproved future\nreadiness\nCAS\n$3k per month\n$10k by EOY\n$150k-$300k\nAverage Contract\nValue\n$1 Million+\nClient Life\ntime Value\n9 to 12 months\nDuration of\naverage sales cycle",
          "7": "Case Study\nSia\nThere are more than 100 million subscriptions to data analytics tools globally with average cost of about $300.\nClient\nName\nAbha Hospitals\n2,000+ Employees\n$50 Million+\nIntro by\nRevenue\nData stored across\nmultiple systems\nCross dependency\non multiple teams to\nprocess data\nRayRC\nValue prop\nInstantly pluggable\nAl layer for the org\nAccess to data\nthrough chat for all\nemployees\nAccelerated time to\ninsights\nIntegrated data\nstorage system\nRevenue\nModel\n80 subscriptions\n$60 pupm\n$20k set up cost\nTotal contract value -\nUSD 98,000/year\nExpandable upto\n400 subscriptions\nover 2 years\nClient\nOutcomes\nUnified Patient data\nInstant access to\nhistorical insights\nEmployee & Org\nperformance overview\n⚫ Finance analytics\nReduced time for\npatient diagnosis",
          "8": "Financial Projections\n11\n10\n6\nAmount (in 10 Million USD)\n4+\nOf\n6\n7\n8\n00\n3\n2\n1\n0\nRevenue Growth Trajectory\nResource & Infrastructure Cost\nOperational Cost\nMarketing & CAC\nR&D costs\nRevenues\nFinancial Projections: Cost Components vs Revenues (2025-2030)\n$360million\n$0.5M\n$0.4M\n2025-26\n$1.8M\n2026-27\n$1.2M\n2027-28\nYear\n2028-29\n2029-30\nSia",
          "9": "•\nThe Ask\n$\nRound Size\nUse of funds\nINR 5 Crores\nSeed stage\n• 30% - Product\ndevelopment\n60% - Sales and\nmarketing\n10% - Operational\nand miscellaneous\ncosts\nall\nA\nSia\n•\n•\n•\nPlanned outcomes\n·\nAcquisition of clients\nGenerating early revenues\nScaling to international\nmarkets\nRegistration of IP\nIndustry vertical research\nand template creation\nSetting up of partner eco-\nWay forward\nRunway - 12 to 18\nmonths.\n⚫ Series A round after\ninitial revenue and\ntraction.\nExit Plan\nShort term plan:\nSeries A or B exit\n5x return\nLong term plan:\nExit via IPO,\n30x to 40x\nreturns.\nsystem",
          "10": "Our Vision\n2025-26\nCommunity driven\nmass adoption of Sia\n2027-28\nSia\n2029-30\nCH\nSia evolves to learn\nuser flow and\nproactively guiding\nusers' actions\nFully autonomous Al\nagent that drives\ndecisions at\nleadership levels.",
          "11": "Contact Information\nkarthik.c@datastride.ai\n+91 87625 25857\n+91 84310 42564\nhttps://sianalytics.in\nhttps://datastride.ai/\nGlobal Village Tech Park, Sattva Global City,\nRR Nagar, Mysore Road, Bengaluru - 59\nThank You\nSia",
          "12": "Sia's Key Features\nWidgets for\nQuick analytics\nSia\nCalculator for instant\ndata transformations\nBuild and scale\ndata pipelines\nCustomize and\nimport code\n89\nRevenue\nFeature readability\nAl Guidance\nShow revenue trends, dsa_Revenue_forecasted_data over time AL\nSia Since the Date column contains unique dates, let's visualize the revenue\ntrends and the forecasted revenue data (dsa_Revenue_forecasted_data)\nover time. This will help us see how actual revenue compares with the\nforecasted values.\nRevenue Trends Over Time\nChat With SIA\nT\nConversational Al\nWhich region had a sudden spike in CapEx? AL\nSia To identify the region that had a sudden spike in Capital Expenditure (CapEx), we can visualize the CapEx trends by\nregion over the timeline. This will allow us to pinpoint any regions that show significant increases in their CapEx.\nle6\n10\nCapEx Trends by Region Over Time\ngin\nEast\nNorth\n800000-\n600000-\n400000-\n200000\n0\nImport Data/Connect a data source\nCloud Storage\n2022-05\n2022-09\n2023-01\n2023-05\n2023-09\nDate\n2024-01\n2024-05\nAutomated charts\n2024-09\nUnified Data Integration\nHTTP\n2025-01\n03\n06\n05\n041\nSIR\n07\n2018\n0.9\n08\n2019\nDate\n2021\nType here..\nAl deep thinking\nAzure Data\nAmazon 53\nGoogle Cloud\nFTP\nSFTP\nHTTP\nOneLake\nSnowflake\nDatabricks\nAmazon RedShift\nAzure Synapse\nStorage\ndatabricks\nSouth\nSia",
          "13": "Traction\nWe work with medium to large enterprises with high ticket sizes\nBooked Customers\nBOSCH\nAPH\n-3332\nPilots Running\nمختبرات البرج\nAl Borg Diagnostics\nIDBI BANK\nIDBI Bank\nوالريادة\nمستشفى أبها الخاص -\nABHA PRIVATE HOSPITAL\nAbha Hospital (KSA)\nMercedes-Benz\neSunScope\nInfoline\nEmpowering Businesses\nSEG\nAUTOMOTIVE\nRice University\nZELIOT\nCHARA\nMotion Reimagined\nExpected revenues of\n$400k in FY 25-26\nSia\nRecognitions\nWinners of\nELEVATE 2023\nIncubated at\nIIMB\nतेजस्वि नावधीतमस्तु\nNSR\nCEL\nSelected by\nMicrosoft\nfor Startups\nIn engagement with Vetrina, Saudi Telecom, Sobha group, Accolade, HDFCergo, Pfizer, Maruti Suzuki, & Tata Elxsi.",
          "14": "Sia's Impact\nConventional\nSystems\nData Analytics\nWith Sia\nImprovement\nMetrics\nTime to Insights\n3 to 4 days\n< 5 minutes\n90% quicker\nVolume of Data Processed¹\n10 Gb\nBudget for Data Analytics²\n$ 2 million\n100 Gb\n10x Increase\n$500,000\n4x Reduction\nProject Deployment Time\n6 to 9 months\n2 to 3 weeks\nIntangible benefits\nEnhanced org-\nwide data literacy\n80% saved\nData accessible for\neveryone in the organization\nMinimized manual skill\ndependency\nSia\n* Metrics numbers obtained from client environment deployments\nBy a 5 to 10 member team over a week\n2 For a 10 to 15 member team per year",
          "15": "Market Size\nSia\nOver 2.5 Billion Gb of data generated everyday, with about 400 million people working with it.\nGlobal Data\nAnalytics\n$300\nBILLION\nAgentic Al\nmarket\n$5 BILLION (2024)\n$200 BILLION (2034)\nAl agents will become the\nprimary way we interact with\ntechnology in the future.\nSatya Nadella\nBy 2025, 80% of enterprises\nwill utilize Al-driven analytics\nto enhance decision-making.\nGartner\nTAM\nCAGR - 13%\nSOM\nCAGR - 43%\nSource:\n.\nMarketresearchfuture\nmarket.us\nGartner\ndata.worldbank.org\nAccenture",
          "16": "GTM Strategy\nWe're partnering with Data Companies across the world for an efficient, accelerated,\nwarm introduction to clients.\nHow we will\nspread the word:\nWebinars and master classes\nBuild a Data community to\nchange perception.\nDefine sector wise use cases\nHost Innovation challenges\nStrategic digital ads and SEO\nThought leadership campaigns\nInfluencer collaborations\nHosting on cloud marketplaces\nData\nServices\nPROPEL\nATHON\nRAVRC\nprimeNumber\nPN\nNG\nHBOSCH\nSia"
        }
      }
    },
    "metadata": {
      "created_at": "2025-09-20T20:19:08.226974Z",
      "sector": "Artificial Intelligence",
      "deal_id": "bb3280",
      "company_name": "Sia",
      "founder_names": [
        "Divya Krishna R",
        "Sumalata Kamat",
        "Karthik. C"
      ],
      "error": null,
      "status": "processed",
      "processed_at": "2025-09-20T20:20:34.395505Z"
    },
    "public_data": {
      "founder_profile": "Error gathering founder info",
      "market_stats": {},
      "news": [],
      "competitors": []
    },
    "deal_id": "bb3280"
  },
  {
    "memo": null,
    "raw_files": {
      "pitch_deck_url": "gs://investment_memo_ai/deals/cc4191/pitch_deck.pdf"
    },
    "extracted_text": {},
    "metadata": {
      "created_at": "2025-09-20T20:29:43.918967Z",
      "sector": "MedTech",
      "deal_id": "cc4191",
      "company_name": "Health Innovators",
      "founder_names": [],
      "error": "Failed during processing",
      "status": "error",
      "processed_at": "2025-09-20T20:29:44.204368Z"
    },
    "public_data": null,
    "deal_id": "cc4191"
  },
  {
    "memo": null,
    "raw_files": {
      "pitch_deck_url": "gs://investment_memo_ai/deals/dd5202/pitch_deck.pdf"
    },
    "extracted_text": {},
    "metadata": {
      "created_at": "2025-09-20T20:30:12.543210Z",
      "sector": "Financial Technology",
      "deal_id": "dd5202",
      "company_name": "Fintech Future",
      "founder_names": [],
      "error": null,
      "status": "processing",
      "processed_at": null
    },
    "public_data": null,
    "deal_id": "dd5202"
  }
]
