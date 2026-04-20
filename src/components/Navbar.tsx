import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Heart, MessageSquare, Search, Sparkles, User, LogOut, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const NAV_ITEMS = [
  { name: 'Browse',    icon: Search,       path: '/search' },
  { name: 'AI Match',  icon: Sparkles,     path: '/match' },
  { name: 'Sell',      icon: Plus,         path: '/sell' },
  { name: 'Garage',    icon: Heart,        path: '/garage' },
  { name: 'Messages',  icon: MessageSquare, path: '/messages' },
];

export default function Navbar() {
  const [user] = useAuthState(auth);
  const location = useLocation();

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="glass-dark rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-2xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center transition-all group-hover:rotate-12 shadow-lg shadow-brand/25">
            <Car className="text-white w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block text-neutral-900 group-hover:text-brand transition-colors">
            autowelt24
          </span>
        </Link>

        {/* Nav items */}
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ name, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 text-sm',
                  active
                    ? 'bg-brand/10 text-brand font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:block">{name}</span>
              </Link>
            );
          })}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3 pl-4 border-l border-black/10 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full border border-black/10 p-0.5 overflow-hidden shadow-sm">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt="Avatar"
                  className="w-full h-full rounded-full"
                />
              </div>
              <button
                onClick={() => auth.signOut()}
                className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-black/5 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
