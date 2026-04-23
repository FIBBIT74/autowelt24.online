import { scrapeAutoScout24 } from './autoscout24.js';

const r = await scrapeAutoScout24(1);
console.log('Cars:', r.total);
console.log('Errors:', r.errors.length);
if (r.cars[0]) console.log('First car:', JSON.stringify(r.cars[0], null, 2));
