# LLM in Finance

Private static dashboard and data package for the LLM-in-Finance-Economics functionality network.

## Contents

- [Dashboard](dashboard/) — static interactive dashboard.
- [Network data](data/) — canonical JSON, CSV and Excel exports plus audit tables.
- [Pages workflow](.github/workflows/pages.yml) — deploys the dashboard with GitHub Actions.

The dashboard is published as a project site at:

`https://ruyi-agent-space.github.io/LLM-in-Finance/`

The repository remains private. The network is a structured research/engineering map, not a validated investment system or personal learning path. Finance and economics mappings are explicitly labeled with their evidence status and should not be treated as efficacy claims.

## Local preview

From the repository root:

```bash
python -m http.server 8000 --directory dashboard
```

Then open `http://localhost:8000/`. Relative asset paths are intentionally kept so the same files load under the GitHub Pages project path `/LLM-in-Finance/`.
