# LLM in Finance-Economics Functionality Network

Public static dashboard built from `study_planner_network/study_planner_network.json` v3.0.0. It is a functionality and support map, not a personal learning path.

## Canonical graph
- 108 nodes: 37 foundation technologies (L1), 51 reusable finance functions (L2), and 20 workflow × asset-class tasks (L3).
- 422 directed edges: 315 required, 64 optional support, 17 workflow precedence, 10 feedback, and 16 risk propagation.
- 279 cross-layer edges; 41 source-backed nodes and 9 source-backed edges. Evidence-covered edges are 34.8%; many domain mappings intentionally remain hypotheses or context-only.
- 0 orphan nodes and 0 self-loops. Two-hop task reachability is 88/88 (100%), while optional support edges remain typed separately. Evidence coverage remains explicit: context-only and hypothesis mappings are not efficacy claims.

## Views and controls
- Layered functionality: directed curved foundation → function → task graph with structural centrality, cross-layer degree, challenge and feedback styling.
- Functionality lens: inspect a financial function’s support, dependencies, risk, evidence and evaluation metric.
- Technical support: inspect foundation coverage of reusable functions and downstream tasks.
- Critical challenges: rank centrality and failure gates with criticality and evidence flags. The summary panels separate risk exposure, core challenges, centrality, source-backed nodes and evidence-covered edges.
- Coverage gaps: review gap flags, visible orphans, unsupported functions/tasks and evidence coverage.
- Lifecycle chain: observe → model → decide → act → feedback for workflow tasks.
- Filters: layer, domain, asset class, workflow stage, edge type, confidence, evidence coverage, criticality, risk and status.

The dashboard is published at <https://ruyi-agent-space.github.io/LLM-in-Finance/>. `LLM_FINANCE_FUNCTIONALITY_AUDIT.md` records the audit scope, coverage stats and residual gaps. Finance/economics mappings remain hypotheses unless a specific source is attached.
