"""Browser regression tests for the public static dashboard (desktop/mobile/offline export)."""
import functools
import http.server
from pathlib import Path
import tempfile
import threading
import unittest
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'study_planner_dashboard'
if not SITE.exists(): SITE=ROOT/'site'

class DashboardUI(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(SITE)))
  threading.Thread(target=cls.server.serve_forever,daemon=True).start()
  cls.url=f'http://127.0.0.1:{cls.server.server_port}/'
  cls.p=sync_playwright().start();cls.browser=cls.p.chromium.launch()
 @classmethod
 def tearDownClass(cls): cls.browser.close();cls.p.stop();cls.server.shutdown();cls.server.server_close()
 def setUp(self):
  self.page=self.browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
  self.errors=[];self.page.on('pageerror',lambda error:self.errors.append(str(error)))
  self.page.route('https://fonts.googleapis.com/**',lambda route:route.abort())
  self.page.goto(self.url);self.page.wait_for_selector('.graph-node')
 def tearDown(self):
  self.assertEqual(self.errors,[]);self.page.close()
 def test_network_width_filters_views_and_close(self):
  page=self.page
  self.assertEqual(page.locator('.graph-node').count(),108)
  self.assertEqual(page.locator('.graph-edge').count(),411)
  sizes=page.evaluate("""() => {const g=document.querySelector('.layered-card').getBoundingClientRect();const c=document.querySelector('.layered-layout').getBoundingClientRect();const extra=document.querySelector('.layered-layout>:nth-child(2)').getBoundingClientRect();return {graph:g.width,container:c.width,extraBelow:extra.top>=g.bottom}}""")
  self.assertAlmostEqual(sizes['graph'],sizes['container'],delta=2);self.assertTrue(sizes['extraBelow'])
  page.locator('#layerFilter').select_option('L1_foundation');self.assertEqual(page.locator('.graph-node').count(),37)
  page.locator('#clearFilters').click();self.assertEqual(page.locator('.graph-node').count(),108)
  for view in ['task','technology','bottleneck','gaps','pathway','overview']:
   page.locator(f'.tab[data-view="{view}"]').click();self.assertTrue(page.locator(f'#view-{view}').is_visible())
  page.locator('.graph-node').first.click();self.assertEqual(page.locator('#detailDrawer').get_attribute('aria-hidden'),'false')
  page.keyboard.press('Escape');self.assertEqual(page.locator('#detailDrawer').get_attribute('aria-hidden'),'true')
 def test_research_counts_disclosures_history_and_export(self):
  page=self.page
  page.locator('.workspace-link[href="#hotspots"]').click()
  page.locator('#researchWorkspace').wait_for(state='visible');self.assertTrue(page.locator('#researchWorkspace').is_visible())
  self.assertEqual(page.locator('.weekly-card').count(),5);self.assertEqual(page.locator('.daily-card').count(),3);self.assertEqual(page.locator('.challenge-card').count(),10)
  page.locator('.workspace-link[href="#challenges"]').click()
  page.locator('.challenge-card summary').first.click();self.assertEqual(page.locator('.challenge-card[open]').count(),1)
  page.locator('.challenge-card[open] [data-radar-node]').click();self.assertEqual(page.locator('#detailDrawer').get_attribute('aria-hidden'),'false')
  page.locator('#drawerClose').click();page.locator('.challenge-card summary').first.click();self.assertEqual(page.locator('.challenge-card[open]').count(),0)
  page.locator('.workspace-link[href="#network"]').click();page.go_back();page.locator('#researchWorkspace').wait_for(state='visible');self.assertTrue(page.locator('#researchWorkspace').is_visible());page.go_forward();page.locator('#networkWorkspace').wait_for(state='visible');self.assertTrue(page.locator('#networkWorkspace').is_visible())
  with page.expect_download() as download:
   page.locator('#exportBtn').click()
  with tempfile.TemporaryDirectory() as directory:
   path=Path(directory)/'export.html';download.value.save_as(path)
   content=path.read_text();self.assertNotIn('script src=',content);self.assertNotIn('href="styles.css"',content)
   page.goto(path.as_uri());self.assertEqual(page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()"),'#16232b');self.assertEqual(page.locator('.graph-node').count(),108);page.locator('.workspace-link[href="#hotspots"]').click();self.assertEqual(page.locator('.daily-card').count(),3)
   page.locator('[data-lang="en"]').click();page.locator('.workspace-link[href="#network"]').click();self.assertEqual(page.locator('#clearFilters').inner_text(),'Reset')
 def test_mobile_layout_and_repeated_navigation(self):
  page=self.page;page.set_viewport_size({'width':390,'height':844})
  for target in ['hotspots','challenges','network','hotspots','network']:
   page.locator(f'.workspace-link[href="#{target}"]').click()
   page.locator('#networkWorkspace' if target=='network' else '#researchWorkspace').wait_for(state='visible')
   self.assertLessEqual(page.evaluate('document.documentElement.scrollWidth'),392)
  page.locator('.workspace-link[href="#challenges"]').click();page.locator('.challenge-card summary').nth(9).click();self.assertTrue(page.locator('.challenge-card').nth(9).locator('.challenge-content').is_visible())

 def test_language_consistency_persistence_and_risk_invariance(self):
  page=self.page
  self.assertEqual(page.locator('html').get_attribute('lang'),'zh-CN')
  self.assertEqual(page.locator('.workspace-link[href="#weekly"]').count(),0)
  self.assertEqual(page.locator('.workspace-link[href="#daily"]').count(),0)
  self.assertEqual(page.locator('#clearFilters').inner_text(),'重置')
  initial_ids=page.locator('.graph-node').evaluate_all('(nodes)=>nodes.map(n=>n.dataset.node)')
  page.locator('#riskFilter').select_option('high')
  risk_ids=page.locator('.graph-node').evaluate_all('(nodes)=>nodes.map(n=>n.dataset.node)')
  self.assertTrue(len(risk_ids)>0)
  page.locator('[data-lang="en"]').click()
  self.assertEqual(page.locator('html').get_attribute('lang'),'en')
  self.assertEqual(page.locator('.graph-node').evaluate_all('(nodes)=>nodes.map(n=>n.dataset.node)'),risk_ids)
  self.assertEqual(page.locator('#clearFilters').inner_text(),'Reset')
  for view in ['overview','task','technology','bottleneck','gaps','pathway']:
   page.locator(f'.tab[data-view="{view}"]').click()
   self.assertNotRegex(page.locator(f'#view-{view}').inner_text(),r'[\u4e00-\u9fff]')
  page.locator('.workspace-link[href="#hotspots"]').click()
  self.assertTrue(page.locator('#weekly').is_visible());self.assertTrue(page.locator('#daily').is_visible())
  self.assertFalse(page.locator('#challenges').is_visible())
  self.assertEqual(page.locator('#weeklyTitle').inner_text(),'Weekly Spots')
  self.assertEqual(page.locator('#dailyTitle').inner_text(),'Daily Spots')
  self.assertNotRegex(page.locator('#researchWorkspace').inner_text(),r'[\u4e00-\u9fff]')
  page.reload();self.assertEqual(page.locator('html').get_attribute('lang'),'en')
  page.locator('[data-lang="zh"]').click();self.assertEqual(page.locator('#weeklyTitle').inner_text(),'每周热点')
  self.assertEqual(page.locator('.original-title-label').first.inner_text(),'论文原文标题')
  page.locator('.workspace-link[href="#network"]').click();page.locator('#clearFilters').click()
  self.assertEqual(page.locator('.graph-node').evaluate_all('(nodes)=>nodes.map(n=>n.dataset.node)'),initial_ids)
  self.assertRegex(page.locator('.graph-node').first.inner_text(),r'[\u4e00-\u9fff]')
  unmatched=page.evaluate("""() => {const w=document.createTreeWalker(document.querySelector('#networkWorkspace'),NodeFilter.SHOW_TEXT),out=[];let n;while(n=w.nextNode()){const s=n.nodeValue.trim();if(/[A-Za-z]{3}/.test(s)&&!/[\u4e00-\u9fff]/.test(s)&&!s.startsWith('https:'))out.push(s)}return [...new Set(out)].slice(0,100)}""")
  print('ZH_PROPER_NAMES_OR_UNMATCHED',unmatched)
 def test_english_export_and_bilingual_failure_status(self):
  page=self.page
  page.locator('[data-lang="en"]').click()
  page.locator('.workspace-link[href="#hotspots"]').click()
  with page.expect_download() as download: page.locator('#exportBtn').click()
  with tempfile.TemporaryDirectory() as directory:
   path=Path(directory)/'english.html';download.value.save_as(path);page.goto(path.as_uri())
   self.assertEqual(page.locator('html').get_attribute('lang'),'en')
   self.assertEqual(page.locator('#weeklyTitle').inner_text(),'Weekly Spots')
   page.locator('[data-lang="zh"]').click();self.assertEqual(page.locator('#weeklyTitle').inner_text(),'每周热点')
  page.route('**/radar-data.js*',lambda route:route.fulfill(path=str(SITE/'radar-data.js'),content_type='text/javascript'))
  page.goto(self.url+'#hotspots')
  page.locator('[data-lang="zh"]').click()
  page.evaluate("""() => {window.FINANCE_RADAR.status.daily={state:'error',attemptedAt:'2026-11-11T00:00:00Z'};window.FINANCE_RADAR.daily.selectedAt='2020-01-01T00:00:00Z';} """)
  page.locator('[data-lang="en"]').click()
  self.assertIn('Daily refresh failed',page.locator('#freshnessNotice').inner_text())
  self.assertIn('not today',page.locator('#freshnessNotice').inner_text())
  page.locator('[data-lang="zh"]').click()
  self.assertIn('更新失败',page.locator('#freshnessNotice').inner_text())

if __name__=='__main__': unittest.main(verbosity=2)
