import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Navigation,
  CheckCircle2,
  Tractor,
  Thermometer,
  Zap,
  Droplets,
  Gauge,
  TrendingDown,
  TrendingUp,
  Info,
  User,
  Sparkles,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { mockCars, generatePriceTrend } from '../data/mockCars';
import { formatCurrency, cn } from '../lib/utils';
import { auth, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, serverTimestamp, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const car = mockCars.find(c => c.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [priceTrend] = useState(generatePriceTrend(car?.price || 0));
  const [isContacting, setIsContacting] = useState(false);
  const [showContactConfirm, setShowContactConfirm] = useState(false);

  if (!car) return <div className="p-20 text-center">Car not found.</div>;

  const isOwner = user?.uid === car.sellerId;

  const handleSaveToGarage = async () => {
    if (!user) return navigate('/login');
    setSaved(!saved);
    const garageRef = doc(db, 'users', user.uid, 'garage', car.id);
    await setDoc(garageRef, {
      carId: car.id,
      userId: user.uid,
      addedAt: serverTimestamp(),
      status: 'saved'
    });
  };

  const handleContactSeller = async () => {
    if (!user) return navigate('/login');
    if (isOwner) return;
    setShowContactConfirm(true);
  };

  const confirmContactSeller = async () => {
    setShowContactConfirm(false);
    setIsContacting(true);
    try {
      // Check if chat already exists
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, 
        where('participants', 'array-contains', user.uid),
        where('carId', '==', car.id)
      );
      const querySnapshot = await getDocs(q);
      
      let chatId;
      if (querySnapshot.empty) {
        const newChat = await addDoc(chatsRef, {
          participants: [user.uid, car.sellerId],
          carId: car.id,
          lastMessage: "Interested in your listing",
          updatedAt: serverTimestamp()
        });
        chatId = newChat.id;
      } else {
        chatId = querySnapshot.docs[0].id;
      }
      navigate('/messages', { state: { openChatId: chatId } });
    } catch (error) {
      console.error("Error contacting seller:", error);
    } finally {
      setIsContacting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Visuals & Details */}
        <div className="lg:col-span-8 space-y-12">
          {/* Main Gallery */}
          <section>
            <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-4 relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={car.images[activeImage]}
                  alt="Car"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button className="w-12 h-12 glass-dark flex items-center justify-center rounded-2xl hover:scale-110 active:scale-95 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSaveToGarage}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-2xl transition-all hover:scale-110 active:scale-95",
                    saved ? "bg-red-500 text-white" : "glass-dark text-white"
                  )}
                >
                  <Heart className={cn("w-5 h-5", saved && "fill-current")} />
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4">
              {car.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-32 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 transition-all border-2",
                    activeImage === idx ? "border-brand" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </section>

          {/* Quick Stats Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Gauge} label="Mileage" value={`${car.mileage.toLocaleString()} km`} />
            <StatCard icon={Calendar} label="Year" value={car.year.toString()} />
            <StatCard icon={Droplets} label="Fuel" value={car.fuelType} />
            <StatCard icon={Navigation} label="Transmission" value={car.transmission} />
          </section>

          {/* Description */}
          <section className="glass rounded-3xl p-8 border-neutral-200">
            <h2 className="text-2xl font-display font-bold mb-6">About this vehicle</h2>
            <p className="text-neutral-600 text-lg leading-relaxed mb-10">{car.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Performance Data
                </h4>
                <ul className="space-y-4">
                  <SpecItem label="Power Output" value={`${car.performance.power} HP`} />
                  <SpecItem label="0 - 100 km/h" value={`${car.performance.acceleration}s`} />
                  <SpecItem label="Top Speed" value={`${car.performance.topSpeed} km/h`} />
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Efficiency & Eco
                </h4>
                <ul className="space-y-4">
                  <SpecItem label="Combined Consumption" value={car.efficiency.combined > 0 ? `${car.efficiency.combined} L/100km` : 'Electric'} />
                  <SpecItem label="CO2 Emissions" value={`${car.efficiency.co2} g/km`} />
                  <SpecItem label="Body Style" value={car.bodyType} />
                </ul>
              </div>
            </div>
          </section>

          {/* Price Trends */}
          <section className="glass rounded-3xl p-8 border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold mb-1">Market Trend Analytics</h2>
                <p className="text-neutral-500 font-medium">Historical pricing for {car.make} {car.model}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <TrendingDown className="w-5 h-5" /> 4.2% 
                </div>
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">vs Last Year</p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceTrend}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4d00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff4d00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '12px' }}
                    itemStyle={{ color: '#ff4d00' }}
                    formatter={(value: any) => [formatCurrency(value), 'Price']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#ff4d00" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-neutral-500 mt-4 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" /> Data aggregated from multiple public marketplaces.
            </p>
          </section>
        </div>

        {/* Right Column: Pricing & Actions */}
        <div className="lg:col-span-4 lg:sticky lg:top-36 h-fit space-y-6">
          <div className="glass rounded-3xl p-8 border-brand/20">
            <h1 className="text-3xl font-display font-bold mb-1">{car.make} {car.model}</h1>
            <p className="text-neutral-500 font-medium mb-6">{car.exteriorColor} • {car.year}</p>
            
            <div className="mb-10">
              <div className="text-4xl font-bold mb-1">{formatCurrency(car.price)}</div>
              <p className="text-emerald-400 text-sm font-medium">Fair Market Price • Verified Listing</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleContactSeller}
                disabled={isContacting || isOwner}
                className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
              >
                {isContacting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <MessageSquare className="w-6 h-6" />
                    {isOwner ? "Your Listing" : "Contact Seller"}
                  </>
                )}
              </button>
              <button className="btn-secondary w-full py-4 flex items-center justify-center gap-3 text-lg">
                <Calendar className="w-6 h-6" />
                Schedule Test Drive
              </button>
            </div>

            <div className="mt-10 pt-10 border-t border-white/10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Listed by</p>
                  <p className="font-bold">Private Seller</p>
                </div>
                <div className="ml-auto">
                   <div className="flex items-center gap-1 text-xs text-brand bg-brand/10 px-2 py-1 rounded-full font-bold">
                    <CheckCircle2 className="w-3 h-3" /> PRO
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 bg-brand/5 border-brand/10">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand" />
              Not sure yet?
            </h4>
            <p className="text-sm text-neutral-400 mb-4">
              Use our AI matching engine to see if this car fits your lifestyle.
            </p>
            <Link to="/match" className="text-brand text-sm font-bold flex items-center gap-1 group whitespace-nowrap">
              Run AI Analysis <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showContactConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactConfirm(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass rounded-[2rem] p-8 max-w-sm w-full relative z-10 shadow-2xl border border-white/10"
            >
              <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mx-auto mb-6">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-center mb-2">Contact Seller?</h3>
              <p className="text-center text-neutral-500 mb-8 leading-relaxed">
                This will start a new conversation about this {car.make} {car.model}.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowContactConfirm(false)}
                  className="btn-secondary py-3 px-4 text-sm font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmContactSeller}
                  className="btn-primary py-3 px-4 text-sm font-bold"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="glass p-4 rounded-2xl flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] text-neutral-500 uppercase font-bold leading-tight">{label}</p>
        <p className="font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string, value: string }) {
  return (
    <li className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-neutral-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </li>
  );
}
