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
  const url = 'https://www.kleinanzeigen.de/s-autos/c216';
  console.log('Opening:', url);

  await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await tab.waitForTimeout(3000);

  console.log('Title:', await tab.title());
  console.log('Final URL:', tab.url());

  await tab.screenshot({ path: 'data/scraped/debug-kleinanzeigen.png' });

  // Check for bot block
  const bodyText = (await tab.textContent('body') ?? '').slice(0, 300);
  console.log('Body preview:', bodyText);

  // Find listing items
  const selectors = [
    '[data-adid]',
    'article',
    '.ad-listitem',
    'li[class*="aditem"]',
    'li[id*="item_"]',
  ];
  for (const sel of selectors) {
    const count = (await tab.$$(sel)).length;
    if (count > 0) console.log(`Selector "${sel}": ${count} items`);
  }

  const html = await tab.content();
  writeFileSync('data/scraped/debug-kleinanzeigen.html', html.slice(0, 8000));
  await browser.close();
}

debug().catch(console.error);
