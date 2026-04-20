import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Info } from 'lucide-react';
import { Car } from '../data/mockCars';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';

interface CarCardProps {
  car: Car;
  className?: string;
}

export default function CarCard({ car, className }: CarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn("interactive-glass rounded-2xl overflow-hidden group", className)}
    >
      <Link to={`/car/${car.id}`}>
        <div className="aspect-[16/10] overflow-hidden relative">
          <img
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {car.isVerified && (
              <div className="bg-blue-500/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </div>
            )}
            {car.fuelType === 'Electric' && (
              <div className="bg-emerald-500/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1 backdrop-blur-md">
                <Zap className="w-3 h-3" />
                Electric
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-sm font-medium text-white flex items-center gap-1">
              <Info className="w-4 h-4" /> View Details
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-display font-bold text-lg leading-tight group-hover:text-brand transition-colors">
                {car.make} {car.model}
              </h3>
              <p className="text-neutral-500 font-medium text-sm">{car.year} • {car.mileage.toLocaleString()} km</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-neutral-900">{formatCurrency(car.price)}</div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Listing Price</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-[10px] text-neutral-500 uppercase font-bold mb-0.5">Power</p>
              <p className="text-xs font-semibold">{car.performance.power} HP</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-neutral-500 uppercase font-bold mb-0.5">0-100</p>
              <p className="text-xs font-semibold">{car.performance.acceleration}s</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-neutral-500 uppercase font-bold mb-0.5">Top Speed</p>
              <p className="text-xs font-semibold">{car.performance.topSpeed} km/h</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
