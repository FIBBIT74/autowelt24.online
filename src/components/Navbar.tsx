import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Heart, MessageSquare, Search, Sparkles, User, LogOut, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const location = useLocation();

  const navItems = [
    { name: 'Browse', icon: Search, path: '/search' },
    { name: 'AI Match', icon: Sparkles, path: '/match' },
    { name: 'Sell', icon: Plus, path: '/sell' },
    { name: 'Garage', icon: Heart, path: '/garage' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="glass-dark rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
          <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center transition-all group-hover:rotate-12 shadow-lg shadow-brand/20">
            <Car className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block text-neutral-900 group-hover:text-brand transition-colors">autowelt24.online</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-brand/10 text-brand font-semibold" 
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:block">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-black/10">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-black/10 p-0.5 overflow-hidden shadow-sm">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full"
                />
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-black/5 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-5 text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
