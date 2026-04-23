import { chromium } from 'playwright';
import type { ScrapedCar, ScrapeResult } from './types.js';

const BASE_URL =
  'https://suchen.mobile.de/fahrzeuge/search.html?damageUnrepaired=NO_DAMAGE_UNREPAIRED&isSearchRequest=true&sortOrder=relevance&scopeId=C';

function parsePrice(text: string): number {
  const digits = text.replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

function parseMileage(text: string): number {
  const match = text.match(/([\d.]+)\s*km/i);
  if (match) return parseInt(match[1].replace(/\./g, ''), 10);
  return 0;
}

function parseYear(text: string): number {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0], 10) : 0;
}

export async function scrapeMobileDe(maxPages = 3): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    source: 'mobile-de',
    scrapedAt: new Date().toISOString(),
    total: 0,
    cars: [],
    errors: [],
  };

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'de-DE',
    viewport: { width: 1280, height: 800 },
  });

  try {
    for (let page = 1; page <= maxPages; page++) {
      const url = `${BASE_URL}&pageNumber=${page}`;
      console.log(`[mobile.de] Page ${page}: ${url}`);

      const tab = await context.newPage();

      try {
        await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Accept GDPR/cookies
        const cookieBtn = tab.locator('#mde-consent-accept-btn, button[data-testid="as-CookieBanner__accept"]');
        if (await cookieBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
          await cookieBtn.click();
          await tab.waitForTimeout(1500);
        }

        // Wait for listings
        await tab.waitForSelector('.cBox-body--resultitem, [data-testid="result-item"]', { timeout: 15000 });

        const cards = await tab.$$('.cBox-body--resultitem, [data-testid="result-item"]');
        console.log(`[mobile.de] Page ${page}: found ${cards.length} cards`);

        for (const card of cards) {
          try {
            const titleEl = await card.$('h2, .title, [data-testid="title"]');
            const title = (await titleEl?.textContent())?.trim() ?? '';

            const priceEl = await card.$('.price-block__price, [data-testid="price"]');
            const priceText = (await priceEl?.textContent())?.trim() ?? '0';

            const attrsEl = await card.$$('.rbt-attr-item, .vehicle-data li, [data-testid*="attr"]');
            const attrs = await Promise.all(attrsEl.map(el => el.textContent()));
            const attrStr = attrs.join(' ');

            const locationEl = await card.$('.seller-address, [data-testid="seller-location"]');
            const location = (await locationEl?.textContent())?.trim() ?? '';

            const linkEl = await card.$('a[href*="/fahrzeuge/details"]');
            const href = (await linkEl?.getAttribute('href')) ?? '';
            const sourceUrl = href.startsWith('http') ? href : `https://suchen.mobile.de${href}`;

            const imgEl = await card.$('img[src*="mobile"]');
            const imgSrc = (await imgEl?.getAttribute('src')) ?? '';

            const price = parsePrice(priceText);
            const mileage = parseMileage(attrStr);
            const year = parseYear(attrStr);

            if (!title || price === 0) continue;

            const parts = title.split(' ');
            const make = parts[0] ?? '';
            const model = parts.slice(1, 3).join(' ');

            const fuelType = attrStr.match(/Benzin/i) ? 'Gasoline'
              : attrStr.match(/Diesel/i) ? 'Diesel'
              : attrStr.match(/Elektro/i) ? 'Electric'
              : attrStr.match(/Hybrid/i) ? 'Hybrid'
              : 'Unknown';

            const transmission = attrStr.match(/Automatik/i) ? 'Automatic'
              : attrStr.match(/Schaltgetriebe|Manuell/i) ? 'Manual'
              : 'Unknown';

            const car: ScrapedCar = {
              id: `mde-${sourceUrl.split('/').pop()?.split('?')[0] ?? Date.now()}`,
              source: 'mobile-de',
              sourceUrl,
              make,
              model,
              year,
              price,
              mileage,
              fuelType,
              transmission,
              location,
              images: imgSrc ? [imgSrc] : [],
              scrapedAt: result.scrapedAt,
            };

            result.cars.push(car);
          } catch (err) {
            result.errors.push(`Card error: ${err instanceof Error ? err.message : String(err)}`);
          }
        }
      } catch (err) {
        result.errors.push(`Page ${page} error: ${err instanceof Error ? err.message : String(err)}`);
        console.error(`[mobile.de] Page ${page} failed:`, err);
      } finally {
        await tab.close();
      }

      if (page < maxPages) await new Promise(r => setTimeout(r, 3000));
    }
  } finally {
    await browser.close();
  }

  result.total = result.cars.length;
  console.log(`[mobile.de] Done: ${result.total} cars, ${result.errors.length} errors`);
  return result;
}
