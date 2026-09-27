import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield } from 'lucide-react';
export const Footer = () => {
    return (<footer className="bg-heritage-brown text-heritage-sand pt-16 pb-12 border-t-4 border-heritage-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-heritage-brown-light/40">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/assets/karigarsetu-ai-logo.png" alt="KARIGARSETU.AI Official Logo" className="w-14 h-14 rounded-full object-contain shadow-md border-2 border-heritage-gold/50 shrink-0"/>
              <span className="font-display font-black text-2xl tracking-wider text-heritage-gold">
                KARIGARSETU.AI
              </span>
            </div>
            <p className="text-heritage-gold-light text-sm font-serif italic">
              "Karigar" = Artisan / skilled craftsperson &bull; "Setu" = Bridge  
              <br />
              <strong className="not-italic text-white">A bridge between Indian artisans and the national marketplace.</strong>
            </p>
            <p className="text-xs text-heritage-sand/70 leading-relaxed max-w-md">
              Engineered by <strong>Team HEXANOVA 3.0</strong> for SMART INDIA HACKATHON 2026. Empowering traditional weavers, sculptors, and potters with neural appraisal, computer vision pricing, and fair direct market linkage.
            </p>
            
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center text-[11px] bg-heritage-terracotta/30 text-heritage-sand border border-heritage-terracotta/50 px-3 py-1 rounded-full">
                <Shield className="w-3.5 h-3.5 mr-1.5"/>
                ONDC & AI Aligned
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-heritage-gold font-bold text-base tracking-wide">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-heritage-sand/80 font-medium">
              <li>
                <Link to="/" className="hover:text-heritage-gold transition">
                  Platform Home
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-heritage-gold transition">
                  Handicraft Marketplace
                </Link>
              </li>
              <li>
                <Link to="/seller/ai-analyzer" className="hover:text-heritage-gold transition flex items-center text-heritage-terracotta-light font-bold">
                  AI Product Analyzer
                </Link>
              </li>
              <li>
                <Link to="/select-role" className="hover:text-heritage-gold transition">
                  Join as Artisan / Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Heritage Craft Traditions */}
          <div className="space-y-3">
            <h4 className="font-serif text-heritage-gold font-bold text-base tracking-wide">
              Craft Traditions
            </h4>
            <ul className="space-y-2 text-xs text-heritage-sand/80 font-medium">
              <li>Warangal Teak Carving</li>
              <li>Jaipur Blue Pottery</li>
              <li>Mangalagiri Pit-Loom Cotton</li>
              <li>Kanchipuram Mulberry Silk</li>
              <li>Majuli Bamboo & Cane</li>
              <li>Moradabad Hand-Engraved Brass</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-heritage-sand/60">
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center text-heritage-gold-light">
              Crafted with <Heart className="w-3.5 h-3.5 text-heritage-terracotta fill-heritage-terracotta mx-1"/> for India's Heritage
            </span>
          </div>
        </div>
      </div>
    </footer>);
};
