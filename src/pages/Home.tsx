import React from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, TrendingUp, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCars } from '../data/mockCars';
import CarCard from '../components/CarCard';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative py-20 mb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] aspect-square bg-brand/10 rounded-full blur-[120px] -z-10 opacity-50"></div>
        
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-brand/20 text-brand font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Car Search is Here</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[0.9] text-neutral-900"
          >
            Find your <span className="text-brand">dream machine</span> on autowelt.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            The premium German car marketplace. Advanced analytics, AI recommendations, and verified listings at autowelt24.online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/search" className="btn-primary flex items-center gap-2 text-lg">
              <Search className="w-5 h-5" />
              Explore Listings
            </Link>
            <Link to="/match" className="btn-secondary flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5" />
              Try AI Matching
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats / Value Props */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        <div className="glass p-8 rounded-3xl group hover:shadow-xl transition-all">
          <TrendingUp className="w-8 h-8 text-brand mb-4" />
          <h3 className="text-xl font-bold mb-2">Price Trends</h3>
          <p className="text-neutral-600">Track used market data in real-time. Buy at the optimal moment based on historical trends.</p>
        </div>
        <div className="glass p-8 rounded-3xl group hover:shadow-xl transition-all">
          <ShieldCheck className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Verified Only</h3>
          <p className="text-neutral-600">Every car on autowelt undergoes a multi-point verification process for your peace of mind.</p>
        </div>
        <div className="glass p-8 rounded-3xl group hover:shadow-xl transition-all">
          <Sparkles className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">AI Matcher</h3>
          <p className="text-neutral-600">Our neural engine recommends cars based on your lifestyle, budget, and ecological footprint.</p>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="mb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-display font-bold tracking-tight mb-2">Editor's Choice</h2>
            <p className="text-neutral-600 text-lg">Curated selections of the highest quality listings this week.</p>
          </div>
          <Link to="/search" className="flex items-center gap-2 text-brand font-semibold hover:gap-3 transition-all">
            View All <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>
    </div>
  );
}
