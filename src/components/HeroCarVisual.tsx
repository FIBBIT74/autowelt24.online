import React from 'react';

export default function HeroCarVisual() {
  return (
    <div className="relative w-full h-full select-none pointer-events-none">

      {/* ── Floating 3D geometric shapes ──────────────── */}
      <div
        className="absolute top-6 right-10 w-10 h-10 border border-brand/40"
        style={{ animation: 'floatShape 6s ease-in-out infinite', transformStyle: 'preserve-3d' }}
      />
      <div
        className="absolute top-16 right-36 w-5 h-5 border border-white/20"
        style={{ animation: 'floatShapeAlt 4s ease-in-out 1s infinite', transformStyle: 'preserve-3d' }}
      />
      <div
        className="absolute bottom-20 right-4 w-7 h-7 border border-brand/25"
        style={{ animation: 'floatShape 5s ease-in-out 2s infinite', transformStyle: 'preserve-3d' }}
      />
      <div
        className="absolute top-1/2 left-0 w-4 h-4 border border-white/15"
        style={{ animation: 'floatShapeAlt 7s ease-in-out 0.5s infinite', transformStyle: 'preserve-3d' }}
      />

      {/* ── Connecting dot lines ───────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 440 300"
        fill="none"
      >
        <line x1="380" y1="30" x2="320" y2="90" stroke="rgba(255,77,0,0.12)" strokeWidth="0.8" strokeDasharray="4 4" />
        <line x1="400" y1="220" x2="340" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="4 4" />
        <line x1="20"  y1="150" x2="80" y2="130" stroke="rgba(255,77,0,0.10)" strokeWidth="0.8" strokeDasharray="4 4" />
        <circle cx="380" cy="30"  r="2.5" fill="rgba(255,77,0,0.5)" />
        <circle cx="400" cy="220" r="2"   fill="rgba(255,255,255,0.3)" />
        <circle cx="20"  cy="150" r="2"   fill="rgba(255,77,0,0.3)" />
      </svg>

      {/* ── Car SVG drawing ────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <svg
          viewBox="0 0 520 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-lg drop-shadow-[0_0_18px_rgba(255,77,0,0.25)]"
        >
          {/* ── Body outline ── */}
          <path
            d="M 38 155
               L 38 172
               L 68 175
               L 190 175
               L 210 175
               L 318 175
               L 338 175
               L 458 175
               L 480 172
               L 482 148
               L 462 118
               L 374 108
               L 368 66
               C 300 56 228 56 168 66
               L 148 90
               L 118 118
               L 70 148
               Z"
            stroke="#ff4d00"
            strokeWidth="1.6"
            strokeLinejoin="round"
            className="draw-1"
          />

          {/* ── Windshield / window ── */}
          <path
            d="M 173 148
               L 186 110
               L 215 82
               L 270 72
               L 335 74
               L 368 96
               L 370 130
               L 370 148
               Z"
            stroke="rgba(130,200,255,0.65)"
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="draw-2"
          />

          {/* ── Window centre divider ── */}
          <line
            x1="270" y1="73"
            x2="270" y2="148"
            stroke="rgba(130,200,255,0.3)"
            strokeWidth="0.8"
            className="draw-3"
          />

          {/* ── Door panel line ── */}
          <path
            d="M 160 148 L 158 170 M 440 148 L 442 170"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.8"
            className="draw-3"
          />

          {/* ── Side mirror ── */}
          <path
            d="M 148 112 L 130 100 L 134 112"
            stroke="rgba(255,77,0,0.55)"
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="draw-4"
          />

          {/* ── Front wheel outer ── */}
          <circle
            cx="142" cy="175" r="42"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.6"
            className="draw-5"
          />
          {/* ── Front wheel inner rim ── */}
          <circle
            cx="142" cy="175" r="24"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            className="draw-6"
          />
          {/* ── Front wheel hub ── */}
          <circle
            cx="142" cy="175" r="7"
            stroke="rgba(255,77,0,0.7)"
            strokeWidth="1.8"
            className="draw-7"
          />

          {/* ── Rear wheel outer ── */}
          <circle
            cx="382" cy="175" r="42"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.6"
            className="draw-5"
          />
          {/* ── Rear wheel inner rim ── */}
          <circle
            cx="382" cy="175" r="24"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            className="draw-6"
          />
          {/* ── Rear wheel hub ── */}
          <circle
            cx="382" cy="175" r="7"
            stroke="rgba(255,77,0,0.7)"
            strokeWidth="1.8"
            className="draw-7"
          />

          {/* ── Headlight ── */}
          <path
            d="M 40 158 L 62 154 L 66 164 L 42 166 Z"
            stroke="#ff4d00"
            strokeWidth="1.4"
            strokeLinejoin="round"
            className="draw-8"
          />
          {/* ── DRL line ── */}
          <line
            x1="40" y1="154"
            x2="66" y2="150"
            stroke="rgba(255,200,100,0.5)"
            strokeWidth="1"
            className="draw-9"
          />

          {/* ── Tail light ── */}
          <path
            d="M 458 155 L 480 152 L 480 162 L 458 164 Z"
            stroke="#ff4d00"
            strokeWidth="1.4"
            strokeLinejoin="round"
            className="draw-8"
          />

          {/* ── Ground shadow line ── */}
          <ellipse
            cx="260" cy="196"
            rx="180" ry="5"
            stroke="rgba(255,77,0,0.15)"
            strokeWidth="0.8"
            className="draw-9"
          />
        </svg>
      </div>

      {/* ── Floating stat badges ─────────────────────── */}
      <div
        className="hero-badge-float absolute top-4 right-8 flex flex-col gap-0.5 bg-white/6 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5"
        style={{ animationDelay: '2.7s' }}
      >
        <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Power</span>
        <span className="text-brand font-bold text-base leading-none">450 HP</span>
      </div>

      <div
        className="hero-badge-float absolute top-24 left-2 flex flex-col gap-0.5 bg-white/6 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5"
        style={{ animationDelay: '3.0s' }}
      >
        <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">0 – 100</span>
        <span className="text-white font-bold text-base leading-none">3.5 s</span>
      </div>

      <div
        className="hero-badge-float absolute bottom-14 right-6 flex flex-col gap-0.5 bg-white/6 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5"
        style={{ animationDelay: '3.3s' }}
      >
        <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Top Speed</span>
        <span className="text-white font-bold text-base leading-none">308 km/h</span>
      </div>

      {/* ── Glow under car ───────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 h-6 bg-brand/20 blur-2xl rounded-full" />
    </div>
  );
}
