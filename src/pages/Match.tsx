import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Car as CarIcon, DollarSign, Leaf, Zap, ChevronRight, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { mockCars } from '../data/mockCars';
import CarCard from '../components/CarCard';
import { cn } from '../lib/utils';

export default function Match() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    budget: '',
    habits: '',
    eco: 'neutral'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const handleMatch = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `You are an expert car concierge. Based on these user preferences:
Budget: ${preferences.budget}
Driving habits: ${preferences.habits}
Eco preference: ${preferences.eco}

Here is the current car inventory:
${JSON.stringify(mockCars.map(c => ({ id: c.id, make: c.make, model: c.model, body: c.bodyType, price: c.price, fuel: c.fuelType })))}

Analyze which of these cars represent the TOP 2 best matches. Return a JSON array of objects with "carId" and a short "reason" (max 15 words) for each.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                carId: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          }
        }
      });

      const results = JSON.parse(response.text || '[]');
      const matchedCars = results.map((res: any) => ({
        ...mockCars.find(c => c.id === res.carId),
        aiReason: res.reason
      })).filter((c: any) => c.id);

      setRecommendations(matchedCars);
      setStep(4);
    } catch (error) {
      console.error(error);
      // Fallback for demo if AI fails
      setRecommendations([mockCars[0], mockCars[1]]);
      setStep(4);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-12 pb-20">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-brand" />
        </div>
        <h1 className="text-5xl font-display font-bold tracking-tight mb-4">Neural Car Matcher</h1>
        <p className="text-neutral-400 text-lg">Our AI analyzes thousands of data points to find your soul machine.</p>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-8 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center w-full max-w-md"
            >
              <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8">
                <DollarSign className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">What's your maximum budget?</h2>
              <input 
                type="number" 
                placeholder="e.g. 75000"
                className="w-full bg-black/5 border border-black/10 rounded-2xl p-4 text-center text-2xl font-bold mb-8 outline-none focus:border-brand transition-colors text-neutral-900 placeholder:text-neutral-400"
                value={preferences.budget}
                onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
              />
              <button 
                onClick={() => setStep(2)}
                disabled={!preferences.budget}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center w-full max-w-md"
            >
              <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8">
                <CarIcon className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">Describe your driving habits</h2>
              <textarea 
                placeholder="e.g. Mainly city commute, occasionally mountain trips with family, looking for speed but safe."
                className="w-full bg-black/5 border border-black/10 rounded-2xl p-4 h-32 text-lg mb-8 outline-none focus:border-brand transition-colors resize-none text-neutral-900 placeholder:text-neutral-400"
                value={preferences.habits}
                onChange={(e) => setPreferences({ ...preferences, habits: e.target.value })}
              />
              <button 
                onClick={() => setStep(3)}
                disabled={!preferences.habits}
                className="btn-primary w-full py-4 text-lg"
              >
                Next
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center w-full max-w-md"
            >
              <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8">
                <Leaf className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-8">Ecological preferences?</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['electric-only', 'neutral', 'low-emissions', 'high-performance'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setPreferences({ ...preferences, eco: opt })}
                    className={cn(
                      "p-4 rounded-2xl border transition-all text-sm font-bold uppercase tracking-wider shadow-sm",
                      preferences.eco === opt ? "bg-brand border-brand text-white shadow-brand/20" : "bg-black/5 border-black/5 text-neutral-500 hover:border-black/20"
                    )}
                  >
                    {opt.replace('-', ' ')}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleMatch}
                disabled={isAnalyzing}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing Market...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Get My Match
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <h2 className="text-2xl font-display font-bold text-center mb-10">Matches found by Neural Engine</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recommendations.map(car => (
                  <div key={car.id} className="space-y-4">
                    <div className="bg-brand/10 border border-brand/20 p-4 rounded-2xl flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-brand shrink-0 mt-1" />
                      <p className="text-sm italic text-neutral-200">"{car.aiReason}"</p>
                    </div>
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <button 
                  onClick={() => setStep(1)}
                  className="text-neutral-400 hover:text-white font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <Brain className="w-4 h-4" /> Reset Preferences
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 text-neutral-500">
          <Zap className="w-5 h-5" />
          <span className="text-sm">Real-time market analysis</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500">
          <Brain className="w-5 h-5" />
          <span className="text-sm">Deep learning car metrics</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm">Personalized lifestyle audit</span>
        </div>
      </div>
    </div>
  );
}
