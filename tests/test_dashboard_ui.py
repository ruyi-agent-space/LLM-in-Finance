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
  page.locator('.workspace-link[href="#weekly"]').click()
  page.locator('#researchWorkspace').wait_for(state='visible');self.assertTrue(page.locator('#researchWorkspace').is_visible())
  self.assertEqual(page.locator('.weekly-card').count(),5);self.assertEqual(page.locator('.daily-card').count(),3);self.assertEqual(page.locator('.challenge-card').count(),10)
  page.locator('.challenge-card summary').first.click();self.assertEqual(page.locator('.challenge-card[open]').count(),1)
  page.locator('.challenge-card[open] [data-radar-node]').click();self.assertEqual(page.locator('#detailDrawer').get_attribute('aria-hidden'),'false')
  page.locator('#drawerClose').click();page.locator('.challenge-card summary').first.click();self.assertEqual(page.locator('.challenge-card[open]').count(),0)
  page.locator('.workspace-link[href="#network"]').click();page.go_back();page.locator('#researchWorkspace').wait_for(state='visible');self.assertTrue(page.locator('#researchWorkspace').is_visible());page.go_forward();page.locator('#networkWorkspace').wait_for(state='visible');self.assertTrue(page.locator('#networkWorkspace').is_visible())
  with page.expect_download() as download:
   page.locator('#exportBtn').click()
  with tempfile.TemporaryDirectory() as directory:
   path=Path(directory)/'export.html';download.value.save_as(path)
   content=path.read_text();self.assertNotIn('script src=',content);self.assertNotIn('href="styles.css"',content)
   page.goto(path.as_uri());self.assertEqual(page.locator('.graph-node').count(),108);page.locator('.workspace-link[href="#daily"]').click();self.assertEqual(page.locator('.daily-card').count(),3)
 def test_mobile_layout_and_repeated_navigation(self):
  page=self.page;page.set_viewport_size({'width':390,'height':844})
  for target in ['weekly','daily','challenges','network','weekly','network']:
   page.locator(f'.workspace-link[href="#{target}"]').click()
   page.locator('#networkWorkspace' if target=='network' else '#researchWorkspace').wait_for(state='visible')
   self.assertLessEqual(page.evaluate('document.documentElement.scrollWidth'),392)
  page.locator('.workspace-link[href="#challenges"]').click();page.locator('.challenge-card summary').nth(9).click();self.assertTrue(page.locator('.challenge-card').nth(9).locator('.challenge-content').is_visible())

if __name__=='__main__': unittest.main(verbosity=2)
