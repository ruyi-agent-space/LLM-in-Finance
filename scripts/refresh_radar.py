#!/usr/bin/env python3
"""Refresh public research metadata without credentials or LLM-generated claims.

No private inputs, third-party model calls, or trading actions. Failed updates
retain the previous successful data; a public status is written for the UI.
"""
import argparse
import copy
import datetime as dt
import json
import os
from pathlib import Path
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

UTC = dt.timezone.utc
QUERY = '(all:financial OR all:finance OR all:trading OR all:portfolio) AND (all:"large language model" OR all:LLM OR all:agentic)'
FINANCE = ('financial', 'finance', 'trading', 'investment', 'stock market', 'equity', 'cryptocurrency', 'asset pricing', 'banking', 'credit risk', 'accounting')
MODELS = ('large language model', 'llm', 'language model', 'agentic')
VALIDATION = ('benchmark', 'evaluat', 'dataset', 'empirical', 'backtest', 'experiment', 'open-source', 'code')
ATOM = {'a': 'http://www.w3.org/2005/Atom'}


def stamp(now):
    return now.isoformat(timespec='seconds').replace('+00:00', 'Z')


def date(value):
    return dt.datetime.fromisoformat(value.replace('Z', '+00:00')).replace(tzinfo=UTC)


def request(url, token=None):
    headers = {'User-Agent': 'LLM-in-Finance-Research-Radar/1.0 (public research metadata)', 'Accept': 'application/json' if 'api.github.com' in url else 'application/atom+xml'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=35) as response:
                body = response.read(3_000_001)
                if len(body) > 3_000_000:
                    raise ValueError('Response exceeded metadata size limit')
                return body
        except Exception:
            if attempt == 2:
                raise
            time.sleep(3 * (attempt + 1))


def parse_arxiv(body):
    root = ET.fromstring(body)
    papers = []
    for entry in root.findall('a:entry', ATOM):
        def text(tag):
            return ' '.join((entry.findtext('a:' + tag, '', ATOM)).split())
        raw_id = text('id')
        match = re.search(r'arxiv\.org/abs/(\d{4}\.\d{4,5})(?:v\d+)?$', raw_id)
        if not match:
            continue
        title, abstract = text('title'), text('summary')
        published, updated = text('published'), text('updated')
        if not all([title, abstract, published, updated]):
            continue
        date(published); date(updated)
        papers.append({'id':match[1], 'title':title, 'abstract':abstract, 'url':'https://arxiv.org/abs/' + match[1], 'publishedAt':published, 'updatedAt':updated, 'categories':[c.get('term','') for c in entry.findall('a:category',ATOM)]})
    if not papers:
        raise ValueError('No valid arXiv records returned')
    return list({p['id']:p for p in papers}.values())


def fetch_papers():
    params = urllib.parse.urlencode({'search_query':QUERY, 'start':0, 'max_results':100, 'sortBy':'lastUpdatedDate', 'sortOrder':'descending'})
    return parse_arxiv(request('https://export.arxiv.org/api/query?' + params))


def matches(text, phrase):
    # Whole-word left boundary prevents 'valuation' matching 'evaluation' and
    # whole-word acronym matching prevents 'rag' matching 'average'/'arbitrage'.
    end = r'\b' if phrase in ('rag', 'llm', 'code') else r'[a-z-]*\b'
    return bool(re.search(r'\b' + re.escape(phrase) + end, text, re.I))


def eligible(p, now):
    title, abstract = p['title'].lower(), p['abstract'].lower()
    text = title + ' ' + abstract
    age = (now - date(p['updatedAt'])).total_seconds() / 86400
    finance_title = any(matches(title,x) for x in FINANCE)
    finance_abstract = sum(matches(abstract,x) for x in FINANCE)
    qfin = any(c.startswith('q-fin.') for c in p.get('categories',[]))
    finance_relevant = finance_title or (finance_abstract >= 2 and qfin)
    model_title = any(matches(title,x) for x in MODELS)
    model_mentions = len(re.findall(r'\b(?:llms?|large language models?|language models?|agentic)\b',abstract))
    model_primary = model_title or model_mentions >= 2
    return (0 <= age <= 90 and date(p['publishedAt']) <= now and finance_relevant
            and model_primary and any(matches(text,x) for x in VALIDATION))


