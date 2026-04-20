/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { auth } from './lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const CarDetail = lazy(() => import('./pages/CarDetail'));
const Match = lazy(() => import('./pages/Match'));
const Garage = lazy(() => import('./pages/Garage'));
const CreateListing = lazy(() => import('./pages/CreateListing'));
const Messages = lazy(() => import('./pages/Messages'));
const Login = lazy(() => import('./pages/Login'));

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-neutral-950">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-brand selection:text-white">
        <Navbar />
        <main className="pt-28 pb-12">
          <Suspense fallback={
            <div className="h-[60vh] flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/car/:id" element={<CarDetail />} />
              <Route path="/match" element={<Match />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/sell" element={<CreateListing />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
