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
  await tab.goto('https://www.kleinanzeigen.de/s-autos/c216', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await tab.waitForTimeout(2000);

  // Accept cookies
  const btn = tab.locator('button:has-text("Alle akzeptieren")');
  if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await btn.click();
    await tab.waitForTimeout(1500);
    console.log('Cookies accepted');
  }

  const articles = await tab.$$('article[data-adid]');
  console.log(`Articles with data-adid: ${articles.length}`);

  if (articles.length > 0) {
    const html = await articles[0].innerHTML();
    writeFileSync('data/scraped/debug-kleinanzeigen-article.html', html);
    console.log('First article HTML saved');

    for (let i = 0; i < Math.min(3, articles.length); i++) {
      const a = articles[i];
      const adid = await a.getAttribute('data-adid');
      const text = (await a.textContent())?.replace(/\s+/g, ' ').trim().slice(0, 250);
      const links = await a.$$('a[href]');
      const href = links[0] ? await links[0].getAttribute('href') : '';
      const img = await a.$('img');
      const imgSrc = img ? (await img.getAttribute('src') ?? await img.getAttribute('data-src') ?? '') : '';
      console.log(`\n--- Ad ${i+1} (id=${adid}) ---`);
      console.log('Text:', text);
      console.log('Link:', href);
      console.log('Img:', imgSrc.slice(0, 80));
    }
  }

  await browser.close();
}

debug().catch(console.error);
