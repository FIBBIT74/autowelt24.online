import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'de-DE',
    viewport: { width: 1280, height: 800 },
  });

  const tab = await context.newPage();
  await tab.goto('https://www.kleinanzeigen.de/s-autos/c216', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await tab.waitForTimeout(2000);

  const btn = tab.locator('button:has-text("Alle akzeptieren")');
  if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await btn.click();
    await tab.waitForTimeout(1500);
  }

  const article = (await tab.$$('article[data-adid]'))[0];
  if (!article) { console.log('No articles'); await browser.close(); return; }

  // Explore all child elements with text
  const allEls = await article.$$('*');
  for (const el of allEls) {
    const text = (await el.textContent())?.replace(/\s+/g, ' ').trim() ?? '';
    const cls = (await el.getAttribute('class')) ?? '';
    const tag = await el.evaluate(e => e.tagName.toLowerCase());
    if (text && text.length < 100 && text.length > 2 && !text.startsWith('{')) {
      console.log(`<${tag}> class="${cls.slice(0,60)}" => "${text}"`);
    }
  }

  await browser.close();
}

debug().catch(console.error);
