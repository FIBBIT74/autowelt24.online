import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { mockCars } from '../data/mockCars';
import CarCard from '../components/CarCard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const MAKES = ['All', ...Array.from(new Set(mockCars.map(c => c.make))).sort()];
const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const BODY_TYPES = ['Sedan', 'Coupe', 'SUV', 'Hatchback', 'Wagon', 'Convertible'];
const SORT_OPTIONS = [
  { value: 'relevance',  label: 'Relevance' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc',  label: 'Year: Newest First' },
  { value: 'mileage-asc',label: 'Mileage: Lowest First' },
];

export default function Search() {
  const [searchParams] = useSearchParams();

  const [query, setQuery]               = useState(searchParams.get('q') || '');
  const [selectedMake, setSelectedMake] = useState('All');
  const [maxPrice, setMaxPrice]         = useState(200000);
  const [yearFrom, setYearFrom]         = useState('');
  const [yearTo, setYearTo]             = useState('');
  const [fuels, setFuels]               = useState<string[]>([]);
  const [bodies, setBodies]             = useState<string[]>(
    searchParams.get('bodyType') ? [searchParams.get('bodyType')!] : []
  );
  const [sortBy, setSortBy]             = useState('relevance');
  const [showFilters, setShowFilters]   = useState(false);

  // Apply URL bodyType param on load
  useEffect(() => {
    const bt = searchParams.get('bodyType');
    if (bt) setBodies([bt]);
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, []);

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const activeFiltersCount = [
    selectedMake !== 'All',
    maxPrice < 200000,
    yearFrom !== '',
    yearTo !== '',
    fuels.length > 0,
    bodies.length > 0,
  ].filter(Boolean).length;

  const clearAll = () => {
    setSelectedMake('All');
    setMaxPrice(200000);
    setYearFrom('');
    setYearTo('');
    setFuels([]);
    setBodies([]);
    setSortBy('relevance');
  };

  const filtered = mockCars
    .filter(car => {
      const q = query.toLowerCase();
      const matchQuery   = !q || car.make.toLowerCase().includes(q) || car.model.toLowerCase().includes(q);
      const matchMake    = selectedMake === 'All' || car.make === selectedMake;
      const matchPrice   = car.price <= maxPrice;
      const matchYearFrom = !yearFrom || car.year >= parseInt(yearFrom);
      const matchYearTo  = !yearTo || car.year <= parseInt(yearTo);
      const matchFuel    = fuels.length === 0 || fuels.includes(car.fuelType);
      const matchBody    = bodies.length === 0 || bodies.includes(car.bodyType);
      return matchQuery && matchMake && matchPrice && matchYearFrom && matchYearTo && matchFuel && matchBody;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':   return a.price - b.price;
        case 'price-desc':  return b.price - a.price;
        case 'year-desc':   return b.year - a.year;
        case 'mileage-asc': return a.mileage - b.mileage;
        default:            return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-6">Search Inventory</h1>

        {/* Search + filter toggle */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-brand transition-colors" />
            <input
              type="text"
              placeholder="Search by make, model, or keyword…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand transition-all shadow-sm text-base"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={cn(
              'flex items-center gap-2 px-5 py-4 rounded-2xl font-semibold text-sm border transition-all',
              showFilters
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-brand text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-neutral-100 rounded-2xl p-6 mt-3 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Make */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Brand</label>
                    <div className="flex flex-wrap gap-2">
                      {MAKES.map(make => (
                        <button
                          key={make}
                          onClick={() => setSelectedMake(make)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                            selectedMake === make
                              ? 'bg-neutral-900 border-neutral-900 text-white'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                          )}
                        >
                          {make}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fuel type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Fuel Type</label>
                    <div className="flex flex-wrap gap-2">
                      {FUEL_TYPES.map(ft => (
                        <button
                          key={ft}
                          onClick={() => toggleArr(fuels, setFuels, ft)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                            fuels.includes(ft)
                              ? 'bg-brand border-brand text-white'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                          )}
                        >
                          {ft}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Body Type</label>
                    <div className="flex flex-wrap gap-2">
                      {BODY_TYPES.map(bt => (
                        <button
                          key={bt}
                          onClick={() => toggleArr(bodies, setBodies, bt)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                            bodies.includes(bt)
                              ? 'bg-brand border-brand text-white'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                          )}
                        >
                          {bt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                      Max Price: <span className="text-brand">€{maxPrice.toLocaleString()}</span>
                    </label>
                    <input
                      type="range"
                      min="10000"
                      max="200000"
                      step="5000"
                      value={maxPrice}
                      onChange={e => setMaxPrice(parseInt(e.target.value))}
                      className="w-full accent-brand h-2 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>€10,000</span>
                      <span>€200,000</span>
                    </div>
                  </div>

                  {/* Year range */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Year Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="From"
                        min="2000"
                        max="2025"
                        value={yearFrom}
                        onChange={e => setYearFrom(e.target.value)}
                        className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand transition-colors"
                      />
                      <input
                        type="number"
                        placeholder="To"
                        min="2000"
                        max="2025"
                        value={yearTo}
                        onChange={e => setYearTo(e.target.value)}
                        className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand transition-colors"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand transition-colors cursor-pointer"
                    >
                      {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="flex justify-end border-t border-neutral-100 pt-4">
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      <X className="w-4 h-4" /> Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active filter chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedMake !== 'All' && (
            <Chip label={selectedMake} onRemove={() => setSelectedMake('All')} />
          )}
          {maxPrice < 200000 && (
            <Chip label={`Max €${maxPrice.toLocaleString()}`} onRemove={() => setMaxPrice(200000)} />
          )}
          {yearFrom && <Chip label={`From ${yearFrom}`} onRemove={() => setYearFrom('')} />}
          {yearTo && <Chip label={`To ${yearTo}`} onRemove={() => setYearTo('')} />}
          {fuels.map(f => <Chip key={f} label={f} onRemove={() => toggleArr(fuels, setFuels, f)} />)}
          {bodies.map(b => <Chip key={b} label={b} onRemove={() => toggleArr(bodies, setBodies, b)} />)}
        </div>
      )}

      {/* Results count */}
      <div className="mb-6 flex items-baseline gap-2">
        <span className="text-2xl font-display font-bold">{filtered.length}</span>
        <span className="text-neutral-500 font-medium">
          result{filtered.length !== 1 ? 's' : ''} found
        </span>
        {sortBy !== 'relevance' && (
          <span className="text-xs text-neutral-400 ml-auto">
            Sorted by {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
          </span>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-neutral-50 rounded-2xl border border-neutral-100">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-semibold text-neutral-700 mb-2">No results found</p>
          <p className="text-neutral-400 text-sm">Try adjusting your filters or search term.</p>
          <button onClick={clearAll} className="btn-primary mt-6 py-2.5 px-6 text-sm">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-neutral-300 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
