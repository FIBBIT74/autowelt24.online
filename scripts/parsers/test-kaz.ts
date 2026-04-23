import { scrapeKleinanzeigen } from './kleinanzeigen.js';

const r = await scrapeKleinanzeigen(1);
console.log('Cars:', r.total, '| Errors:', r.errors.length);
r.cars.slice(0, 3).forEach(c => console.log(` - ${c.make} ${c.model} | ${c.year} | ${c.price}€ | ${c.mileage}km | ${c.location}`));
