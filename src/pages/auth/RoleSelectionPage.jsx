import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Hammer, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
export const RoleSelectionPage = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();
    const handleContinue = () => {
        if (!selectedRole)
            return;
        navigate(`/signup?role=${selectedRole}`);
    };
    return (<div className="min-h-screen bg-heritage-ivory bg-heritage-pattern flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full text-center mb-10">
        <div className="flex justify-center mb-5">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <img src="/assets/karigarsetu-ai-logo.png" alt="KARIGARSETU.AI Official Logo" className="h-16 w-16 rounded-full object-contain shadow-md border-2 border-heritage-gold/50 group-hover:scale-105 transition-transform"/>
            <div className="flex flex-col text-left">
              <span className="font-display font-black text-2xl tracking-wider text-heritage-brown leading-none">
                KARIGARSETU.AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-terracotta mt-1">
                From Artisan to Market — Powered by AI
              </span>
            </div>
          </Link>
        </div>

        <div className="inline-flex items-center space-x-2 bg-heritage-sand px-3 py-1 rounded-full border border-heritage-gold/30 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-heritage-terracotta"/>
          <span className="text-xs font-bold text-heritage-brown uppercase tracking-wider">
            Step 1 of 2: Role Selection
          </span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-heritage-brown leading-tight">
          How do you want to join <br />
          <span className="text-heritage-terracotta">KARIGARSETU.AI</span>?
        </h1>
        <p className="text-sm text-heritage-charcoal/70 mt-2 font-medium">
          Choose how you will participate in India's premier AI-powered handicraft ecosystem.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: SELLER / ARTISAN */}
        <div onClick={() => setSelectedRole('seller')} className={`cursor-pointer rounded-3xl p-7 sm:p-8 transition-all duration-300 relative border-2 flex flex-col justify-between preserve-3d ${selectedRole === 'seller'
            ? 'bg-white border-heritage-terracotta shadow-3d-lg scale-102 ring-2 ring-heritage-terracotta/20'
            : 'bg-white/80 border-heritage-sand hover:border-heritage-terracotta/50 shadow-3d hover:-translate-y-1'}`}>
          {selectedRole === 'seller' && (<div className="absolute top-4 right-4 text-heritage-terracotta">
              <CheckCircle2 className="w-6 h-6 fill-heritage-terracotta text-white"/>
            </div>)}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mb-6">
              <Hammer className="w-7 h-7"/>
            </div>

            <span className="text-[11px] font-bold tracking-widest uppercase text-heritage-terracotta bg-heritage-terracotta/10 px-2.5 py-1 rounded-md">
              Artisan & Producer
            </span>

            <h2 className="font-serif font-black text-2xl text-heritage-brown mt-3">
              SELLER / ARTISAN
            </h2>

            <p className="text-sm text-heritage-charcoal/80 font-medium leading-relaxed mt-2.5 italic">
              “I create handmade products and want to sell them.”
            </p>

            <ul className="mt-5 space-y-2 text-xs text-heritage-charcoal/70 font-semibold border-t border-heritage-sand pt-4">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-heritage-terracotta mr-2"/>
                AI Vision & Smart Appraisal Analyzer
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-heritage-terracotta mr-2"/>
                Zero commission direct listings
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-heritage-terracotta mr-2"/>
                Earn Karigar Credits & Master Badges
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3">
            <span className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${selectedRole === 'seller'
            ? 'bg-heritage-terracotta text-white'
            : 'bg-heritage-sand text-heritage-brown'}`}>
              <span>Select Artisan Role</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </span>
          </div>
        </div>

        {/* CARD 2: BUYER */}
        <div onClick={() => setSelectedRole('buyer')} className={`cursor-pointer rounded-3xl p-7 sm:p-8 transition-all duration-300 relative border-2 flex flex-col justify-between preserve-3d ${selectedRole === 'buyer'
            ? 'bg-white border-heritage-gold shadow-3d-lg scale-102 ring-2 ring-heritage-gold/20'
            : 'bg-white/80 border-heritage-sand hover:border-heritage-gold/50 shadow-3d hover:-translate-y-1'}`}>
          {selectedRole === 'buyer' && (<div className="absolute top-4 right-4 text-heritage-brown">
              <CheckCircle2 className="w-6 h-6 fill-heritage-gold text-heritage-brown"/>
            </div>)}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-heritage-gold/20 text-heritage-brown flex items-center justify-center mb-6">
              <ShoppingBag className="w-7 h-7"/>
            </div>

            <span className="text-[11px] font-bold tracking-widest uppercase text-heritage-brown-light bg-heritage-gold/20 px-2.5 py-1 rounded-md">
              Patron & Collector
            </span>

            <h2 className="font-serif font-black text-2xl text-heritage-brown mt-3">
              BUYER
            </h2>

            <p className="text-sm text-heritage-charcoal/80 font-medium leading-relaxed mt-2.5 italic">
              “I want to discover and buy handmade products.”
            </p>

            <ul className="mt-5 space-y-2 text-xs text-heritage-charcoal/70 font-semibold border-t border-heritage-sand pt-4">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-heritage-gold mr-2"/>
                AI-Recognized authentic & handcrafted goods
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-heritage-gold mr-2"/>
                Direct purchase & messaging with craftspeople
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-heritage-gold mr-2"/>
                Transparent origin & fair living pricing
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3">
            <span className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${selectedRole === 'buyer'
            ? 'bg-heritage-brown text-heritage-gold-light'
            : 'bg-heritage-sand text-heritage-brown'}`}>
              <span>Select Buyer Role</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </span>
          </div>
        </div>
      </div>

      {/* Continue Button & Login Redirection */}
      <div className="max-w-md mx-auto w-full mt-10 text-center space-y-4">
        <button onClick={handleContinue} disabled={!selectedRole} className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-3d flex items-center justify-center space-x-2 transition-all ${selectedRole
            ? 'bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white hover:scale-101'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          <span>Continue with Registration</span>
          <ArrowRight className="w-4 h-4"/>
        </button>

        <p className="text-xs text-heritage-charcoal/70 font-medium">
          Already have a KARIGARSETU.AI account?{' '}
          <Link to="/login" className="font-bold text-heritage-terracotta hover:underline">
            Log In Here
          </Link>
        </p>
      </div>
    </div>);
};
