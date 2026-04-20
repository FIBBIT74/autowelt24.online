import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Upload, 
  Plus, 
  Sparkles, 
  ArrowLeft, 
  Trash2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import AIGeneratorModal from '../components/AIGeneratorModal';
import { auth, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateListing() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isAIGenOpen, setIsAIGenOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    bodyType: 'SUV',
    exteriorColor: '',
    description: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAIImageGenerated = (imageUrl: string) => {
    setImages(prev => [...prev, imageUrl]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (images.length === 0) return alert("Please add at least one image.");

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'cars'), {
        ...formData,
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        year: Number(formData.year),
        images,
        sellerId: user.uid,
        createdAt: serverTimestamp(),
        isVerified: false,
        performance: { power: 0, acceleration: 0, topSpeed: 0 },
        efficiency: { combined: 0, co2: 0 }
      });
      setSuccess(true);
      setTimeout(() => navigate('/search'), 2000);
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <AlertCircle className="w-16 h-16 text-neutral-400 mb-4" />
        <h2 className="text-2xl font-display font-bold mb-2">Login Required</h2>
        <p className="text-neutral-500 mb-6">You need to be signed in to list your car.</p>
        <button onClick={() => navigate('/login')} className="btn-primary py-3 px-8">Sign In</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors group px-0"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Return
      </button>

      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-neutral-900">List Your Car</h1>
          <p className="text-neutral-500 text-lg">Sell your car faster with autowelt24.online</p>
        </div>
        <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
          <Plus className="w-8 h-8" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Images Section */}
        <section className="glass rounded-[2rem] p-8 border-neutral-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                Listing Visuals
              </h3>
              <p className="text-sm text-neutral-500">Create high-quality AI images for your car</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <motion.div 
                layout
                key={idx} 
                className="aspect-square rounded-2xl overflow-hidden relative group border border-neutral-100"
              >
                <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            <button
              type="button"
              onClick={() => setIsAIGenOpen(true)}
              className="aspect-square rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 hover:border-brand hover:text-brand transition-all cursor-pointer bg-neutral-50/50"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
            </button>
          </div>
        </section>

        {/* Basic Details */}
        <section className="glass rounded-[2rem] p-8 border-neutral-200">
          <h3 className="text-xl font-display font-bold mb-8">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="Make" name="make" value={formData.make} onChange={handleInputChange} placeholder="e.g. BMW" required />
            <InputField label="Model" name="model" value={formData.model} onChange={handleInputChange} placeholder="e.g. M3 Performance" required />
            <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} min={1900} max={2026} required />
            <InputField label="Price (€)" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Enter your price" required />
            <InputField label="Mileage (km)" name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} placeholder="Enter mileage" required />
            <InputField label="Exterior Color" name="exteriorColor" value={formData.exteriorColor} onChange={handleInputChange} placeholder="e.g. Sapphire Black" />
          </div>
        </section>

        {/* Specs */}
        <section className="glass rounded-[2rem] p-8 border-neutral-200">
          <h3 className="text-xl font-display font-bold mb-8">Vehicle Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} onChange={handleInputChange} options={['Gasoline', 'Diesel', 'Electric', 'Hybrid']} />
            <SelectField label="Transmission" name="transmission" value={formData.transmission} onChange={handleInputChange} options={['Automatic', 'Manual']} />
            <SelectField label="Body Type" name="bodyType" value={formData.bodyType} onChange={handleInputChange} options={['Sedan', 'SUV', 'Coupe', 'Convertible', 'Hatchback']} />
          </div>
        </section>

        {/* Description */}
        <section className="glass rounded-[2rem] p-8 border-neutral-200">
          <h3 className="text-xl font-display font-bold mb-6">Description</h3>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your car's condition, features, history..."
            className="w-full bg-black/5 border border-black/10 rounded-2xl p-6 min-h-[200px] outline-none focus:border-brand transition-colors text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </section>

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-5 text-xl font-display font-bold shadow-xl shadow-brand/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? <Plus className="w-6 h-6 animate-spin text-white" /> : "Post Listing Now"}
          </button>
          <p className="text-center text-neutral-400 text-sm">
            By posting, you agree to our Terms of Use and Community Guidelines.
          </p>
        </div>
      </form>

      <AIGeneratorModal 
        isOpen={isAIGenOpen}
        onClose={() => setIsAIGenOpen(false)}
        onSelect={handleAIImageGenerated}
      />

      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-[3rem] p-12 max-w-sm w-full text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Listing Success!</h2>
              <p className="text-neutral-500 mb-8">Your car is now live on the marketplace.</p>
              <button 
                onClick={() => navigate('/search')}
                className="btn-primary w-full py-4 font-bold"
              >
                Go to Marketplace
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-3 block">{label}</label>
      <input
        {...props}
        className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-brand transition-colors text-neutral-900 placeholder:text-neutral-400"
      />
    </div>
  );
}

function SelectField({ label, options, ...props }: any) {
  return (
    <div>
      <label className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-3 block">{label}</label>
      <div className="relative">
        <select
          {...props}
          className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-brand transition-colors text-neutral-900 appearance-none cursor-pointer"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 uppercase text-[10px] font-bold">select</div>
      </div>
    </div>
  );
}
