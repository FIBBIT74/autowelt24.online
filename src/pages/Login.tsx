import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Car, ShieldCheck, Mail, ArrowRight, Chrome } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Upsert user profile
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        updatedAt: serverTimestamp()
      }, { merge: true });

      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[2.5rem] p-10 text-center relative overflow-hidden"
      >
        {/* Abstract background blur */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand/30 rounded-full blur-[40px] -z-10"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] -z-10"></div>

        <div className="w-20 h-20 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand/20">
          <Car className="text-white w-10 h-10" />
        </div>

        <h1 className="text-4xl font-display font-bold tracking-tight mb-4 text-neutral-900">Welcome Back</h1>
        <p className="text-neutral-500 mb-10">Sign in to sync your virtual garage across devices and chat with sellers instantly.</p>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black border border-neutral-200 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-[0.98] shadow-sm"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>
          
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-black/10 flex-1"></div>
            <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">or</span>
            <div className="h-px bg-black/10 flex-1"></div>
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-brand transition-colors" />
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full bg-black/5 border border-black/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand transition-all text-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          <button className="w-full group btn-secondary py-4 flex items-center justify-center gap-2">
            Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-black/5 text-xs text-neutral-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Secure, encrypted authentication
        </div>
      </motion.div>
    </div>
  );
}
