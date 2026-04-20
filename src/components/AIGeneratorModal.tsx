import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Loader2, Download, Check, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}

export default function AIGeneratorModal({ isOpen, onClose, onSelect }: AIGeneratorModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64EncodeString}`;
          setGeneratedImage(imageUrl);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("No image was generated. Please try a different prompt.");
      }
    } catch (err: any) {
      console.error("Image generation error:", err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = () => {
    if (generatedImage) {
      onSelect(generatedImage);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass rounded-[2rem] p-8 max-w-2xl w-full relative z-10 shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold">AI Image Generator</h3>
                  <p className="text-sm text-neutral-500">Visualize your listing with perfection</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-neutral-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-3 block">
                  Describe what you want to see
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A sports car driving on a scenic mountain road during sunset, cinematic lighting, 8k..."
                    className="w-full bg-black/5 border border-black/10 rounded-2xl p-4 min-h-[120px] outline-none focus:border-brand transition-colors text-neutral-900 placeholder:text-neutral-400"
                  />
                  <button
                    onClick={generateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="absolute bottom-4 right-4 btn-primary py-2 px-6 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-5 h-5" />
                    )}
                    Generate
                  </button>
                </div>
              </div>

              <div className="aspect-video bg-black/5 rounded-3xl overflow-hidden relative border border-black/5 flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-brand" />
                    <p className="text-neutral-500 animate-pulse font-medium">Creating your masterpiece...</p>
                  </div>
                ) : generatedImage ? (
                  <img 
                    src={generatedImage} 
                    className="w-full h-full object-cover" 
                    alt="Generated" 
                  />
                ) : error ? (
                  <div className="p-8 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <ImageIcon className="w-16 h-16" />
                    <p className="font-display font-medium text-lg">Generated image will appear here</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="btn-secondary flex-1 py-4 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelect}
                  disabled={!generatedImage}
                  className="btn-primary flex-1 py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  Use this Image
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
}
