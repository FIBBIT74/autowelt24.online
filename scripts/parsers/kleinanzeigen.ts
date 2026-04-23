import { chromium } from 'playwright';
import type { ScrapedCar, ScrapeResult } from './types.js';

// Category 216 = Autos, sorted by newest first
const BASE_URL = 'https://www.kleinanzeigen.de/s-autos/anzeige:angebote/sortierung:INSERTION_DATE/c216';

function parsePrice(text: string): number {
  return parseInt(text.replace(/[^\d]/g, '') || '0', 10);
}

function parseMileage(text: string): number {
  const match = text.match(/([\d.]+)\s*km/i);
  return match ? parseInt(match[1].replace(/\./g, ''), 10) : 0;
}

function parseYear(text: string): number {
  // "EZ 03/2019" → 2019
  const match = text.match(/(\d{2})\/(\d{4})/);
  return match ? parseInt(match[2], 10) : 0;
}

function guessMake(title: string): string {
  const MAKES = [
    'Volkswagen', 'VW', 'BMW', 'Mercedes-Benz', 'Mercedes', 'Audi', 'Opel', 'Ford',
    'Skoda', 'Škoda', 'Renault', 'Seat', 'Peugeot', 'Fiat', 'Hyundai', 'Citroën',
    'Citroen', 'Mini', 'Kia', 'Toyota', 'Nissan', 'Mazda', 'Volvo', 'Honda',
    'Porsche', 'Tesla', 'Dacia', 'Suzuki', 'Lexus', 'Subaru', 'Jeep', 'Mitsubishi',
    'Land Rover', 'Jaguar', 'Alfa Romeo', 'Lancia', 'Smart', 'Dodge', 'Chevrolet',
  ];
  const t = title.toLowerCase();
  for (const make of MAKES) {
    if (t.startsWith(make.toLowerCase()) || t.includes(' ' + make.toLowerCase())) {
      return make === 'VW' ? 'Volkswagen' : make;
    }
  }
  return title.split(' ')[0] ?? '';
}

export async function scrapeKleinanzeigen(maxPages = 3): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    source: 'kleinanzeigen',
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
      const url = page === 1
        ? BASE_URL
        : BASE_URL.replace('/s-autos/', `/s-autos/seite:${page}/`);

      console.log(`[Kleinanzeigen] Page ${page}/${maxPages}`);

      const tab = await context.newPage();

      try {
        await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await tab.waitForTimeout(2000);

        if (!cookieAccepted) {
          const btn = tab.locator('button:has-text("Alle akzeptieren")');
          if (await btn.isVisible({ timeout: 4000 }).catch(() => false)) {
            await btn.click();
            await tab.waitForTimeout(1500);
            cookieAccepted = true;
          }
        }

        const articles = await tab.$$('article[data-adid]');
        console.log(`[Kleinanzeigen] Page ${page}: ${articles.length} listings`);

        for (const article of articles) {
          try {
            const adid = await article.getAttribute('data-adid') ?? Date.now().toString();

            const titleEl = await article.$('h2.text-module-begin, a.ellipsis');
            const title = (await titleEl?.textContent())?.trim() ?? '';
            if (!title) continue;

            const priceEl = await article.$('.aditem-main--middle--price-shipping--price');
            const priceText = (await priceEl?.textContent())?.trim() ?? '0';
            const price = parsePrice(priceText);
            if (price === 0) continue;

            const locationEl = await article.$('.aditem-main--top--left');
            const location = (await locationEl?.textContent())?.trim() ?? '';

            const tags = await article.$$('.simpletag');
            const tagTexts = await Promise.all(tags.map(t => t.textContent()));

            const mileageTag = tagTexts.find(t => t?.includes('km')) ?? '';
            const yearTag = tagTexts.find(t => t?.includes('EZ')) ?? '';

            const linkEl = await article.$('a[href*="/s-anzeige/"]');
            const href = (await linkEl?.getAttribute('href')) ?? '';
            const sourceUrl = href.startsWith('http')
              ? href
              : `https://www.kleinanzeigen.de${href}`;

            const imgEl = await article.$('img[src*="kleinanzeigen"], img[data-src*="kleinanzeigen"]');
            const imgRaw = (await imgEl?.getAttribute('src'))
              ?? (await imgEl?.getAttribute('data-src'))
              ?? '';
            const imgSrc = imgRaw.replace('$_2.AUTO', '$_57.AUTO');

            const make = guessMake(title);
            const model = title.replace(new RegExp(`^${make}\\s*`, 'i'), '').split(/[,|]/)[0].trim();

            const car: ScrapedCar = {
              id: `kaz-${adid}`,
              source: 'kleinanzeigen' as any,
              sourceUrl,
              make,
              model,
              year: parseYear(yearTag),
              price,
              mileage: parseMileage(mileageTag),
              fuelType: 'Unknown',
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
        console.error(`[Kleinanzeigen] Page ${page} error:`, err);
      } finally {
        await tab.close();
      }

      if (page < maxPages) await new Promise(r => setTimeout(r, 2000));
    }
  } finally {
    await browser.close();
  }

  result.total = result.cars.length;
  console.log(`[Kleinanzeigen] Done: ${result.total} cars, ${result.errors.length} errors`);
  return result;
}
