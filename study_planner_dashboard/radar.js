(() => {
  'use strict';
  const data = window.FINANCE_RADAR;
  if (!data) return;
  const $ = (s) => document.querySelector(s);
  const escape = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const external = (url, title) => /^https:\/\//.test(url) ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(title)} ↗</a>` : escape(title);
  const sources = (items = []) => items.map(s => external(s.url, s.title)).join(' · ');
  const nodeLink = (node) => node ? `<button type="button" class="radar-node-link" data-radar-node="${escape(node)}">查看相关网络节点 ↗</button>` : '';
  const rank = (i) => String(i + 1).padStart(2, '0');
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const day = (s = '') => s.slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  $('#editionDate').textContent = day(data.daily.selectedAt);
  $('.edition-card p').textContent = '每日文献筛选 · 每周关注度快照';
  $('#weeklyDescription').textContent = `基于可用信号的 5 个精选方向。快照：${day(data.weekly.updatedAt)}；按近7日样本文献数、可用 Stars 增量及累计关注度排序，非全领域前五。`;
  $('#dailyDescription').textContent = `${day(data.daily.selectedAt)} 阅读精选。按研究相关性与新近度筛选，不要求当天发表；预印本结论仍需独立验证。`;
  const dailyStale = day(data.daily.selectedAt) !== today;
  const weeklyStale = Date.now() - Date.parse(data.weekly.updatedAt) > 8 * 86400000;
  const notices = [];
  if (dailyStale) notices.push(`当前展示 ${day(data.daily.selectedAt)} 的阅读快照，尚非今天的更新。`);
  if (weeklyStale) notices.push('Weekly Spots 快照已超过 8 天。');
  for (const [key, label] of [['daily', 'Daily'], ['weekly', 'Weekly']]) {
    const status = data.status?.[key];
    if (status?.state === 'error') notices.push(`${label} 更新失败（${status.attemptedAt}）：${status.message}。保留上次成功内容。`);
  }
  $('#freshnessNotice').textContent = notices.join(' ');
  $('#freshnessNotice').hidden = !notices.length;
  $('#dailyTitle span').textContent = dailyStale ? '阅读快照' : '今日阅读';

  $('#weeklyList').innerHTML = data.weekly.items.map((item, i) => `<li class="weekly-card">
    <div class="spot-rank">${rank(i)}</div><div class="weekly-body">
      <div class="spot-top"><span class="topic-label">${escape(item.category)}</span><span class="star-metric">☆ ${fmt(item.stars)} <small>stars</small></span></div>
      <h4>${escape(item.title)}</h4><p>${escape(item.summary)}</p>
      <div class="spot-source">${external(item.repoUrl, item.repo)}<span>代表项目 · 累计关注度</span></div>
      <div class="weekly-signals"><span>近7日样本论文 <b>${item.paperCount == null ? '待采集' : item.paperCount}</b></span><span>约7日 Stars <b>${item.starDelta == null ? '待积累' : (item.starDelta >= 0 ? '+' : '') + fmt(item.starDelta)}</b></span></div>
      ${item.recentPapers?.length ? `<details class="signal-sources"><summary>查看本周样本文献</summary>${item.recentPapers.map(p => `<p>${external(p.url,p.title)}</p>`).join('')}</details>` : ''}
      ${nodeLink(item.nodeId)}
    </div></li>`).join('');
  $('#dailyList').innerHTML = data.daily.items.map((item, i) => `<li class="daily-card">
    <div class="spot-top"><span class="daily-number">READ ${rank(i)}</span><span class="paper-kind">${escape(item.type || 'arXiv 预印本')}</span></div>
    <h4>${external(item.url, item.title)}</h4>
    <div class="paper-date">首发 ${escape(day(item.publishedAt))}${item.updatedAt && day(item.updatedAt) !== day(item.publishedAt) ? ` · 更新 ${escape(day(item.updatedAt))}` : ''}</div>
    <p>${escape(item.why)}</p><div class="reading-lens"><strong>阅读重点</strong> ${escape(item.question)}</div>
    <div class="paper-foot">${escape(item.selectionLabel || '编辑精选')} ${nodeLink(item.nodeId)}</div>
  </li>`).join('');
  $('#challengeList').innerHTML = data.challenges.map((item, i) => `<details class="challenge-card">
    <summary><span class="challenge-index">${rank(i)}</span><span><small>${escape(item.category)}</small><strong>${escape(item.title)}</strong></span><span class="expand-icon" aria-hidden="true">+</span></summary>
    <div class="challenge-content"><p>${escape(item.question)}</p><div class="test-lens"><strong>如何验证</strong><p>${escape(item.test)}</p></div><div class="challenge-sources">${sources(item.sources)}</div>${nodeLink(item.nodeId)}</div>
  </details>`).join('');
  $('#methodologyContent').innerHTML = `<p><strong>关注度口径。</strong> ${escape(data.weekly.methodology)}</p><p><strong>文献筛选。</strong> ${escape(data.daily.methodology)}</p>
    <p><strong>自动更新。</strong> 每日 06:00 UTC 筛选文献；每周一 06:00 UTC 更新代表项目 Stars 并重新排序。GitHub Actions 可能延迟，实际成功时间以本页为准。API 失败时保留上次成功内容并记录错误；若整个工作流未启动或发布失败，本页会按日期提示过期。</p>
    <div class="update-status"><span>Daily 最近成功 <strong>${escape(data.daily.selectedAt)}</strong></span><span>Weekly 最近成功 <strong>${escape(data.weekly.updatedAt)}</strong></span></div>
    <p class="coverage-copy">公开文献样本：${data.daily.coverage ? `${data.daily.coverage.recordsFetched} 篇候选，${data.daily.coverage.eligibleRecords} 篇通过主题筛选` : '初始人工精选'}。主要覆盖英文公开研究，不包含机构内部成果；Core Challenges 为有来源支持的人工整理，不随热榜自动改写。</p><p class="method-links">${external('https://github.com/ruyi-agent-space/LLM-in-Finance/actions/workflows/refresh-radar.yml', '更新运行记录')} · ${external('https://github.com/ruyi-agent-space/LLM-in-Finance/blob/main/study_planner_dashboard/radar-data.json', '公开数据与来源')} · 仅供研究，不构成投资建议。</p>`;

  function route() {
    const hash = location.hash || window.RADAR_EXPORT || '#network';
    const network = hash === '#network';
    $('#researchWorkspace').hidden = network;
    $('#networkWorkspace').hidden = !network;
    document.querySelectorAll('[data-workspace]').forEach(link => {
      const active = network ? link.dataset.workspace === 'network' : link.getAttribute('href') === hash;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    window.FINANCE_NETWORK?.closeDrawer();
  }
  document.querySelectorAll('[data-radar-node]').forEach(button => button.addEventListener('click', () => window.FINANCE_NETWORK?.openNode(button.dataset.radarNode)));
  window.addEventListener('hashchange', route);
  route();
})();
