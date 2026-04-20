import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, TrendingUp, Calendar, Trash2, ArrowRight, Share2 } from 'lucide-react';
import { collection, onSnapshot, doc, deleteDoc, query } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { mockCars } from '../data/mockCars';
import CarCard from '../components/CarCard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Garage() {
  const [user] = useAuthState(auth);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'garage'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const removeItem = async (carId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'garage', carId));
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <div className="glass rounded-[2.5rem] p-16">
          <Heart className="w-16 h-16 text-neutral-700 mx-auto mb-8" />
          <h2 className="text-3xl font-display font-bold mb-4">Access Your Virtual Garage</h2>
          <p className="text-neutral-400 mb-10 max-w-sm mx-auto">Save cars, compare metrics, and schedule test drives in one centralized dashboard.</p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            Sign In Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Virtual Garage</h1>
          <p className="text-neutral-500 font-medium tracking-tight text-lg">Managing {items.length} saved vehicles</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-2 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share Garage
          </button>
          <Link to="/search" className="btn-primary py-2 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add More
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center"><div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div></div>
      ) : items.length === 0 ? (
        <div className="glass p-20 rounded-[2.5rem] text-center border-neutral-200">
          <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8 text-neutral-400">
            <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-neutral-900">Your garage is currently empty</h3>
          <p className="text-neutral-500 mb-10 text-lg">Start browsing our marketplace and save the cars you love.</p>
          <Link to="/search" className="btn-primary px-10">Start Exploring</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {items.map(item => {
                const car = mockCars.find(c => c.id === item.carId);
                if (!car) return null;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass rounded-3xl p-6 flex flex-col md:flex-row gap-6 group relative border-neutral-200 hover:shadow-xl transition-all"
                  >
                    <div className="w-full md:w-48 aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
                      <img src={car.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Link to={`/car/${car.id}`} className="text-xl font-display font-bold hover:text-brand transition-colors block decoration-brand underline-offset-4 hover:underline">
                            {car.make} {car.model}
                          </Link>
                          <p className="text-sm text-neutral-400">{car.year} • {car.mileage.toLocaleString()} km • {car.transmission}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(car.id)}
                          className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-6">
                        <div className="flex items-center gap-2 text-xs bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          Good Value
                        </div>
                        <div className="flex items-center gap-2 text-xs bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          Added recently
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-[2rem] p-8 border-brand/20">
              <h3 className="text-xl font-display font-bold mb-6">Garage Analytics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Total Market Value</span>
                    <span className="font-bold">€345,000</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full">
                    <div className="bg-brand w-3/4 h-full rounded-full"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Items</p>
                    <p className="text-2xl font-display font-bold">{items.length}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Avg Year</p>
                    <p className="text-2xl font-display font-bold">2023</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-8 bg-blue-500/5 border-blue-500/10">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" /> Test Drives
              </h3>
              <p className="text-sm text-neutral-400">You have no test drives scheduled at the moment.</p>
              <button className="mt-4 text-blue-400 text-sm font-bold flex items-center gap-1 group">
                Browse Availability <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
