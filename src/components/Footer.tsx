import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/30">
                <Car className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-bold text-lg">autowelt24</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Germany's premium automotive marketplace. Connecting buyers and sellers since 2024.
            </p>
            <div className="space-y-2 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand flex-shrink-0" />
                <span>Maximilianstraße 12, München</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                <span>contact@autowelt24.online</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-neutral-200 uppercase text-xs tracking-widest">Browse</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {[
                { label: 'New Cars', to: '/search' },
                { label: 'Used Cars', to: '/search' },
                { label: 'Electric Vehicles', to: '/search' },
                { label: 'Luxury Cars', to: '/search' },
                { label: 'SUVs', to: '/search' },
                { label: 'Sports Cars', to: '/search' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-neutral-200 uppercase text-xs tracking-widest">Services</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {[
                { label: 'Sell Your Car', to: '/sell' },
                { label: 'AI Car Matcher', to: '/match' },
                { label: 'Price Analytics', to: '/search' },
                { label: 'My Garage', to: '/garage' },
                { label: 'Messages', to: '/messages' },
                { label: 'Dealer Login', to: '/login' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-neutral-200 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {[
                'About Us',
                'Careers',
                'Press & Media',
                'Privacy Policy',
                'Terms of Service',
                'Impressum',
              ].map(l => (
                <li key={l}>
                  <a href="#" className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © 2024 autowelt24.online · All rights reserved
          </p>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <span>🇩🇪 Deutschland</span>
            <span>€ Euro</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
