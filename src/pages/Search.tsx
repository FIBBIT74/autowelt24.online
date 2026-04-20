import React, { useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { mockCars } from '../data/mockCars';
import CarCard from '../components/CarCard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [showFilters, setShowFilters] = useState(false);

  const makes = ['All', ...new Set(mockCars.map(c => c.make))];

  const filteredCars = mockCars.filter(car => {
    const matchesQuery = car.model.toLowerCase().includes(query.toLowerCase()) || 
                       car.make.toLowerCase().includes(query.toLowerCase());
    const matchesMake = selectedMake === 'All' || car.make === selectedMake;
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    return matchesQuery && matchesMake && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Main Search */}
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-8">Search Inventory</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-brand transition-colors" />
            <input 
              type="text"
              placeholder="Search by make, model, or keywords..."
              className="w-full bg-white border border-neutral-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand transition-all text-lg shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "btn-secondary flex items-center justify-center gap-2 py-4 px-8 whitespace-nowrap",
              showFilters && "bg-white/20 border-white/30"
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Advanced Filters
          </button>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-3xl p-8 mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Manufacturer</label>
                  <div className="grid grid-cols-2 gap-2">
                    {makes.map(make => (
                      <button
                        key={make}
                        onClick={() => setSelectedMake(make)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm border transition-all text-center",
                          selectedMake === make 
                            ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" 
                            : "bg-black/5 border-black/5 text-neutral-600 hover:border-black/20"
                        )}
                      >
                        {make}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Price Range (€)</label>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="200000" 
                      step="5000"
                      className="w-full accent-brand bg-black/10 h-2 rounded-lg appearance-none cursor-pointer"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    />
                    <div className="flex justify-between text-xs font-bold text-neutral-500 font-mono">
                      <span>0€</span>
                      <span className="text-brand font-bold">{priceRange[1].toLocaleString()}€</span>
                      <span>200,000€</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Sort By</label>
                  <div className="relative group/sort">
                    <button className="w-full bg-black/5 border border-black/5 rounded-xl p-3 flex items-center justify-between text-lg font-medium outline-none text-neutral-900 shadow-sm">
                      Relevance
                      <ChevronDown className="w-5 h-5 text-neutral-500" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="mb-8 flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold">{filteredCars.length}</span>
        <span className="text-neutral-500 font-medium tracking-tight">results matching your criteria</span>
      </div>

      {/* Results Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass rounded-3xl">
          <p className="text-xl text-neutral-400">No cars found matching your search. Try adjusting the filters.</p>
        </div>
      )}
    </div>
  );
}
