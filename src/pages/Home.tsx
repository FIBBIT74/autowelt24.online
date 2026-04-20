import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search, ChevronRight, ArrowRight,
  ShieldCheck, Star, Trophy, MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCars } from '../data/mockCars';
import CarCard from '../components/CarCard';
import HeroCarVisual from '../components/HeroCarVisual';
import { cn } from '../lib/utils';

const BRANDS = ['All', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Tesla'];

const CATEGORIES = [
  {
    label: 'Electric',
    icon: '⚡',
    desc: `${mockCars.filter(c => c.fuelType === 'Electric').length} listings`,
    query: 'Electric',
    gradient: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-600',
  },
  {
    label: 'SUV',
    icon: '🚙',
    desc: `${mockCars.filter(c => c.bodyType === 'SUV').length} listings`,
    query: 'SUV',
    gradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    accent: 'text-blue-600',
  },
  {
    label: 'Sports',
    icon: '🏎',
    desc: `${mockCars.filter(c => c.bodyType === 'Coupe').length} listings`,
    query: 'Coupe',
    gradient: 'from-orange-50 to-red-50',
    border: 'border-orange-200',
    accent: 'text-brand',
  },
  {
    label: 'Luxury',
    icon: '👑',
    desc: `${mockCars.filter(c => c.price >= 100000).length} listings`,
    query: 'luxury',
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
    accent: 'text-purple-600',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Browse & Filter',
    desc: 'Search thousands of verified listings. Filter by make, price, location, fuel type, and more.',
    Icon: Search,
  },
  {
    step: '02',
    title: 'Connect with Seller',
    desc: 'Chat directly with verified dealers and private sellers. Schedule a test drive in seconds.',
    Icon: MessageSquare,
  },
  {
    step: '03',
    title: 'Drive Away Happy',
    desc: 'Complete your purchase with confidence. Every listing is manually verified by our team.',
    Icon: Trophy,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState('All');

  const featured = mockCars
    .filter(car => activeBrand === 'All' || car.make === activeBrand)
    .slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      {/* ── DARK HERO ──────────────────────────────────── */}
      <section className="-mt-28 relative overflow-hidden">
        <div className="hero-dark min-h-[88vh] flex items-center pt-36 pb-24 relative">

          {/* ── 3D perspective floor grid ── */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none overflow-hidden"
            style={{ perspective: '600px' }}
          >
            <div
              className="hero-grid-3d w-full h-full"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,77,0,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.08) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                transform: 'rotateX(55deg)',
                transformOrigin: 'top center',
              }}
            />
            {/* Fade out at top of grid */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent"
              style={{ background: 'linear-gradient(to bottom, rgba(13,27,46,1) 0%, transparent 40%)' }}
            />
          </div>

          {/* ── Ambient glows ── */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-[100px] pointer-events-none" />

          {/* ── Content: 2-column ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left: text */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-semibold mb-8">
                  <span>🇩🇪</span>
                  <span>Deutschlands Premium Automarkt</span>
                </div>

                {/* Headline */}
                <h1 className="text-6xl sm:text-7xl md:text-[82px] font-display font-bold text-white leading-[0.88] tracking-tighter mb-6">
                  Find Your<br />
                  <span className="text-brand">Perfect Car.</span>
                </h1>

                <p className="text-lg text-neutral-400 leading-relaxed mb-10 max-w-lg">
                  Over 50,000 verified listings from premium dealers and private sellers across Germany.
                </p>

                {/* Hero Search */}
                <form onSubmit={handleHeroSearch} className="max-w-xl">
                  <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl shadow-black/50">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Make, model, or keyword…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 text-neutral-900 bg-transparent outline-none text-base placeholder:text-neutral-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary py-3.5 px-7 flex items-center justify-center gap-2 whitespace-nowrap rounded-xl"
                    >
                      Search <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center gap-5 mt-8">
                  {[
                    { Icon: ShieldCheck, text: '50,000+ Verified' },
                    { Icon: Star,        text: '4.9 / 5 Rating' },
                    { Icon: Trophy,      text: '#1 in Germany' },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-neutral-400 text-sm">
                      <Icon className="w-4 h-4 text-brand" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: 3D car drawing */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block relative h-72 xl:h-80"
              >
                <HeroCarVisual />
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Stats bar */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="-mt-8 relative z-10 mb-16"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { value: '50K+', label: 'Active Listings' },
              { value: '12K+', label: 'Verified Sellers' },
              { value: '€2.4B', label: 'Cars Sold' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  'px-6 py-2 text-center',
                  i > 0 && 'border-l border-neutral-100'
                )}
              >
                <div className="text-3xl font-display font-bold text-brand">{s.value}</div>
                <div className="text-sm text-neutral-500 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Brand filter */}
        <section className="mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {BRANDS.map(brand => (
              <button
                key={brand}
                onClick={() => setActiveBrand(brand)}
                className={cn(
                  'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap',
                  activeBrand === brand
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                {brand}
              </button>
            ))}
          </div>
        </section>

        {/* Featured listings */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold tracking-tight">Featured Listings</h2>
              <p className="text-neutral-500 mt-1 text-sm">Handpicked by our editorial team</p>
            </div>
            <Link
              to="/search"
              className="flex items-center gap-1.5 text-brand font-semibold text-sm hover:gap-2.5 transition-all"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Category cards */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold tracking-tight">Browse by Type</h2>
            <p className="text-neutral-500 mt-1 text-sm">Find the car that fits your lifestyle</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.label}
                to={`/search?bodyType=${cat.query}`}
                className={cn(
                  'group p-6 rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                  cat.gradient,
                  cat.border
                )}
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <div className="font-display font-bold text-xl text-neutral-900">{cat.label}</div>
                <div className="text-sm text-neutral-500 mt-1">{cat.desc}</div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-semibold mt-4 group-hover:gap-2 transition-all',
                    cat.accent
                  )}
                >
                  Explore <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20 bg-neutral-50 rounded-3xl p-8 md:p-12 border border-neutral-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold">How autowelt24 Works</h2>
            <p className="text-neutral-500 mt-2 text-sm">Buy or sell your car in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {HOW_IT_WORKS.map(({ step, title, desc, Icon }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-brand" />
                </div>
                <div className="text-xs text-brand font-bold uppercase tracking-widest mb-2">{step}</div>
                <h3 className="font-display font-bold text-xl mb-2 text-neutral-900">{title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="mb-20">
          <div className="hero-dark rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                Ready to sell your car?
              </h2>
              <p className="text-neutral-400 text-base">
                List for free and reach 500,000+ buyers across Germany.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/sell" className="btn-primary py-4 px-8 text-base whitespace-nowrap">
                List Your Car
              </Link>
              <Link
                to="/search"
                className="btn-secondary py-4 px-8 text-base whitespace-nowrap"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
