import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'de-DE',
    viewport: { width: 1280, height: 800 },
  });

  const tab = await context.newPage();
  await tab.goto('https://www.autoscout24.de/lst?atype=C&cy=D', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await tab.waitForTimeout(3000);

  // Find all buttons
  const buttons = await tab.$$('button');
  console.log(`\nFound ${buttons.length} buttons:`);
  for (const btn of buttons) {
    const text = (await btn.textContent())?.trim();
    const id = await btn.getAttribute('id');
    const cls = await btn.getAttribute('class');
    const testid = await btn.getAttribute('data-testid');
    if (text) console.log(`  Button: "${text}" | id="${id}" | data-testid="${testid}" | class="${cls?.slice(0,60)}"`);
  }

  // Save full HTML
  const html = await tab.content();
  writeFileSync('data/scraped/debug-as24-full.html', html);
  console.log('\nFull HTML saved. Size:', html.length);

  // Try clicking cookie button and get listings
  const allAccept = tab.locator('button:has-text("Alle akzeptieren")');
  if (await allAccept.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('\nClicking "Alle akzeptieren"...');
    await allAccept.click();
    await tab.waitForTimeout(2000);
    await tab.screenshot({ path: 'data/scraped/debug-as24-after-cookie.png' });

    // Check what articles exist
    const articles = await tab.$$('article');
    console.log(`Articles after cookie accept: ${articles.length}`);
    for (const a of articles.slice(0, 3)) {
      const itemName = await a.getAttribute('data-item-name');
      console.log('  article data-item-name:', itemName);
    }
  } else {
    console.log('"Alle akzeptieren" not visible');
  }

  await browser.close();
}

debug().catch(console.error);
