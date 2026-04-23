import { chromium } from 'playwright';
import type { ScrapedCar, ScrapeResult } from './types.js';

const SEARCH_URL = 'https://www.autoscout24.de/lst?atype=C&cy=D&damaged_listing=exclude&ustate=N%2CU&sort=standard&desc=0';

function parsePrice(text: string): number {
  return parseInt(text.replace(/[^\d]/g, '') || '0', 10);
}

function parseMileage(text: string): number {
  return parseInt(text.replace(/[^\d]/g, '') || '0', 10);
}

function parseYear(text: string): number {
  const match = text.match(/\d{2}\/(\d{4})/);
  return match ? parseInt(match[1], 10) : 0;
}

function mapFuelType(text: string): string {
  if (/Elektro/.test(text) && /Benzin|Diesel/.test(text)) return 'Hybrid';
  if (/Elektro/.test(text)) return 'Electric';
  if (/Diesel/.test(text)) return 'Diesel';
  if (/Benzin/.test(text)) return 'Gasoline';
  if (/Hybrid/.test(text)) return 'Hybrid';
  return text.trim();
}

export async function scrapeAutoScout24(maxPages = 3): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    source: 'autoscout24',
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
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'de-DE',
    viewport: { width: 1280, height: 800 },
  });

  let cookieAccepted = false;

  try {
    for (let page = 1; page <= maxPages; page++) {
      const url = `${SEARCH_URL}&page=${page}`;
      console.log(`[AutoScout24] Page ${page}/${maxPages}`);

      const tab = await context.newPage();

      try {
        await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await tab.waitForTimeout(1500);

        if (!cookieAccepted) {
          const btn = tab.locator('[data-testid="as24-cmp-accept-all-button"]');
          if (await btn.isVisible({ timeout: 4000 }).catch(() => false)) {
            await btn.click();
            await tab.waitForTimeout(1500);
            cookieAccepted = true;
          }
        }

        const articles = await tab.$$('article');
        console.log(`[AutoScout24] Page ${page}: ${articles.length} listings`);

        for (const article of articles) {
          try {
            const titleEl = await article.$('h2');
            const title = (await titleEl?.textContent())?.trim() ?? '';
            if (!title) continue;

            const priceEl = await article.$('[data-testid="regular-price"]');
            const priceText = (await priceEl?.textContent())?.trim() ?? '0';

            const calEl = await article.$('[data-testid="VehicleDetails-calendar"]');
            const calText = (await calEl?.textContent())?.trim() ?? '';

            const kmEl = await article.$('[data-testid="VehicleDetails-mileage_odometer"]');
            const kmText = (await kmEl?.textContent())?.trim() ?? '0';

            const fuelEl = await article.$('[data-testid="VehicleDetails-gas_pump"]');
            const fuelText = (await fuelEl?.textContent())?.trim() ?? '';

            const addrEl = await article.$('[data-testid="dealer-address"]');
            const location = (await addrEl?.textContent())?.trim() ?? '';

            const linkEl = await article.$('a[href*="/angebote/"]');
            const href = (await linkEl?.getAttribute('href')) ?? '';
            const sourceUrl = href.startsWith('http')
              ? href.split('?')[0]
              : `https://www.autoscout24.de${href.split('?')[0]}`;

            const imgEl = await article.$('[data-testid="list-item-image"] img, img[src*="pictures.autoscout24"]');
            const imgRaw = (await imgEl?.getAttribute('src')) ?? '';
            const imgSrc = imgRaw.replace(/\/\d+x\d+\.webp$/, '/800x600.webp');

            const price = parsePrice(priceText);
            if (price === 0) continue;

            const titleParts = title.split(' ');
            const make = titleParts[0] ?? '';
            const model = titleParts.slice(1, 3).join(' ');

            const car: ScrapedCar = {
              id: `as24-${sourceUrl.split('/').pop() ?? Date.now().toString()}`,
              source: 'autoscout24',
              sourceUrl,
              make,
              model,
              year: parseYear(calText),
              price,
              mileage: parseMileage(kmText),
              fuelType: mapFuelType(fuelText),
              transmission: 'Unknown',
              location,
              images: imgSrc ? [imgSrc] : [],
              scrapedAt: result.scrapedAt,
            };

            result.cars.push(car);
          } catch (err) {
            result.errors.push(`Card: ${err instanceof Error ? err.message : String(err)}`);
          }
        }
      } catch (err) {
        result.errors.push(`Page ${page}: ${err instanceof Error ? err.message : String(err)}`);
        console.error(`[AutoScout24] Page ${page} error:`, err);
      } finally {
        await tab.close();
      }

      if (page < maxPages) await new Promise(r => setTimeout(r, 3000));
    }
  } finally {
    await browser.close();
  }

  result.total = result.cars.length;
  console.log(`[AutoScout24] Done: ${result.total} cars, ${result.errors.length} errors`);
  return result;
}
