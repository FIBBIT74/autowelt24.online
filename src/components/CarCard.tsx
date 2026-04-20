import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { Car } from '../data/mockCars';
import { formatCurrency, cn } from '../lib/utils';

const FUEL_CHIP: Record<string, { label: string; cls: string }> = {
  Electric:         { label: '⚡ Electric',    cls: 'bg-emerald-100 text-emerald-700' },
  Diesel:           { label: '🔵 Diesel',      cls: 'bg-blue-100 text-blue-700' },
  Gasoline:         { label: '⛽ Petrol',      cls: 'bg-orange-100 text-orange-700' },
  Hybrid:           { label: '🌿 Hybrid',      cls: 'bg-teal-100 text-teal-700' },
  'Plug-in Hybrid': { label: '🔋 Plug-in',    cls: 'bg-purple-100 text-purple-700' },
};

interface CarCardProps {
  car: Car;
  className?: string;
}

export default function CarCard({ car, className }: CarCardProps) {
  const [faved, setFaved] = useState(false);
  const fuel = FUEL_CHIP[car.fuelType] ?? { label: car.fuelType, cls: 'bg-neutral-100 text-neutral-600' };
  const isNew = (car.daysListed ?? 99) <= 3;

  return (
    <div
      className={cn(
        'group rounded-2xl overflow-hidden bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {isNew && (
            <span className="bg-brand text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow">
              New
            </span>
          )}
          {car.isVerified && (
            <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow">
              ✓ Verified
            </span>
          )}
        </div>
        {/* Favourite button */}
        <button
          onClick={e => { e.preventDefault(); setFaved(f => !f); }}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow',
            faved ? 'bg-red-500 text-white' : 'bg-white/85 backdrop-blur-sm text-neutral-500 hover:bg-white'
          )}
        >
          <Heart className={cn('w-4 h-4', faved && 'fill-current')} />
        </button>
      </div>

      {/* Body */}
      <Link to={`/car/${car.id}`}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-neutral-900 truncate leading-tight group-hover:text-brand transition-colors">
                {car.make} {car.model}
              </h3>
              <p className="text-neutral-400 text-xs mt-0.5">
                {car.year} · {car.mileage.toLocaleString()} km · {car.transmission}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-neutral-900">{formatCurrency(car.price)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-50">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', fuel.cls)}>
              {fuel.label}
            </span>
            {car.location && (
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <MapPin className="w-3 h-3" />
                {car.location}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
