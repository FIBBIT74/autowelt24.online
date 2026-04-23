export interface ScrapedCar {
  id: string;
  source: 'autoscout24' | 'mobile-de' | 'kleinanzeigen';
  sourceUrl: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  location: string;
  images: string[];
  scrapedAt: string;
}

export interface ScrapeResult {
  source: string;
  scrapedAt: string;
  total: number;
  cars: ScrapedCar[];
  errors: string[];
}
