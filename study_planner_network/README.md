# LLM-in-Finance-Economics three-layer network (v3)

This is a domain network, not a Study Planner taxonomy. It models:

1. **L1 foundation technology**: model/training/inference, context/RAG/memory, planning/tools/runtime, finance data/solver/risk/OMS substrates, controls and evaluation.
2. **L2 reusable finance function**: normalized groups `data_knowledge`, `analytics`, `decision`, `action`, `simulation_learning`, `controls_governance`.
3. **L3 workflow × asset class × stage task**: compact IDs such as `DOC-QA-PDF`, `FORECAST-NOWCAST`, `RISK-STRESS`, `PORT-CONSTRUCT`, `EXEC-TCA`, `MM-QUOTE`, `CB-COMMS`, `COMPLY-SURVEILLANCE`, `RESEARCH-DUE-DILIGENCE`, `SIM-ABM`, `GOV-MRM`; full workflow/asset/stage fields are included.

## Counts
- 37 L1 foundations, 51 L2 functions, 20 L3 tasks, 411 edges.
- Edge types: `requires`, `optional_support`, `precedes`, `feedback_to`, `risk_propagates`.
- 9/411 edges are source-backed; 157 context-only; 77 derived; 168 hypotheses.
- Orphans: 0; self-loops: 0; 2-hop L1/L2→L3 reachability: 88/88 (100.0%), with density ≠ validity.
- Dimension coverage: stages 9/9, domains 13/13, asset classes 9/9, function groups 6/6.
- Audit scorecard denominators: core 12-domain = 2/7/3 buckets; broader ontology = 1/5/17 buckets. These are distinct denominators.

## Files
- `study_planner_network.json`: canonical nested export (`foundations`, `capabilities`/`functions`, `tasks`, `edges`, `evidence`, `metrics`).
- `nodes.csv`, `foundations.csv`, `technologies.csv`, `capabilities.csv`, `functions.csv`, `tasks.csv`, `edges.csv`.
- `metrics.csv`: finance and LLM metrics with domain, function, evidence and protocol fields.
- `gap_matrix.csv`, `audit_recommendations.csv`, `audit_proposed_edges.csv`, `audit_centrality.csv`, `audit_summary.json`, `audit_report.md`, `LLM_FINANCE_FUNCTIONALITY_AUDIT.md`.
- `study_planner_network.xlsx`: workbook with the graph and audit tables.
- `MANIFEST.json`: SHA-256 checksums.

## Evidence hygiene
E012 (OMI homepage) is a context anchor only and cannot support every finance task. Domain finance/economics nodes and edges are marked hypothesis unless a specific official paper, dataset, benchmark or regulation is attached. Foundation presence/density is not validation.
