(() => {
  'use strict';
  const data=window.FINANCE_RADAR;
  if(!data)return;
  const $=s=>document.querySelector(s);
  const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const en=()=>window.FINANCE_I18N?.lang==='en';
  const L=(zh,english)=>en()?english:zh;
  const copy=window.RADAR_COPY;
  const external=(url,title,original=false)=>/^https:\/\//.test(url)?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer"${original?' data-original-title':''}>${esc(title)} ↗</a>`:esc(title);
  const nodeLink=node=>node?`<button type="button" class="radar-node-link" data-radar-node="${esc(node)}">${L('查看相关网络节点','Explore the related network node')} ↗</button>`:'';
  const rank=i=>String(i+1).padStart(2,'0');
  const fmt=n=>Number(n).toLocaleString('en-US');
  const day=(s='')=>s.slice(0,10);
  const name=item=>en()?(copy.weekly[item.id]?.title||item.category):({'analyst-copilots':'投研工作流与分析师助手','document-rag':'财报问答与可溯源检索增强生成'}[item.id]||item.title);
  function render(){
    const today=new Date().toISOString().slice(0,10),dailyStale=day(data.daily.selectedAt)!==today;
    const weeklyStale=Date.now()-Date.parse(data.weekly.updatedAt)>8*86400000;
    $('#editionDate').textContent=day(data.daily.selectedAt);
    $('#weeklyTitle').textContent=L('每周热点','Weekly Spots');
    $('#dailyTitle').textContent=L(dailyStale?'阅读快照':'每日精选','Daily Spots');
    $('#challengesTitle').textContent=L('核心挑战','Core Challenges');
    $('#weeklyDescription').textContent=L(`基于可用信号的5个精选方向。快照：${day(data.weekly.updatedAt)}。按近7日样本文献数、可用关注度增量及累计关注度排序，非全领域前五。`,`Five selected directions based on available signals. Snapshot: ${day(data.weekly.updatedAt)}. Ordered by seven-day sample papers, observed star growth when available, then cumulative stars. Not an exhaustive field-wide top five.`);
    $('#dailyDescription').textContent=L(`${day(data.daily.selectedAt)} 阅读精选。综合主题相关性、验证信号与新近度；不要求当天发表。论文标题保留原文，并非实时翻译。`,`Selected for ${day(data.daily.selectedAt)} using topic relevance, validation signals and recency, not publication date alone. Paper titles remain in their original language; no live translation is performed.`);
    const notices=[];
    if(dailyStale)notices.push(L(`当前展示${day(data.daily.selectedAt)}的阅读快照，尚非今天的更新。`,`This is the ${day(data.daily.selectedAt)} reading snapshot, not today's refresh.`));
    if(weeklyStale)notices.push(L('每周热点快照已超过8天。','The weekly snapshot is more than eight days old.'));
    for(const [key,zh,english]of[['daily','每日文献','Daily'],['weekly','每周热点','Weekly']]){
      const status=data.status?.[key];
      if(status?.state==='error')notices.push(L(`${zh}更新失败（${status.attemptedAt}）。公开来源不可用或有效候选不足，保留上次成功内容。`,`${english} refresh failed (${status.attemptedAt}). A public source was unavailable or too few candidates qualified. The last successful content is retained.`));
    }
    $('#freshnessNotice').textContent=notices.join(' ');$('#freshnessNotice').hidden=!notices.length;
    $('#weeklyList').innerHTML=data.weekly.items.map((item,i)=>`<li class="weekly-card"><div class="spot-rank">${rank(i)}</div><div class="weekly-body">
      <div class="spot-top"><span class="topic-label">${L('研究方向','Research direction')} ${rank(i)}</span><span class="star-metric">☆ ${fmt(item.stars)} <small>${L('累计关注','stars')}</small></span></div>
      <h4>${esc(name(item))}</h4><p>${esc(en()?copy.weekly[item.id].summary:item.summary)}</p>
      <div class="spot-source">${external(item.repoUrl,item.repo)}<span>${L('代表项目 · 累计关注度','Representative project · cumulative attention')}</span></div>
      <div class="weekly-signals"><span>${L('近7日样本论文','Papers in 7-day sample')} <b>${item.paperCount==null?L('待采集','Not sampled'):item.paperCount}</b></span><span>${L('约7日关注增量','Approx. 7-day star change')} <b>${item.starDelta==null?L('待积累基线','Awaiting baseline'):(item.starDelta>=0?'+':'')+fmt(item.starDelta)}</b></span></div>
      ${item.recentPapers?.length?`<details class="signal-sources"><summary>${L('查看本周样本文献（原文标题）','View sampled papers (original titles)')}</summary>${item.recentPapers.map(p=>`<p>${external(p.url,p.title,true)}</p>`).join('')}</details>`:''}${nodeLink(item.nodeId)}</div></li>`).join('');
    $('#dailyList').innerHTML=data.daily.items.map((item,i)=>{
      const theme=copy.weekly[item.theme]?.title||'financial language-model research';
      const automatic=item.selectionScore!==undefined;
      const why=automatic?L(`通过金融与语言模型主题筛选，摘要包含评测、实证或代码等研究信号。仅完成元数据筛选，未自动核验实验结论。`,`Selected for ${theme}. Topic relevance and abstract-level evaluation, empirical or code signals passed the screen. Experimental claims have not been independently verified.`):(en()?'An editorial selection covering evidence reliability, quantitative evaluation or executable financial workflows.':item.why);
      const question=L('核对数据时点、强基线、消融与样本外设置；检查代码和数据是否可获得，再判断结论是否支持你的研究。','Check point-in-time data, strong baselines, ablations and out-of-sample design. Verify code/data availability before using the conclusions in your research.');
      return `<li class="daily-card"><div class="spot-top"><span class="daily-number">${L('精选','Read')} ${rank(i)}</span><span class="paper-kind">${L('arXiv 预印本','arXiv preprint')}</span></div>
      <div class="original-title-label">${L('论文原文标题','Original paper title')}</div><h4>${external(item.url,item.title,true)}</h4>
      <div class="paper-date">${L('首发','First submitted')} ${esc(day(item.publishedAt))}${item.updatedAt&&day(item.updatedAt)!==day(item.publishedAt)?` · ${L('修订','Revised')} ${esc(day(item.updatedAt))}`:''}</div>
      <p>${esc(why)}</p><div class="reading-lens"><strong>${L('阅读重点','Reading focus')}</strong>${esc(question)}</div>
      <div class="paper-foot">${automatic?L('规则筛选 · 非质量背书','Rule-based selection · not a quality endorsement'):L('编辑精选 · 摘要层核验','Editorial selection · abstract-level check')}${nodeLink(item.nodeId)}</div></li>`;
    }).join('');
    $('#challengeList').innerHTML=data.challenges.map((item,i)=>`<details class="challenge-card"><summary><span class="challenge-index">${rank(i)}</span><span><small>${L('研究问题','Research question')} ${rank(i)}</small><strong>${esc(en()?item.category:item.title)}</strong></span><span class="expand-icon" aria-hidden="true">+</span></summary>
      <div class="challenge-content"><p>${esc(en()?copy.challenges[item.id].question:item.question)}</p><div class="test-lens"><strong>${L('如何验证','How to test it')}</strong><p>${esc(en()?copy.challenges[item.id].test:item.test)}</p></div>
      <div class="challenge-sources"><strong>${L('原文来源','Original sources')}：</strong>${item.sources.map(s=>external(s.url,s.title,true)).join(' · ')}</div>${nodeLink(item.nodeId)}</div></details>`).join('');
    $('#methodologyContent').innerHTML=`<p><strong>${L('关注度口径。','Attention methodology.')}</strong> ${L('5个预设精选方向，按近7日检索样本中的相关新论文数、可比关注增量、累计关注度排序。最多检索100篇，按关键词分类，方向允许交叉。关注增量须有6–9天前的实测基线。不是全领域总量，亦不是研究质量或投资表现。','Five curated directions are ordered by relevant new papers in the seven-day retrieved sample, comparable star growth, then cumulative stars. At most 100 records are retrieved and keyword-classified; themes can overlap. Growth needs an observed baseline 6–9 days earlier. These are neither field-wide totals nor measures of research quality or investment performance.')}</p>
      <p><strong>${L('文献筛选。','Literature selection.')}</strong> ${L('候选需近90日更新，明确聚焦金融与语言模型，并含验证信号。评分综合标题主题匹配（0–6）、验证关键词（0–4）与新近度（0–2），同一方向最多2篇。描述采用预先编写的双语筛选说明，不是论文全文或实时机器翻译。','Candidates must be updated within 90 days, focus on finance and language models, and contain validation signals. The score combines title relevance (0–6), validation keywords (0–4), and recency (0–2), with at most two selections per theme. Descriptions use prewritten bilingual screening templates, not full-paper or live machine translation.')}</p>
      <p><strong>${L('自动更新。','Automatic updates.')}</strong> ${L('每日06:00 UTC筛选文献；每周一06:00 UTC更新关注度信号。GitHub Actions可能延迟，以最近成功时间为准。来源失败时保留旧内容并显示错误；整个工作流未启动或发布失败时，页面按日期提示过期。','Literature refreshes daily at 06:00 UTC; attention signals refresh on Mondays at 06:00 UTC. GitHub Actions may be delayed: use the actual success times below. Source failures retain prior content and show an error. Missed workflow runs or failed publication produce a date-based stale warning.')}</p>
      <div class="update-status"><span>${L('每日精选最近成功','Last successful daily refresh')}<strong>${esc(data.daily.selectedAt)}</strong></span><span>${L('每周热点最近成功','Last successful weekly refresh')}<strong>${esc(data.weekly.updatedAt)}</strong></span></div>
      <p class="coverage-copy">${data.daily.coverage?L(`公开样本：${data.daily.coverage.recordsFetched}篇候选，${data.daily.coverage.eligibleRecords}篇通过主题筛选。`,`Public sample: ${data.daily.coverage.recordsFetched} candidates; ${data.daily.coverage.eligibleRecords} passed the topic screen.`):L('初始人工精选。','Initial editorial selection.')} ${L('主要覆盖英文公开研究，不包含机构内部成果。核心挑战为有来源支持的人工整理，不随热榜自动改写。','Coverage favors public English-language research and excludes internal institutional work. Core Challenges are source-backed editorial content and are not rewritten automatically.')}</p>
      <p class="method-links">${external('https://github.com/ruyi-agent-space/LLM-in-Finance/actions/workflows/refresh-radar.yml',L('更新运行记录','Refresh run history'))} · ${external('https://github.com/ruyi-agent-space/LLM-in-Finance/blob/main/study_planner_dashboard/radar-data.json',L('公开数据与来源','Public data and sources'))} · ${L('仅供研究，不构成投资建议。','For research only. Not investment advice.')}</p>`;
    document.querySelectorAll('[data-radar-node]').forEach(button=>button.addEventListener('click',()=>window.FINANCE_NETWORK?.openNode(button.dataset.radarNode)));
    route();
  }
  function route(){
    const hash=location.hash||window.RADAR_EXPORT||'#network';
    const network=hash==='#network',challenges=hash==='#challenges';
    $('#researchWorkspace').hidden=network;$('#networkWorkspace').hidden=!network;
    $('.radar-columns').hidden=challenges;$('#challenges').hidden=!challenges;
    $('#researchHeroTitle').textContent=challenges?L('值得解决的十个问题。','Ten problems worth solving.'):L('追踪热点，审视证据。','Follow the signal. Question the evidence.');
    document.querySelectorAll('[data-workspace]').forEach(link=>{const active=link.dataset.workspace===(network?'network':challenges?'challenges':'hotspots');link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    window.FINANCE_NETWORK?.closeDrawer();
  }
  window.addEventListener('hashchange',route);
  window.addEventListener('finance-language-change',render);
  render();
})();
