import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const URLS = [
  'https://www.autoscout24.de/lst?atype=C&cy=D',
  'https://suchen.mobile.de/fahrzeuge/search.html?isSearchRequest=true',
];

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'de-DE',
    viewport: { width: 1280, height: 800 },
  });

  for (const url of URLS) {
    const tab = await context.newPage();
    console.log('\nOpening:', url);
    try {
      await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await tab.waitForTimeout(3000);

      const name = url.includes('autoscout') ? 'as24' : 'mde';
      await tab.screenshot({ path: `data/scraped/debug-${name}.png`, fullPage: false });

      const html = await tab.content();
      writeFileSync(`data/scraped/debug-${name}.html`, html.slice(0, 5000));

      console.log('Title:', await tab.title());
      console.log('URL after redirect:', tab.url());
      console.log('Screenshot saved: data/scraped/debug-' + name + '.png');
    } catch (err) {
      console.error('Error:', err instanceof Error ? err.message : err);
    }
    await tab.close();
  }

  await browser.close();
}

debug().catch(console.error);
