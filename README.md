# LLM in Finance-Economics Functionality Network

Public repository containing the v3 three-layer LLM-in-finance/economics functionality network and its interactive dashboard.

## Contents

- `study_planner_dashboard/` — self-contained static dashboard. Open `study_planner_dashboard/index.html` locally, or view the public [GitHub Pages dashboard](https://ruyi-agent-space.github.io/LLM-in-Finance/).
- `study_planner_network/` — canonical JSON, CSV, XLSX and audit exports used by the dashboard.
- `.github/workflows/pages.yml` — deploys the dashboard directory as a GitHub Pages artifact on pushes to `main`.

The dashboard is an analytical mapping, not an efficacy claim or personal learning path. Finance/economics mappings remain hypotheses unless a specific source is attached; see the audit report and evidence fields in the data package.

## Local use

From the repository root, serve the dashboard directory with any static HTTP server so browser asset loading is consistent:

```bash
python -m http.server 8000 --directory study_planner_dashboard
```

Then open <http://localhost:8000/>.

## GitHub Pages

The workflow publishes `study_planner_dashboard/` from the `main` branch via GitHub Actions. The project Pages path is `/LLM-in-Finance/`, so the public dashboard is available at:

<https://ruyi-agent-space.github.io/LLM-in-Finance/>

If Pages has not been enabled yet, open **Settings → Pages**, select **GitHub Actions** as the source, and rerun the workflow. Repository visibility is managed separately in GitHub settings.
