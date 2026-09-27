import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Scan, TrendingUp, UserCheck, ShoppingBag, Award, Compass, ArrowRight, ChevronRight } from 'lucide-react';
import { FloatingCraftHero3D } from '../components/3d/FloatingCraftHero3D';
import { ProductCard3D } from '../components/3d/ProductCard3D';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
export const LandingPage = () => {
    const { products, language } = useApp();
    const t = (key) => getTranslation(language, key);
    const featuredProducts = products.slice(0, 4);
    const reveal = {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: 'easeOut' },
    };
    return (<div className="min-h-screen bg-heritage-ivory bg-heritage-pattern">
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full hero-glow pointer-events-none"/>
        <div className="absolute -top-12 left-10 h-64 w-64 rounded-full bg-[#C8702A]/12 blur-3xl"/>
        <div className="absolute top-24 right-10 h-72 w-72 rounded-full bg-[#1A3A5C]/10 blur-3xl"/>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div {...reveal} className="lg:col-span-6 space-y-7 text-center lg:text-left">
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#1A3A5C] leading-[0.95] tracking-tight">
                {t('fromArtisanToMarket')}
                <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-[#C8702A] via-[#D7B36A] to-[#1A3A5C]">
                  {t('poweredByAi')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#1A3A5C]/75 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Empowering Indian artisans to showcase, understand, price and sell their creations while helping buyers discover authentic handmade heritage through a premium AI-powered marketplace.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/marketplace" className="premium-button w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#C8702A] to-[#A8561D] text-white font-bold text-sm shadow-[0_22px_30px_rgba(200,112,42,0.22)] hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2">
                  <ShoppingBag className="w-4 h-4"/>
                  <span>{t('exploreMarketplace')}</span>
                </Link>

                <Link to="/seller/ai-analyzer" className="premium-button w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#1A3A5C] text-[#F8EED9] border border-[#D7B36A]/40 font-bold text-sm shadow-[0_18px_24px_rgba(26,58,92,0.14)] hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 group">
                  <Scan className="w-4 h-4 text-[#D7B36A] group-hover:rotate-12 transition-transform"/>
                  <span>{t('sellWithAi')}</span>
                </Link>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#1A3A5C]/10 max-w-md mx-auto lg:mx-0">
                <div className="rounded-2xl border border-white/70 bg-white/55 p-3 shadow-[0_18px_28px_rgba(26,58,92,0.04)] backdrop-blur-sm">
                  <p className="text-2xl font-black font-serif text-[#1A3A5C]">3,400+</p>
                  <p className="text-[11px] text-[#1A3A5C]/65 font-semibold">{t('activeKarigars')}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/55 p-3 shadow-[0_18px_28px_rgba(26,58,92,0.04)] backdrop-blur-sm">
                  <p className="text-2xl font-black font-serif text-[#C8702A]">94%</p>
                  <p className="text-[11px] text-[#1A3A5C]/65 font-semibold">AI Match</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/55 p-3 shadow-[0_18px_28px_rgba(26,58,92,0.04)] backdrop-blur-sm">
                  <p className="text-2xl font-black font-serif text-[#1A3A5C]">100%</p>
                  <p className="text-[11px] text-[#1A3A5C]/65 font-semibold">{t('directEarnings')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div {...reveal} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }} className="lg:col-span-6">
              <FloatingCraftHero3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6: KEY FEATURES (6 Cards with 3D effects) */}
      <section className="py-20 bg-heritage-sand/30 border-y border-heritage-terracotta/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
              Platform Innovations
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-heritage-brown mt-2">
              Empowering India's Heritage with Intelligent Technology
            </h2>
            <p className="text-sm sm:text-base text-heritage-charcoal/70 mt-3 font-medium">
              Bridging centuries-old craft traditions with next-generation neural appraisal and direct commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: AI Product Analyzer */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-terracotta/20 shadow-3d hover:border-heritage-terracotta">
              <div className="w-12 h-12 rounded-2xl bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mb-5">
                <Scan className="w-6 h-6"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                AI Product Analyzer
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Analyze a product image using AI. Automatically detect craft tradition, material, dimensional estimates, and structural quality score with single-tap scanning.
              </p>
              <Link to="/seller/ai-analyzer" className="text-xs font-bold text-heritage-terracotta flex items-center group">
                Try AI Analyzer <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>

            {/* Card 2: Smart Pricing */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-gold/40 shadow-3d hover:border-heritage-gold">
              <div className="w-12 h-12 rounded-2xl bg-heritage-gold/20 text-heritage-brown flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6 text-heritage-brown"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Smart Pricing
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Estimate an appropriate market price based on raw material indices, crafting time, regional craft factors, and fair living wage standards for artisans.
              </p>
              <span className="text-xs font-semibold text-heritage-gold-dark">
                Fair Trade Algorithm Included
              </span>
            </div>

            {/* Card 3: Artisan Identity */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-terracotta/20 shadow-3d hover:border-heritage-terracotta">
              <div className="w-12 h-12 rounded-2xl bg-heritage-green/10 text-heritage-green flex items-center justify-center mb-5">
                <UserCheck className="w-6 h-6 text-heritage-green"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Artisan Identity
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Every product clearly identifies its seller with verifiable profile, craft lineage, state of origin, and customer reputation. No anonymous middlemen.
              </p>
              <span className="text-xs font-semibold text-heritage-green-light">
                Verified Artisan & Heritage Profiles
              </span>
            </div>

            {/* Card 4: Direct Marketplace */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-terracotta/20 shadow-3d hover:border-heritage-terracotta">
              <div className="w-12 h-12 rounded-2xl bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mb-5">
                <ShoppingBag className="w-6 h-6"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Direct Marketplace
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Connect buyers directly with artisans with zero hidden commission deductions. Fast checkout, automated order management, and transparent tracking.
              </p>
              <Link to="/marketplace" className="text-xs font-bold text-heritage-terracotta flex items-center group">
                Browse Listings <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>

            {/* Card 5: Karigar Credits */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-gold/40 shadow-3d hover:border-heritage-gold">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mb-5">
                <Award className="w-6 h-6 text-heritage-gold-dark"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Karigar Credits
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Reward seller activity and reputation with gamified platform credits. Earn points on every published craft, completed order, and verified 5-star review.
              </p>
              <span className="text-xs font-semibold text-heritage-gold-dark">
                Progress from New Artisan to Master Karigar
              </span>
            </div>

            {/* Card 6: Heritage Discovery */}
            <div className="card-3d bg-white p-7 rounded-3xl border border-heritage-terracotta/20 shadow-3d hover:border-heritage-terracotta">
              <div className="w-12 h-12 rounded-2xl bg-heritage-brown/10 text-heritage-brown flex items-center justify-center mb-5">
                <Compass className="w-6 h-6"/>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown mb-2">
                Heritage Discovery
              </h3>
              <p className="text-sm text-heritage-charcoal/70 leading-relaxed mb-4">
                Help buyers discover India's traditional crafts through rich cultural stories, regional craft clustering, and AI-recommended artisan workshops.
              </p>
              <Link to="/marketplace" className="text-xs font-bold text-heritage-brown flex items-center group">
                Explore Crafts of India <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: HOW IT WORKS (Seller Flow vs Buyer Flow) */}
      <section id="how-it-works" className="py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
              Seamless Ecosystem
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-heritage-brown mt-2">
              How KARIGARSETU.AI Works
            </h2>
            <p className="text-sm sm:text-base text-heritage-charcoal/70 mt-3 font-medium">
              A transparent, two-sided pipeline linking uncatalogued rural creations with discerning urban connoisseurs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* SELLER FLOW */}
            <div className="bg-gradient-to-br from-heritage-ivory to-heritage-sand/60 p-8 rounded-3xl border-2 border-heritage-terracotta/20 shadow-3d">
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-3 py-1 bg-heritage-terracotta text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  For Artisans / Sellers
                </span>
                <span className="text-xs text-heritage-brown font-semibold">
                  Zero Technical Barrier
                </span>
              </div>

              <div className="space-y-4">
                {[
            { step: '1', title: 'Upload Craft Photo', desc: 'Snap photo from mobile camera or drag & drop image' },
            { step: '2', title: 'AI Analyze & Appraise', desc: 'Neural vision scans form, material, dimensions, and suggests price' },
            { step: '3', title: 'Edit & Refine Details', desc: 'Artisan confirms specs and adjusts final listing price' },
            { step: '4', title: 'Publish to Marketplace', desc: 'Listing enters verified catalog under artisan profile (+50 Credits)' },
            { step: '5', title: 'Sell & Earn Direct Payment', desc: 'Buyer purchases craft, artisan receives order notification' },
            { step: '6', title: 'Earn Credits & Badges', desc: 'Accumulate Karigar Credits toward Master Karigar standing' },
        ].map((item, idx) => (<div key={idx} className="flex items-start space-x-3.5 bg-white/80 p-3.5 rounded-2xl border border-heritage-sand shadow-sm">
                    <div className="w-7 h-7 rounded-full bg-heritage-terracotta text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-heritage-brown">{item.title}</h4>
                      <p className="text-xs text-heritage-charcoal/70">{item.desc}</p>
                    </div>
                  </div>))}
              </div>

              <div className="mt-6 text-center">
                <Link to="/seller/ai-analyzer" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition">
                  <Scan className="w-4 h-4"/>
                  <span>Start AI Product Analysis</span>
                </Link>
              </div>
            </div>

            {/* BUYER FLOW */}
            <div className="bg-gradient-to-br from-heritage-ivory to-heritage-sand/60 p-8 rounded-3xl border-2 border-heritage-gold/40 shadow-3d">
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-3 py-1 bg-heritage-brown text-heritage-gold-light rounded-full text-xs font-bold uppercase tracking-wider">
                  For Buyers & Patrons
                </span>
                <span className="text-xs text-heritage-brown font-semibold">
                  100% Authentic Heritage
                </span>
              </div>

              <div className="space-y-4">
                {[
            { step: '1', title: 'Discover Traditional Crafts', desc: 'Filter by category, material, state, or search natural language' },
            { step: '2', title: 'Explore AI Verified Specs', desc: 'Inspect dimensional details, material breakdown, and quality score' },
            { step: '3', title: 'View Artisan Story', desc: 'Read artisan bio, specialization lineage, and community reviews' },
            { step: '4', title: 'Buy Directly or Inquire', desc: 'Direct cart checkout or send custom message to artisan' },
            { step: '5', title: 'Review & Support', desc: 'Rate product with 5 stars to reward artisan with Karigar Credits' },
        ].map((item, idx) => (<div key={idx} className="flex items-start space-x-3.5 bg-white/80 p-3.5 rounded-2xl border border-heritage-sand shadow-sm">
                    <div className="w-7 h-7 rounded-full bg-heritage-brown text-heritage-gold text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-heritage-brown">{item.title}</h4>
                      <p className="text-xs text-heritage-charcoal/70">{item.desc}</p>
                    </div>
                  </div>))}
              </div>

              <div className="mt-6 text-center">
                <Link to="/marketplace" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-heritage-brown hover:bg-heritage-brown-dark text-heritage-gold-light font-bold text-xs shadow-md transition">
                  <ShoppingBag className="w-4 h-4 text-heritage-gold"/>
                  <span>Explore Handmade Marketplace</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MARKETPLACE HIGHLIGHT */}
      <section className="py-16 bg-white border-t border-heritage-terracotta/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
                Direct From Master Karigars
              </span>
              <h2 className="font-display text-3xl font-black text-heritage-brown mt-1">
                Featured Handmade Treasures
              </h2>
            </div>
            <Link to="/marketplace" className="mt-3 sm:mt-0 text-sm font-bold text-heritage-terracotta hover:text-heritage-terracotta-dark flex items-center">
              <span>View All 20+ Masterpieces</span>
              <ChevronRight className="w-4 h-4 ml-0.5"/>
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#1A3A5C]/20 bg-[#F7F2EA] p-12 text-center shadow-sm">
              <h3 className="font-serif text-2xl font-black text-heritage-brown">Discover Indian Handcrafted Heritage</h3>
              <p className="mt-3 max-w-xl mx-auto text-sm text-heritage-charcoal/70 leading-relaxed">
                Authentic products from registered artisans will appear here as soon as they are published to the marketplace.
              </p>
              <p className="mt-2 text-sm font-semibold text-heritage-terracotta">No products available yet.</p>
              <Link to="/marketplace" className="mt-6 inline-flex items-center rounded-xl bg-heritage-terracotta px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-heritage-terracotta-dark transition">
                Explore the Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((prod) => (<ProductCard3D key={prod.id} product={prod}/>))}
            </div>
          )}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-heritage-brown via-heritage-brown-dark to-heritage-brown text-heritage-sand border-t-4 border-heritage-gold relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40 text-xs font-bold uppercase tracking-widest">
            2026 Innovation
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
            Ready to Bridge Indian Craft with the Future?
          </h2>
          <p className="text-sm sm:text-base text-heritage-sand/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience the complete flow from camera scan to appraisal, direct marketplace listing, and instant order fulfillment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/seller/ai-analyzer" className="px-8 py-3.5 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-sm shadow-3d-lg transition-transform hover:scale-105">
              Analyze Your First Craft Now
            </Link>
            <Link to="/select-role" className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-heritage-gold-light border border-heritage-gold/40 font-bold text-sm transition">
              Create Platform Account
            </Link>
          </div>
        </div>
      </section>
    </div>);
};
