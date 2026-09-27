import React from 'react';
import { Award, Sparkles } from 'lucide-react';
export const CreditBadgeRadial = ({ credits, badge, size = 'md', showDetails = true, }) => {
    // Milestones:
    // New Artisan: 0 - 499 (Next: 500 Rising)
    // Rising Karigar: 500 - 999 (Next: 1000 Trusted)
    // Trusted Artisan: 1000 - 1599 (Next: 1600 Master)
    // Master Karigar: 1600+ (Max tier)
    let nextThreshold = 500;
    let prevThreshold = 0;
    let nextBadgeName = 'Rising Karigar';
    if (credits >= 1600) {
        prevThreshold = 1600;
        nextThreshold = 2500;
        nextBadgeName = 'Heritage Legend';
    }
    else if (credits >= 1000) {
        prevThreshold = 1000;
        nextThreshold = 1600;
        nextBadgeName = 'Master Karigar';
    }
    else if (credits >= 500) {
        prevThreshold = 500;
        nextThreshold = 1000;
        nextBadgeName = 'Trusted Artisan';
    }
    const progressPercent = Math.min(100, Math.max(5, Math.round(((credits - prevThreshold) / (nextThreshold - prevThreshold)) * 100)));
    // SVG Radial parameters
    const radius = size === 'lg' ? 76 : size === 'md' ? 62 : 46;
    const stroke = size === 'lg' ? 10 : size === 'md' ? 8 : 6;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;
    return (<div className="flex flex-col items-center text-center preserve-3d">
      {/* 3D Radial Sphere & Concentric Ring */}
      <div className="relative flex items-center justify-center p-3 rounded-full bg-gradient-to-b from-heritage-ivory to-heritage-sand shadow-3d-lg border-2 border-heritage-gold/40">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90 transform drop-shadow-md">
          {/* Background Track */}
          <circle stroke="#EADBC8" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius}/>
          {/* Animated Gold Progress Arc */}
          <circle stroke="url(#goldGradient)" fill="transparent" strokeWidth={stroke} strokeDasharray={`${circumference} ${circumference}`} style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius}/>
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37"/>
              <stop offset="50%" stopColor="#C85A32"/>
              <stop offset="100%" stopColor="#F5E6A3"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Center 3D Content Medallion */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-heritage-brown-dark to-heritage-brown text-heritage-sand flex flex-col items-center justify-center shadow-inner border border-heritage-gold/50 p-2">
          <Sparkles className="w-3.5 h-3.5 text-heritage-gold mb-0.5 animate-pulse"/>
          <span className="text-xl sm:text-2xl font-black font-serif text-heritage-gold-light leading-none tracking-tight">
            {credits.toLocaleString('en-IN')}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-heritage-sand/80 mt-1">
            CREDITS
          </span>
        </div>
      </div>

      {/* Badge Pill */}
      <div className="mt-3.5 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-heritage-brown to-heritage-brown-light text-heritage-gold-light border border-heritage-gold/40 shadow-sm">
        <Award className="w-3.5 h-3.5 text-heritage-gold"/>
        <span className="text-xs font-bold uppercase tracking-wider">{badge}</span>
      </div>

      {showDetails && (<div className="mt-2.5 w-full max-w-[220px]">
          <div className="flex justify-between text-[10px] text-heritage-brown font-semibold mb-1">
            <span>Next: {nextBadgeName}</span>
            <span>{credits} / {nextThreshold}</span>
          </div>
          <div className="w-full bg-heritage-sand rounded-full h-1.5 overflow-hidden border border-heritage-terracotta/20">
            <div className="bg-gradient-to-r from-heritage-gold to-heritage-terracotta h-full rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }}/>
          </div>
          <p className="text-[10px] text-heritage-charcoal/60 mt-1 italic">
            +{nextThreshold - credits} credits to unlock next badge tier
          </p>
        </div>)}
    </div>);
};
