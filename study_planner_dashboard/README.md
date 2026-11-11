# LLM in Finance-Economics Functionality Network

Public static dashboard built from `study_planner_network/study_planner_network.json` v3.0.0. It is a functionality and support map, not a personal learning path.

## Canonical graph
- 108 nodes: 37 foundation technologies (L1), 51 reusable finance functions (L2), and 20 workflow × asset-class tasks (L3).
- 411 directed edges: 271 required, 97 optional support, 17 workflow precedence, 10 feedback, and 16 risk propagation.
- 279 cross-layer edges; 41 source-backed nodes. Evidence status: 9 source-backed edges, 157 context-only, 77 derived, and 168 hypothesis edges; evidence-covered edges are 40.4%. Dimension coverage: stages 9/9, domains 13/13, asset classes 9/9, and function groups 6/6. Many domain mappings intentionally remain hypotheses or context-only.
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

## Research radar and automatic updates

- Top navigation: Network, Hot Spots (weekly 5 directions and daily 3 readings shown together), Core Challenges (10 evidence-linked questions).
- A persistent 中文 / EN picker controls the complete interface, graph descriptions, research summaries, status and methodology. The default is Chinese. Original paper titles and proper technical names are labeled/preserved; new papers use prewritten bilingual screening explanations, not live translation. The chosen language is included in offline exports. Translation never changes data identifiers, filters or risk scoring.
- The network uses the full content width. Context cards follow the graph; node inspection opens a temporary bottom panel rather than a right sidebar.
- `radar-data.json` is the canonical public radar dataset; `radar-data.js` is its browser wrapper. The original graph dataset is unchanged.
- `scripts/refresh_radar.py` uses public arXiv metadata and GitHub repository metadata. It calls no LLM API and uses no private inputs. Daily selections are deterministic research candidates, not claims of verified scientific quality.
- `.github/workflows/refresh-radar.yml` runs daily at **06:00 UTC**. It refreshes the weekly sample on Monday, on the initial run, and after an overdue/failed weekly update. GitHub schedules can be delayed. Manual dispatch is also supported. Public repository schedules may be disabled by GitHub after 60 days without activity.
- Weekly sorting: new papers in the last 7 days within the retrieved financial-LLM sample, then observed approximately 7-day repository star changes when a 6–9 day baseline exists, then cumulative stars. The 5 directions are a curated watchlist, not an exhaustive field-wide top five. No star-growth number is invented for the first run.
- Daily selection: up to 100 arXiv records ordered by last update; eligible papers must be updated within 90 days, match both finance and language-model topics, and include an evaluation/empirical/code signal. A transparent score combines title relevance (0–6), validation keywords (0–4), and recency (0–2); at most 2 selections per direction. This is metadata screening, not peer review. Older papers may be reselected; publication and update dates remain explicit.
- On source failure, successful timestamps and content are retained, a visible failure status is published, and the workflow is marked failed **after** publishing that status. A failed workflow/deployment or missed schedule can leave the page stale; the browser warns when daily data is not today's UTC selection or weekly data is over 8 days old. No automatic live-refresh claim is made.
- The workflow commits only public radar files to this existing repository and deploys the exact checkout to GitHub Pages. A built-in workflow token is scoped to repository contents, Pages, and deployment identity; there are no added secrets or external subscriptions.

### Verification

Run `python -m unittest discover -s tests -p 'test_radar*.py' -v`, then `node --check study_planner_dashboard/app.js` and `node --check study_planner_dashboard/radar.js`. Tests cover source failures, unchanged success dates after failure, candidate dates/relevance/diversity, deduplication, and measured star deltas. The existing graph remains 108 nodes and 411 edges.

