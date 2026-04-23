import { useState, useEffect } from 'react';
import { Car } from '../data/mockCars';

interface ScrapedCar {
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

const MAKE_ALIASES: Record<string, string> = {
  'Mercedes': 'Mercedes-Benz',
  'VW': 'Volkswagen',
  'Škoda': 'Skoda',
};

// Words that appear as first word in titles but are NOT car brands
const NON_MAKES = new Set([
  'Notverkauf', 'Notverkauf!', 'Golf', 'Passat', 'Polo', 'Tiguan', 'Octavia',
  'Fabia', 'Superb', 'Rapid', 'Kodiaq', 'Fiesta', 'Focus', 'Mondeo', 'Puma',
  'Verkaufe', 'Suche', 'Biete', 'TOP', 'Neu',
]);

function normalizeMake(make: string): string {
  if (!make || NON_MAKES.has(make)) return 'Unknown';
  return MAKE_ALIASES[make] ?? make;
}

function fixImageUrl(url: string, source: ScrapedCar['source']): string {
  if (!url) return '';
  if (source === 'autoscout24') {
    // upgrade thumbnail 250x188 → 800x600
    return url.replace(/\/\d+x\d+\.webp$/, '/800x600.webp');
  }
  if (source === 'kleinanzeigen') {
    // upgrade $_2.AUTO (300px) → $_57.AUTO (large)
    return url.replace('$_2.AUTO', '$_57.AUTO');
  }
  return url;
}

function mapToCar(s: ScrapedCar): Car {
  const days = Math.floor(
    (Date.now() - new Date(s.scrapedAt).getTime()) / 86_400_000
  );
  return {
    id: s.id,
    make: normalizeMake(s.make),
    model: s.model,
    year: s.year,
    price: s.price,
    mileage: s.mileage,
    fuelType: s.fuelType,
    transmission: s.transmission,
    bodyType: 'Unknown',
    exteriorColor: '',
    description: '',
    images: s.images.map(img => fixImageUrl(img, s.source)),
    sellerId: 'scraped',
    sellerName: s.source === 'autoscout24' ? 'AutoScout24' : s.source === 'mobile-de' ? 'mobile.de' : 'Kleinanzeigen',
    location: s.location,
    daysListed: days,
    createdAt: s.scrapedAt,
    isVerified: true,
    performance: { power: 0, acceleration: 0, topSpeed: 0 },
    efficiency: { combined: 0, co2: 0 },
  };
}

interface UseCarsResult {
  cars: Car[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export function useCars(): UseCarsResult {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/scraped-cars')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setCars((data.cars as ScrapedCar[]).map(mapToCar));
        setLastUpdated(data.lastUpdated);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { cars, loading, error, lastUpdated };
}
