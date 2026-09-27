import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard3D } from '../../components/3d/ProductCard3D';
import { CRAFT_CATEGORIES } from '../../data/seedData';
export const BuyerDashboard = () => {
    const { currentUser, products, orders, wishlist } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    const buyerOrders = orders.filter((o) => o.buyer_id === currentUser?.id || o.buyer_name === currentUser?.full_name);
    const curatedPicks = products.slice(0, 4);
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* SECTION 22: BUYER HEADLINE & SEARCH */}
        <div className="bg-gradient-to-r from-heritage-brown via-heritage-brown-dark to-heritage-terracotta text-white rounded-3xl p-8 sm:p-12 shadow-3d-lg border-2 border-heritage-gold/40 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-heritage-gold/20 text-heritage-gold-light border border-heritage-gold/30 text-xs font-bold uppercase tracking-wider">
              <img src="/assets/karigarsetu-ai-logo.png" alt="KARIGARSETU.AI" className="w-5 h-5 rounded-full object-contain"/>
              <span>Welcome, {currentUser?.full_name || 'Buyer'}</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Discover India's Handmade Heritage
            </h1>

            <p className="text-xs sm:text-sm text-heritage-sand/80 max-w-xl mx-auto font-medium">
              Direct linkage to rural master craftspeople. AI Recognized authenticity, AI dimensional appraisals, and transparent ethical pricing.
            </p>

            {/* Natural Language Craft Search */}
            <form onSubmit={handleSearch} className="pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-heritage-brown/60 absolute left-4 pointer-events-none"/>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search handicrafts, artisans, materials (e.g., Warangal Teak, Blue Pottery, Silk)..." className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white text-heritage-charcoal text-xs sm:text-sm font-medium shadow-3d focus:ring-2 focus:ring-heritage-gold outline-none"/>
                <button type="submit" className="absolute right-2 px-5 py-2 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white text-xs font-bold transition shadow-sm">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* SECTION 36: 3D CATEGORY CARDS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-xl text-heritage-brown">
              Explore by Craft Heritage
            </h2>
            <Link to="/marketplace" className="text-xs font-bold text-heritage-terracotta hover:underline flex items-center">
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1"/>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CRAFT_CATEGORIES.slice(1).map((cat) => (<Link key={cat.id} to={`/marketplace?category=${encodeURIComponent(cat.id)}`} className="card-3d bg-white p-3.5 rounded-2xl border border-heritage-sand shadow-sm hover:border-heritage-terracotta text-center flex flex-col items-center justify-center transition">
                <div className="w-10 h-10 rounded-xl bg-heritage-sand/60 text-heritage-terracotta flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5"/>
                </div>
                <span className="text-xs font-bold text-heritage-brown truncate w-full">
                  {cat.name}
                </span>
                <span className="text-[10px] text-heritage-charcoal/50 mt-0.5">
                  {cat.count} listings
                </span>
              </Link>))}
          </div>
        </div>

        {/* CURATED MASTERPIECES */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-heritage-brown">
                Recommended For You
              </h2>
              <p className="text-xs text-heritage-charcoal/60">
                Direct from national awardee artisans and AI-Recognized artisan craft clusters.
              </p>
            </div>
            <Link to="/marketplace" className="text-xs font-bold text-heritage-terracotta hover:underline">
              See All Crafts &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedPicks.map((prod) => (<ProductCard3D key={prod.id} product={prod}/>))}
          </div>
        </div>

        {/* 2-COLUMN SPLIT: RECENT ORDERS & SAVED ARTISANS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Recent Purchases */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-heritage-brown">
                My Recent Orders
              </h3>
              <Link to="/buyer/orders" className="text-xs font-bold text-heritage-terracotta hover:underline">
                View All ({buyerOrders.length})
              </Link>
            </div>

            {buyerOrders.length === 0 ? (<div className="p-8 text-center bg-heritage-ivory/40 rounded-2xl border border-dashed border-heritage-sand">
                <ShoppingBag className="w-8 h-8 text-heritage-charcoal/40 mx-auto mb-2"/>
                <p className="text-xs font-bold text-heritage-brown">
                  Your cart is waiting for something handmade.
                </p>
                <Link to="/marketplace" className="mt-3 inline-block text-xs font-bold text-heritage-terracotta hover:underline">
                  Start Exploring &rarr;
                </Link>
              </div>) : (<div className="space-y-3">
                {buyerOrders.slice(0, 2).map((o) => (<div key={o.id} className="p-3.5 rounded-2xl bg-heritage-sand/30 border border-heritage-sand flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={o.items[0]?.product_image} alt="Product" className="w-12 h-12 rounded-xl object-cover border border-heritage-sand"/>
                      <div>
                        <span className="font-mono font-bold text-xs text-heritage-brown block">
                          {o.order_code}
                        </span>
                        <p className="text-xs text-heritage-charcoal font-medium line-clamp-1">
                          {o.items[0]?.product_name}
                        </p>
                        <span className="text-[10px] text-heritage-charcoal/60 capitalize">
                          Status: <strong>{o.status}</strong> &bull; Sold by {o.seller_name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-xs text-heritage-terracotta block">
                        ₹{o.total_amount.toLocaleString('en-IN')}
                      </span>
                      <Link to="/buyer/orders" className="text-[10px] font-bold text-heritage-brown hover:underline">
                        Track Order &rarr;
                      </Link>
                    </div>
                  </div>))}
              </div>)}
          </div>

        </div>
      </div>
    </div>);
};
