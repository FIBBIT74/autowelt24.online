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
  await tab.waitForTimeout(2000);

  // Accept cookie
  await tab.locator('[data-testid="as24-cmp-accept-all-button"]').click();
  await tab.waitForTimeout(2000);

  const articles = await tab.$$('article');
  console.log(`\nTotal articles: ${articles.length}`);

  if (articles.length > 0) {
    // Print first article's full HTML
    const firstHtml = await articles[0].innerHTML();
    writeFileSync('data/scraped/debug-article.html', firstHtml);
    console.log('First article HTML saved');

    // Try to get key data from first 3 articles
    for (let i = 0; i < Math.min(3, articles.length); i++) {
      const a = articles[i];
      const text = (await a.textContent())?.replace(/\s+/g, ' ').trim().slice(0, 200);
      const link = await a.$('a[href]');
      const href = link ? await link.getAttribute('href') : 'no link';
      const img = await a.$('img');
      const imgSrc = img ? await img.getAttribute('src') : 'no img';
      console.log(`\n--- Article ${i + 1} ---`);
      console.log('Text:', text);
      console.log('Link:', href);
      console.log('Img:', imgSrc?.slice(0, 80));
    }
  }

  await browser.close();
}

debug().catch(console.error);
