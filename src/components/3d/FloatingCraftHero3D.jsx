import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FloatingCraftHero3D = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
        setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    return (
      <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative w-full h-[520px] lg:h-[600px] flex items-center justify-center perspective-1000 select-none overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none flex items-center justify-center opacity-40">
          <div className="w-[500px] h-[500px] rounded-full border border-heritage-gold/30 animate-spin-slow"/>
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-heritage-terracotta/30"/>
        </div>

        <div
          style={{
            transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          className="relative w-full max-w-[540px] h-[480px] preserve-3d flex items-center justify-center"
        >
          <div style={{ transform: 'translateZ(120px)' }} className="relative z-30 w-72 sm:w-80 bg-white/95 rounded-3xl p-4 shadow-3d-lg border-2 border-heritage-gold/50 backdrop-blur-xl transition-all duration-300">
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-inner group bg-gradient-to-br from-[#1A3A5C] via-[#C8702A]/20 to-[#F7F2EA] flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
              <div className="relative text-center px-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#C8702A] shadow-md">
                  <Sparkles className="h-7 w-7" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#1A3A5C]/70 font-bold">Verified artisan marketplace</p>
                <h3 className="mt-3 font-serif text-2xl font-black text-[#1A3A5C]">Discover Indian Handcrafted Heritage</h3>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"/>
                <span className="text-xs font-bold text-heritage-brown">
                  Artisan Verified
                </span>
              </div>
              <Link to="/marketplace" className="inline-flex items-center text-xs font-bold text-heritage-terracotta hover:text-heritage-terracotta-dark transition">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1"/>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
};
