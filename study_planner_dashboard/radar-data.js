window.FINANCE_RADAR = {
  "schemaVersion": 1,
  "weekly": {
    "updatedAt": "2026-11-11",
    "windowDays": 7,
    "methodology": "5 个精选方向，允许交叉。自动更新后，先按近7日 arXiv 检索样本中的相关新论文数排序，再按有可比基线的7日 Stars 增量，最后按累计 Stars。首轮无周度基线时不展示虚构增量。论文数不是全领域总量，Stars不是研究质量或投资表现。初始精选仅有累计 Stars，首次自动采集后补充周度信号。",
    "items": [
      {
        "id": "multi-agent-investing",
        "title": "多智能体投资决策",
        "category": "Multi-agent Investment Decisions",
        "summary": "让分析、辩论与风控角色协作生成投资决策，研究重点是协作是否带来可验证的增益。",
        "repo": "TauricResearch/TradingAgents",
        "repoUrl": "https://github.com/TauricResearch/TradingAgents",
        "stars": 121901,
        "nodeId": "FND-RUNTIME",
        "keywords": [
          "multi-agent",
          "multi agent",
          "trading agent",
          "investment decision"
        ],
        "paperCount": null,
        "starDelta": null,
        "recentPapers": []
      },
      {
        "id": "domain-adaptation",
        "title": "金融领域适配与微调",
        "category": "Financial Domain Adaptation",
        "summary": "用金融数据、指令微调与参数高效训练，让通用模型掌握领域术语和任务。",
        "repo": "AI4Finance-Foundation/FinGPT",
        "repoUrl": "https://github.com/AI4Finance-Foundation/FinGPT",
        "stars": 21548,
        "nodeId": "FN-RL-SFT",
        "keywords": [
          "fine-tun",
          "finetun",
          "domain adapt",
          "financial language model"
        ],
        "paperCount": null,
        "starDelta": null,
        "recentPapers": []
      },
      {
        "id": "analyst-copilots",
        "title": "投研工作流与分析师 Copilot",
        "category": "Financial Research Workflow Automation",
        "summary": "把资料检索、确定性估值计算、分析和报告串成可追溯的研究流程。",
        "repo": "AI4Finance-Foundation/FinRobot",
        "repoUrl": "https://github.com/AI4Finance-Foundation/FinRobot",
        "stars": 8407,
        "nodeId": "FN-DILIGENCE",
        "keywords": [
          "financial analys",
          "financial research",
          "valuation",
          "report generation",
          "copilot"
        ],
        "paperCount": null,
        "starDelta": null,
        "recentPapers": []
      },
      {
        "id": "financial-evaluation",
        "title": "金融推理与能力评测",
        "category": "Financial Reasoning and Evaluation",
        "summary": "建立跨任务、可复现的金融评测，区分事实记忆、数值推理与真实业务能力。",
        "repo": "The-FinAI/PIXIU",
        "repoUrl": "https://github.com/The-FinAI/PIXIU",
        "stars": 896,
        "nodeId": "FN-EVAL",
        "keywords": [
          "benchmark",
          "evaluation",
          "reasoning"
        ],
        "paperCount": null,
        "starDelta": null,
        "recentPapers": []
      },
      {
        "id": "document-rag",
        "title": "财报问答与可溯源 RAG",
        "category": "Financial Document QA and Grounded RAG",
        "summary": "在长财报、表格和跨来源数据中检索证据，生成能核验来源与口径的回答。",
        "repo": "patronus-ai/financebench",
        "repoUrl": "https://github.com/patronus-ai/financebench",
        "stars": 389,
        "nodeId": "FND-RAG",
        "keywords": [
          "retrieval",
          "rag",
          "question answering",
          "financial document",
          "financial report"
        ],
        "paperCount": null,
        "starDelta": null,
        "recentPapers": []
      }
    ]
  },
  "daily": {
    "selectedAt": "2026-11-11",
    "methodology": "初始3篇为编辑精选：真实金融任务的证据可靠性、策略的样本外有效性、数学推理与可执行代码。自动更新覆盖 arXiv 近90日更新的金融×LLM文献样本，需同时匹配金融与语言模型主题，并有评测/实证/代码等可复核信号；按主题相关性、验证信号与新近度加权，并限制同一方向最多2篇。预印本、非全网穷尽，不承诺科研质量。",
    "items": [
      {
        "id": "agenticfinbench-2026",
        "title": "AgenticFinBench: Benchmarking Financial Agents on Diverse Tasks from Real-World Requests",
        "url": "https://arxiv.org/abs/2611.04813",
        "type": "论文 · 预印本",
        "publishedAt": "2026-11-03",
        "updatedAt": "2026-11-03",
        "why": "把“答案正确”与“有证据支持”拆开评估，适合检查金融 Agent 是否真的可靠。",
        "question": "优先看证据审计、任务复杂度分层，以及模型与工具编排的贡献拆分。",
        "selectionLabel": "编辑精选 · 摘要层核验",
        "nodeId": "FN-EVAL"
      },
      {
        "id": "quant-arena-2026",
        "title": "Quant-Arena: Benchmarking LLM Agents for Quantitative Trading Research",
        "url": "https://arxiv.org/abs/2610.30113",
        "type": "论文 · 预印本",
        "publishedAt": "2026-10-21",
        "updatedAt": "2026-10-21",
        "why": "直接回答“会写策略是否等于有投资价值”，把样本外表现、交易约束与成本放到核心位置。",
        "question": "先读时间切分、冻结策略协议、现金账户限制和市场冲击假设。",
        "selectionLabel": "编辑精选 · 摘要层核验",
        "nodeId": "FND-BACKTEST"
      },
      {
        "id": "quanteval-2026",
        "title": "QuantEval: A Benchmark for Financial Quantitative Tasks in Large Language Models",
        "url": "https://arxiv.org/abs/2601.08689",
        "type": "论文 · 预印本",
        "publishedAt": "2026-01-13",
        "updatedAt": "2026-10-14",
        "why": "10 月更新版把评测从金融问答推进到“计算、实现、验证”闭环，适合构建自己的模型验收清单。",
        "question": "重点看代码执行评测、风险收益指标、完整回测配置和微调与强化学习的取舍。",
        "selectionLabel": "编辑精选 · 摘要层核验",
        "nodeId": "FN-ACCOUNTING"
      }
    ]
  },
  "challenges": [
    {
      "id": "grounding",
      "title": "幻觉、证据与不确定性",
      "category": "Grounding, Hallucination and Abstention",
      "question": "如何让每个金融结论都有充分证据，并在信息不足时主动拒答？",
      "test": "证据支持率、事实错误率、校准与合理拒答。",
      "sources": [
        {
          "title": "AgenticFinBench",
          "url": "https://arxiv.org/abs/2611.04813"
        },
        {
          "title": "FinTrust",
          "url": "https://arxiv.org/abs/2510.15232"
        }
      ],
      "nodeId": "FN-EVIDENCE"
    },
    {
      "id": "numerical-reasoning",
      "title": "数值推理与指标口径",
      "category": "Numerical Reasoning and Metric Consistency",
      "question": "如何同时处理公式、单位、币种、财年与季度口径，避免多步计算中的误差传播？",
      "test": "精确数值核验、单位与期间对齐、计算轨迹。",
      "sources": [
        {
          "title": "QuantEval",
          "url": "https://arxiv.org/abs/2601.08689"
        },
        {
          "title": "FinFIRST",
          "url": "https://huggingface.co/datasets/inclusionAI/FinFIRST"
        }
      ],
      "nodeId": "FN-ACCOUNTING"
    },
    {
      "id": "temporal-validity",
      "title": "时点有效性与数据泄漏",
      "category": "Temporal Validity and Data Leakage",
      "question": "模型是否只使用当时可获得的信息，训练或检索是否偷偷看到了未来？",
      "test": "point-in-time 数据、严格时间切分、可审计的数据版本。",
      "sources": [
        {
          "title": "Evaluating LLMs in Finance Requires Explicit Bias Consideration",
          "url": "https://arxiv.org/abs/2602.14233"
        },
        {
          "title": "FinSearchComp",
          "url": "https://arxiv.org/abs/2509.13160"
        }
      ],
      "nodeId": "FN-DATA-PIT"
    },
    {
      "id": "document-understanding",
      "title": "长文与跨模态财报理解",
      "category": "Long-context and Multimodal Understanding",
      "question": "如何跨页整合文字、表格和图像，在复杂财报中找到同一论点的完整证据？",
      "test": "跨页证据定位、表图对齐、数值提取与文档级推理。",
      "sources": [
        {
          "title": "FinDocMRE",
          "url": "https://arxiv.org/abs/2605.17962"
        }
      ],
      "nodeId": "FN-TABLE-CHART"
    },
    {
      "id": "regime-generalization",
      "title": "市场变化与样本外泛化",
      "category": "Regime Shift and Out-of-sample Generalization",
      "question": "在市场环境、公司样本和信息分布变化后，模型能力还能保持吗？",
      "test": "冻结策略的样本外测试、滚动评测、跨市场检验。",
      "sources": [
        {
          "title": "Quant-Arena",
          "url": "https://arxiv.org/abs/2610.30113"
        },
        {
          "title": "Large Language Model Agents in Finance",
          "url": "https://aclanthology.org/2025.findings-emnlp.972/"
        }
      ],
      "nodeId": "FN-FORECAST"
    },
    {
      "id": "economic-validity",
      "title": "真实成本、风险与经济价值",
      "category": "Costs, Risk and Economic Validity",
      "question": "扣除手续费、滑点、市场冲击与推理成本后，结果是否仍具有经济价值？",
      "test": "成本后收益、回撤、换手率、容量与压力情景。",
      "sources": [
        {
          "title": "Quant-Arena",
          "url": "https://arxiv.org/abs/2610.30113"
        },
        {
          "title": "Evaluating LLMs in Finance Requires Explicit Bias Consideration",
          "url": "https://arxiv.org/abs/2602.14233"
        }
      ],
      "nodeId": "FN-TCA"
    },
    {
      "id": "tool-reliability",
      "title": "工具调用与多智能体可靠性",
      "category": "Tool-use and Multi-agent Reliability",
      "question": "如何防止错误工具、过期数据和协作错误在长流程中逐步放大？",
      "test": "可执行工具测试、失败恢复、过程追踪与权限边界。",
      "sources": [
        {
          "title": "FinToolBench",
          "url": "https://arxiv.org/abs/2603.08262"
        },
        {
          "title": "AgenticFinBench",
          "url": "https://arxiv.org/abs/2611.04813"
        }
      ],
      "nodeId": "FND-TOOLS"
    },
    {
      "id": "privacy-security",
      "title": "隐私保护与对抗安全",
      "category": "Privacy and Adversarial Security",
      "question": "如何在处理客户和机构敏感信息时，抵御越权请求与对抗性提示？",
      "test": "最小权限、敏感信息泄露测试、攻击场景评估。",
      "sources": [
        {
          "title": "FinTrust",
          "url": "https://arxiv.org/abs/2510.15232"
        },
        {
          "title": "Large Language Model Agents in Finance",
          "url": "https://aclanthology.org/2025.findings-emnlp.972/"
        }
      ],
      "nodeId": "FN-PRIVACY"
    },
    {
      "id": "fiduciary-fairness",
      "title": "合规、公平与受托责任",
      "category": "Compliance, Fairness and Fiduciary Alignment",
      "question": "建议是否符合客户利益、披露利益冲突，并避免对不同群体的不公平待遇？",
      "test": "利益冲突披露、适当性、群体公平性与人工审核。",
      "sources": [
        {
          "title": "FinTrust",
          "url": "https://arxiv.org/abs/2510.15232"
        }
      ],
      "nodeId": "FN-COMPLY"
    },
    {
      "id": "evaluation-reproducibility",
      "title": "评测有效性与可复现审计",
      "category": "Valid Evaluation and Reproducible Audit",
      "question": "评分是否反映真实业务能力，第三方能否复现数据、提示、工具和评判过程？",
      "test": "公开配置、过程和最终结果双重评分、专家复核与独立复现。",
      "sources": [
        {
          "title": "Evaluating LLMs in Finance Requires Explicit Bias Consideration",
          "url": "https://arxiv.org/abs/2602.14233"
        },
        {
          "title": "QuantEval",
          "url": "https://arxiv.org/abs/2601.08689"
        },
        {
          "title": "FinFIRST",
          "url": "https://huggingface.co/datasets/inclusionAI/FinFIRST"
        }
      ],
      "nodeId": "FN-GOV"
    }
  ],
  "status": {
    "daily": {
      "state": "seeded"
    },
    "weekly": {
      "state": "seeded"
    }
  },
  "sources": {
    "agenticfinbench": {
      "title": "AgenticFinBench: Benchmarking Financial Agents on Diverse Tasks from Real-World Requests",
      "url": "https://arxiv.org/abs/2611.04813",
      "date": "2026-11-03",
      "dateType": "arXiv first submission",
      "verification": "arXiv indexed metadata and abstract"
    },
    "quant-arena": {
      "title": "Quant-Arena: Benchmarking LLM Agents for Quantitative Trading Research",
      "url": "https://arxiv.org/abs/2610.30113",
      "date": "2026-10-21",
      "dateType": "arXiv first submission",
      "verification": "arXiv abstract page opened"
    },
    "quanteval": {
      "title": "QuantEval: A Benchmark for Financial Quantitative Tasks in Large Language Models",
      "url": "https://arxiv.org/abs/2601.08689",
      "date": "2026-01-13",
      "updatedDate": "2026-10-14",
      "dateType": "arXiv first submission / v3 revision",
      "verification": "arXiv abstract page opened"
    },
    "bias-evaluation": {
      "title": "Evaluating LLMs in Finance Requires Explicit Bias Consideration",
      "url": "https://arxiv.org/abs/2602.14233",
      "date": "2026-02-15",
      "dateType": "arXiv first submission",
      "verification": "arXiv abstract page opened"
    },
    "fintoolbench": {
      "title": "FinToolBench: Evaluating LLM Agents for Real-World Financial Tool Use",
      "url": "https://arxiv.org/abs/2603.08262",
      "date": "2026-03-09",
      "updatedDate": "2026-08-01",
      "dateType": "arXiv first submission / v2 revision",
      "verification": "arXiv abstract page opened"
    },
    "fintrust": {
      "title": "FinTrust: A Comprehensive Benchmark of Trustworthiness Evaluation in Finance Domain",
      "url": "https://arxiv.org/abs/2510.15232",
      "fullTextUrl": "https://arxiv.org/html/2510.15232v1",
      "date": "2025-10-17",
      "dateType": "arXiv first submission; EMNLP 2025 Main noted",
      "verification": "arXiv abstract and HTML full text opened"
    },
    "finsearchcomp": {
      "title": "FinSearchComp: Towards a Realistic, Expert-Level Evaluation of Financial Search and Reasoning",
      "url": "https://arxiv.org/abs/2509.13160",
      "date": "2025-09-16",
      "dateType": "arXiv first submission",
      "verification": "arXiv abstract page opened"
    },
    "findocmre": {
      "title": "FinDocMRE: A Benchmark for Document-Level Financial Multimodal Reasoning Evaluation",
      "url": "https://arxiv.org/abs/2605.17962",
      "date": "2026-05-18",
      "dateType": "arXiv first submission",
      "verification": "arXiv indexed metadata and abstract"
    },
    "finfirst": {
      "title": "FinFIRST: Financial Information Retrieval, Sourcing and Traceability",
      "url": "https://huggingface.co/datasets/inclusionAI/FinFIRST",
      "date": null,
      "dateType": "Primary dataset card; publication date not verified",
      "verification": "Authors' dataset card opened; full evaluation protocol and task schema inspected"
    },
    "agents-survey": {
      "title": "Large Language Model Agents in Finance: A Survey Bridging Research, Practice, and Real-World Deployment",
      "url": "https://aclanthology.org/2025.findings-emnlp.972/",
      "date": "2025-11",
      "dateType": "ACL Anthology publication month; day not stated",
      "verification": "Official ACL Anthology record opened"
    }
  },
  "coverageLimitations": [
    "公开英文论文和开源项目覆盖较多，不能代表金融机构内部研究或全部中文研究。",
    "AgenticFinBench 和 FinDocMRE 的标题、日期和摘要来自搜索工具返回的 arXiv 原始索引记录；其正文未能直接抓取。其他所列 arXiv/ACL 页面已直接打开。",
    "这些研究构成编辑精选，不是穷尽的系统文献检索，也不构成投资建议。"
  ]
};
