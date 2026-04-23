import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scrapeAutoScout24 } from './autoscout24.js';
import { scrapeMobileDe } from './mobile-de.js';
import { scrapeKleinanzeigen } from './kleinanzeigen.js';
import type { ScrapeResult } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data/scraped');

function save(result: ScrapeResult) {
  mkdirSync(DATA_DIR, { recursive: true });
  const file = join(DATA_DIR, `${result.source}.json`);
  writeFileSync(file, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Saved ${result.total} cars → ${file}`);
}

export async function runAllParsers() {
  console.log('\n=== Parser run started:', new Date().toLocaleString('de-DE'), '===\n');

  const results = await Promise.allSettled([
    scrapeAutoScout24(3),
    scrapeMobileDe(3),
    scrapeKleinanzeigen(3),
  ]);

  for (const r of results) {
    if (r.status === 'fulfilled') {
      save(r.value);
    } else {
      console.error('Parser failed:', r.reason);
    }
  }

  console.log('\n=== Parser run finished ===\n');
}

// Allow running directly: node --loader tsx scripts/parsers/run.ts
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAllParsers().catch(console.error);
}
