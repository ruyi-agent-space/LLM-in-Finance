window.RADAR_COPY = {
  weekly: {
    'multi-agent-investing': {title: 'Multi-agent investment decisions', summary: 'Coordinate analyst, debate and risk roles to study whether collaboration produces a verifiable decision-making advantage.'},
    'domain-adaptation': {title: 'Financial domain adaptation', summary: 'Adapt general models to financial terminology and tasks with domain data, instruction tuning and parameter-efficient training.'},
    'analyst-copilots': {title: 'Research workflows and analyst copilots', summary: 'Connect evidence retrieval, deterministic valuation, analysis and reporting in a traceable research workflow.'},
    'financial-evaluation': {title: 'Financial reasoning and evaluation', summary: 'Build reproducible cross-task evaluations that separate factual recall, numerical reasoning and real financial workflow ability.'},
    'document-rag': {title: 'Financial document QA and grounded RAG', summary: 'Retrieve evidence across long reports, tables and sources, keeping answers traceable and measurement definitions consistent.'}
  },
  challenges: {
    'grounding': {question: 'How can every financial conclusion be supported by sufficient evidence, with abstention when information is missing?', test: 'Measure evidence support, factual errors, calibration and appropriate abstention.'},
    'numerical-reasoning': {question: 'How can models reconcile formulas, units, currencies and reporting periods without propagating errors through multi-step calculations?', test: 'Check exact numerical results, aligned units and periods, and reproducible calculation traces.'},
    'temporal-validity': {question: 'Does the model use only information available at the decision time, without future facts leaking through training or retrieval?', test: 'Use point-in-time data, strict chronological splits and auditable data versions.'},
    'document-understanding': {question: 'How can models combine text, tables and figures across pages to recover complete evidence from complex financial reports?', test: 'Evaluate cross-page evidence location, table/figure alignment, numerical extraction and document-level reasoning.'},
    'regime-generalization': {question: 'Does performance survive changing market regimes, company samples and information distributions?', test: 'Use frozen-strategy out-of-sample tests, rolling evaluations and cross-market validation.'},
    'economic-validity': {question: 'Do results retain economic value after fees, slippage, market impact and inference costs?', test: 'Measure net returns, drawdowns, turnover, capacity and stress-scenario outcomes.'},
    'tool-reliability': {question: 'How can long workflows prevent tool errors, stale data and coordination failures from compounding?', test: 'Test executable tool calls, failure recovery, process traces and permission boundaries.'},
    'privacy-security': {question: 'How can systems protect sensitive customer and institutional information against unauthorized requests and adversarial prompts?', test: 'Apply least privilege, information-leakage tests and adversarial scenario evaluation.'},
    'fiduciary-fairness': {question: 'Are recommendations aligned with client interests, transparent about conflicts, and fair across groups?', test: 'Review conflict disclosure, suitability, group fairness and human oversight.'},
    'evaluation-reproducibility': {question: 'Do scores reflect real workflow ability, and can an independent party reproduce the data, prompts, tools and judging process?', test: 'Publish configurations, score both process and outcome, and use expert review and independent replication.'}
  }
};
