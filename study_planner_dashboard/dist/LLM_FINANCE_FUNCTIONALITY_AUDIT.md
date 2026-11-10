# LLM-in-Finance-Economics v3 audit and QA report

Generated: 2026-11-09 UTC. Scope is functionality, evidence hygiene and graph integrity for an LLM-in-Finance-Economics system.

## v3 network statistics
- Nodes: 108 = 37 L1 foundation technologies + 51 L2 reusable finance functions + 20 L3 workflow/asset/stage tasks.
- Edges: 411; types: {'requires': 271, 'optional_support': 97, 'precedes': 17, 'feedback_to': 10, 'risk_propagates': 16}.
- Cross-layer edges: 279.
- Source-backed edges: 9/411 (2.2%); context-only: 157; derived: 77; hypothesis: 168.
- Source-backed nodes: 41; hypothesis nodes: 67.
- Orphans: 0; self-loops: 0.
- Dimension coverage: stages 9/9; domains 13/13; assets 9/9; function groups 6/6.
- Two-hop L1/L2→L3 reachability: 88/88 (100.0%); density ≠ validity.
- Scorecard denominators: core 12-domain = 2/7/3 buckets; broader ontology = 1/5/17 buckets.

## Coverage audit
The L2 taxonomy is normalized into data/knowledge, analytics, decision, action, simulation/learning and controls/governance. L3 tasks cover document/PDF/table/chart QA, accounting, forecast/nowcast, valuation, VaR/ES/stress/limits/hedging, portfolio construction/rebalance/attribution, OMS/execution/TCA/settlement, market making/LOB, central-bank/macro analysis, compliance/KYC/AML/surveillance/reporting, research screening/due diligence, calibrated ABM simulation and model-risk governance.

`gap_matrix.csv` contains the reviewed residual gaps and evidence status. The principal remaining gap is evidence specificity: E012 (OMI homepage) is a context anchor only, so finance-domain mappings are hypotheses until a paper, dataset, benchmark or regulation is attached.

## Structural corrections
- Removed all self-loops and old linear `depends_on` semantics.
- Edge types are limited to `requires`, `optional_support`, `precedes`, `feedback_to`, and `risk_propagates`.
- Optional/parallel serving and control supports are typed `optional_support`; only necessary function prerequisites are `requires`.
- L2 composition edges are explicit, so the capability layer is no longer flat.
- FND-VLLM, FND-TRAIN-SCALING/E014 and all functions have non-orphan wiring.
- Risk-edge metrics are task-specific: PIT/data freshness, groundedness, unauthorized-call blocks, trace completeness, implementation shortfall, calibration and policy violations as appropriate.

## Core challenge nodes
- **FND-AUDIT — Audit/provenance log** (L1_foundation, governance): proxy=0.84, cross-layer degree=17, criticality=high, evidence=specific_source.
- **FN-RISK — Risk decomposition, VaR/ES and limits** (L2_function, analytics): proxy=0.821, cross-layer degree=13, criticality=high, evidence=context_only.
- **FN-FORECAST — Forecast and nowcast with calibration** (L2_function, analytics): proxy=0.801, cross-layer degree=13, criticality=high, evidence=mixed_context_and_specific.
- **FN-EVIDENCE — Evidence retrieval, authority and citation** (L2_function, data_knowledge): proxy=0.722, cross-layer degree=11, criticality=high, evidence=project_note.
- **PORT-REBALANCE — Rebalance an approved portfolio** (L3_task, domain_task): proxy=0.698, cross-layer degree=8, criticality=high, evidence=context_only.
- **FN-DOC-PDF — Financial document/PDF QA** (L2_function, data_knowledge): proxy=0.67, cross-layer degree=10, criticality=high, evidence=project_note.
- **GOV-MRM — Run model-risk governance review** (L3_task, domain_task): proxy=0.667, cross-layer degree=10, criticality=high, evidence=specific_source.
- **FN-GOV — Model risk governance and reproducibility** (L2_function, controls_governance): proxy=0.662, cross-layer degree=11, criticality=high, evidence=specific_source.
- **FND-EVAL — Holistic/agent evaluation harness** (L1_foundation, evaluation): proxy=0.656, cross-layer degree=12, criticality=high, evidence=specific_source.
- **FN-SERVE-BATCH — Serving batching and concurrency** (L2_function, action): proxy=0.637, cross-layer degree=10, criticality=high, evidence=specific_source.
- **FND-RAG — RAG ingestion/retrieval/reranking** (L1_foundation, context): proxy=0.627, cross-layer degree=10, criticality=high, evidence=project_note.
- **FND-VLLM — vLLM KV-cache/batching/serving** (L1_foundation, runtime): proxy=0.627, cross-layer degree=10, criticality=high, evidence=specific_source.

Centrality is a finance-aware proxy (20% raw degree, 25% cross-layer degree, 35% downstream task reach, 10% risk degree, 10% feedback degree), not economic importance or causal betweenness. Foundation density is not validity; verify with domain metrics.

## Metrics
`metrics.csv` adds domain/function/evidence coverage; PIT leakage; extraction/citation and table/chart QA; forecast calibration/utility; Sharpe/Sortino/drawdown/turnover/exposure; VaR/ES/stress/hedge; valuation; portfolio/attribution; fill/slippage/implementation shortfall/adverse selection/market-making P&L; compliance/KYC/AML/surveillance/reporting; simulation calibration; training/scaling/inference; and governance lineage/privacy/incident/approval metrics.

## Evidence policy
Generic LLM/agent and serving foundations retain citations from established research notes. OMI-specific finance tasks and edges are marked hypothesis or context-only unless a specific source is present. This artifact makes no efficacy claim from graph density or node presence.
