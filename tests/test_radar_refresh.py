import copy
import datetime as dt
import importlib.util
import json
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('refresh_radar',ROOT/'scripts/refresh_radar.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
DATA=ROOT/'study_planner_dashboard/radar-data.json'
if not DATA.exists(): DATA=ROOT/'site/radar-data.json'

class RadarTests(unittest.TestCase):
 def setUp(self):
  self.data=json.loads(DATA.read_text()); self.now=dt.datetime(2026,11,11,8,tzinfo=dt.timezone.utc)
  self.papers=[{'id':f'2611.0000{i}','title':title,'abstract':abstract,'publishedAt':'2026-11-09T00:00:00Z','updatedAt':'2026-11-10T00:00:00Z','url':f'https://arxiv.org/abs/2611.0000{i}'} for i,(title,abstract) in enumerate([
   ('Financial LLM multi-agent benchmark','Large language model evaluation for financial multi-agent trading agent systems with empirical experiments.'),
   ('Financial LLM domain adaptation','Large language model financial fine-tuning dataset evaluation.'),
   ('Financial LLM retrieval evaluation','Large language model financial document retrieval benchmark experiments.'),
   ('Financial LLM benchmark reasoning','Large language model financial evaluation dataset code.')])]
 def getter(self,url,token=None):
  return json.dumps({'full_name':url.removeprefix('https://api.github.com/repos/'),'stargazers_count':123}).encode()
 def test_seed_counts(self): m.validate(self.data)
 def test_daily_three_unique_diverse(self):
  items=m.select_daily(self.papers,self.data['weekly']['items'],self.now)
  self.assertEqual(len(items),3);self.assertEqual(len({p['url'] for p in items}),3)
 def test_excludes_nonfinance_stale_future(self):
  bad=copy.deepcopy(self.papers[0]);bad.update(title='LLM recipe benchmark',abstract='Language models cooking evaluation');self.assertFalse(m.eligible(bad,self.now))
  bad=copy.deepcopy(self.papers[0]);bad['updatedAt']='2026-01-01T00:00:00Z';self.assertFalse(m.eligible(bad,self.now))
  bad['updatedAt']='2027-01-01T00:00:00Z';self.assertFalse(m.eligible(bad,self.now))
 def test_failed_source_preserves_success_dates_and_items(self):
  def fail(): raise RuntimeError('secret error body must not be published')
  updated,errors=m.refresh(self.data,self.now,True,fail,self.getter)
  self.assertEqual(errors,['daily','weekly']);self.assertEqual(updated['daily']['items'],self.data['daily']['items']);self.assertEqual(updated['daily']['selectedAt'],self.data['daily']['selectedAt']);self.assertEqual(updated['weekly']['updatedAt'],self.data['weekly']['updatedAt']);self.assertNotIn('secret',json.dumps(updated))
 def test_success_and_no_fake_delta(self):
  updated,errors=m.refresh(self.data,self.now,True,lambda:self.papers,self.getter)
  self.assertEqual(errors,[]);self.assertEqual(updated['status']['daily']['state'],'ok');self.assertTrue(all(i['starDelta'] is None for i in updated['weekly']['items']))
  self.assertTrue(all(isinstance(i['paperCount'],int) for i in updated['weekly']['items']))
 def test_weekly_delta_uses_real_baseline(self):
  hist=[{'at':'2026-11-04T08:00:00Z','stars':{t['repo']:100 for t in self.data['weekly']['items']}}]
  items=m.weekly_items(self.data['weekly']['items'],self.papers,hist,self.now,self.getter)
  self.assertTrue(all(i['starDelta']==23 for i in items))
 def test_parser_deduplicates_and_rejects_invalid_ids(self):
  entry='<entry><id>http://arxiv.org/abs/2611.00001v2</id><title>Financial LLM benchmark</title><summary>Financial language models evaluation</summary><published>2026-11-01T00:00:00Z</published><updated>2026-11-09T00:00:00Z</updated></entry>'
  papers=m.parse_arxiv(('<feed xmlns="http://www.w3.org/2005/Atom">'+entry*2+'</feed>').encode());self.assertEqual(len(papers),1);self.assertEqual(papers[0]['url'],'https://arxiv.org/abs/2611.00001')
 def test_too_few_does_not_relabel(self):
  updated,errors=m.refresh(self.data,self.now,True,lambda:self.papers[:1],self.getter);self.assertIn('daily',errors);self.assertEqual(updated['daily']['selectedAt'],self.data['daily']['selectedAt'])

if __name__=='__main__': unittest.main()