def tags(p, themes):
    text = (p['title'] + ' ' + p['abstract']).lower()
    return [theme for theme in themes if any(matches(text,word) for word in theme['keywords'])]


def relevance(p, now):
    title, text = p['title'].lower(), (p['title'] + ' ' + p['abstract']).lower()
    topic = 3 * any(matches(title,x) for x in FINANCE) + 3 * any(matches(title,x) for x in MODELS)
    validation = min(4, sum(matches(text,x) for x in VALIDATION))
    recency = 2 * max(0, 1 - (now-date(p['updatedAt'])).days / 90)
    return round(topic + validation + recency, 4)


def select_daily(papers, themes, now):
    ranked = sorted([p for p in papers if eligible(p, now)], key=lambda p:(relevance(p, now),p['updatedAt']), reverse=True)
    chosen, groups = [], {}
    for paper in ranked:
        related = tags(paper, themes)
        theme = max(related,key=lambda t:sum(3*matches(paper['title'],w)+matches(paper['abstract'],w) for w in t['keywords'])) if related else next(t for t in themes if t['id']=='financial-evaluation')
        group = theme['id']
        if groups.get(group, 0) >= 2:
            continue
        text = (paper['title']+' '+paper['abstract']).lower()
        signals = [x for x in VALIDATION if matches(text,x)]
        chosen.append({k:v for k,v in paper.items() if k != 'abstract'} | {
            'type':'arXiv 预印本', 'why':f'匹配“{theme["title"]}”，摘要包含可复核研究信号：{", ".join(signals[:3])}。仅完成元数据与主题筛选，尚未核验实验结论。',
            'question':'核对数据时点、强基线、消融与样本外设置；检查代码/数据是否可获得，再判断结论是否支持你的研究。',
            'selectionLabel':'规则筛选 · 非质量背书', 'nodeId':theme['nodeId'], 'selectionScore':relevance(paper,now), 'theme':group})
        groups[group] = groups.get(group,0) + 1
        if len(chosen) == 3:
            return chosen
    raise ValueError('Fewer than 3 eligible, sufficiently diverse financial LLM papers')


def weekly_items(themes, papers, history, now, get=request):
    items = copy.deepcopy(themes)
    window = now - dt.timedelta(days=7)
    week_papers = [p for p in papers if window <= date(p['publishedAt']) <= now and eligible(p, now)]
    for item in items:
        meta = json.loads(get('https://api.github.com/repos/' + item['repo'], token=os.getenv('GITHUB_TOKEN')))
        stars = meta.get('stargazers_count')
        if not isinstance(stars,int) or stars < 0 or meta.get('full_name','').lower() != item['repo'].lower():
            raise ValueError('Invalid GitHub project metadata')
        baselines = [h for h in history if 6 <= (now-date(h['at'])).total_seconds()/86400 <= 9 and item['repo'] in h['stars']]
        baseline = min(baselines,key=lambda h:abs((now-date(h['at'])).total_seconds()/86400-7)) if baselines else None
        matched = [p for p in week_papers if item['id'] in [t['id'] for t in tags(p,[item])]]
        item.update(stars=stars, starDelta=stars-baseline['stars'][item['repo']] if baseline else None,
                    baselineAt=baseline['at'] if baseline else None, paperCount=len(matched),
                    recentPapers=[{'title':p['title'],'url':p['url'],'publishedAt':p['publishedAt']} for p in matched[:3]])
    return sorted(items,key=lambda t:(t['paperCount'], t['starDelta'] if t['starDelta'] is not None else -10**9, t['stars']),reverse=True)


def validate(data):
    assert len(data['weekly']['items']) == 5
    assert len(data['daily']['items']) == 3
    assert len(data['challenges']) == 10
    assert len({p['url'] for p in data['daily']['items']}) == 3
    for p in data['daily']['items']:
        assert p['url'].startswith('https://arxiv.org/abs/')
        date(p['publishedAt'])
    for t in data['weekly']['items']:
        assert isinstance(t['stars'],int) and t['stars'] >= 0


def refresh(data, now, force_weekly=False, paper_fetcher=fetch_papers, getter=request):
    data = copy.deepcopy(data)
    data.setdefault('status',{})
    failures = []
    try:
        papers = paper_fetcher()
        data['daily']['items'] = select_daily(papers,data['weekly']['items'],now)
        data['daily']['selectedAt'] = stamp(now)
        data['daily']['coverage'] = {'recordsFetched':len(papers),'eligibleRecords':sum(eligible(p,now) for p in papers),'query':QUERY,'maxResults':100,'updatedWithinDays':90,'screening':'finance title or q-fin plus two finance signals; primary language-model focus; word-boundary keyword matching'}
        data['daily']['methodology'] = '公开 arXiv 查询最近更新的至多100篇候选；仅保留近90日更新、金融主题须在标题出现，或在q-fin分类摘要出现至少2种金融关键词；语言模型须在标题出现或摘要提及至少2次，并含评测/实证/代码等摘要信号的文献。排序=标题主题匹配（0–6）+验证关键词（0–4）+90日新近度（0–2）；同一方向最多2篇。规则分数不是质量、引用量或投资价值，原文结论未自动验证。'
        data['status']['daily'] = {'state':'ok','attemptedAt':stamp(now),'message':'arXiv metadata refreshed'}
    except Exception as error:
        papers = None
        failures.append('daily')
        # Never expose tokens, response bodies or exception URLs to the public UI.
        data['status']['daily'] = {'state':'error','attemptedAt':stamp(now),'message':f'公开文献源暂不可用或候选不足 ({type(error).__name__})'}
    due = force_weekly or now.weekday()==0 or (now-date(data['weekly']['updatedAt'])).days >= 8 or data['status'].get('weekly',{}).get('state') != 'ok'
    if due:
        try:
            if papers is None:
                raise ValueError('Paper metadata unavailable')
            history = data.get('starHistory',[])
            items = weekly_items(data['weekly']['items'],papers,history,now,getter)
            data['weekly']['items'] = items
            data['weekly']['updatedAt'] = stamp(now)
            data['weekly']['windowStart'] = stamp(now-dt.timedelta(days=7))
            data['weekly']['coverage'] = {'recordsFetched':len(papers),'query':QUERY,'weeklyPaperCount':'first submission within 7 days; keyword-classified sample; themes may overlap'}
            data['weekly']['methodology'] = '5个预设精选方向，按近7日 arXiv 检索样本相关新论文数→可比7日Stars增量→累计Stars排序。论文样本上限100篇，主题按公开关键词匹配，方向可交叉；不是全领域总量或客观前五。Stars增量须有6–9天前的实测基线，首次无基线显示“待积累”。累计Stars仅作社区关注度补充，不表示论文质量或投资表现。'
            data['starHistory'] = [h for h in history if (now-date(h['at'])).days <= 35] + [{'at':stamp(now),'stars':{t['repo']:t['stars'] for t in items}}]
            data['status']['weekly'] = {'state':'ok','attemptedAt':stamp(now),'message':'Weekly paper sample and project attention refreshed'}
        except Exception as error:
            failures.append('weekly')
            data['status']['weekly'] = {'state':'error','attemptedAt':stamp(now),'message':f'周度来源采集未完整成功 ({type(error).__name__})'}
    validate(data)
    return data, failures


def write(data, directory):
    text = json.dumps(data,ensure_ascii=False,indent=2)+'\n'
    (directory/'radar-data.json').write_text(text,encoding='utf-8')
    safe_js = text.strip().replace('<', r'\u003c').replace('>', r'\u003e').replace('&', r'\u0026')
    (directory/'radar-data.js').write_text('window.FINANCE_RADAR = '+safe_js+';\n',encoding='utf-8')
    # Keep the pre-existing downloadable dist copy consistent with the hosted dashboard.
    if (directory/'dist').is_dir():
        for name in ['radar-data.json','radar-data.js']:
            (directory/'dist'/name).write_text((directory/name).read_text(),encoding='utf-8')


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--directory',type=Path,default=Path('study_planner_dashboard'))
    parser.add_argument('--force-weekly',action='store_true')
    args=parser.parse_args()
    data=json.loads((args.directory/'radar-data.json').read_text())
    now=dt.datetime.now(UTC)
    updated, failures=refresh(data,now,args.force_weekly)
    write(updated,args.directory)
    print(json.dumps({'at':stamp(now),'daily':updated['status']['daily'],'weekly':updated['status']['weekly']},ensure_ascii=False))
    if os.getenv('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'],'a') as f:
            f.write('source_failures='+','.join(failures)+'\n')
    # Status must still be committed and deployed on a source error.

if __name__=='__main__':
    main()
