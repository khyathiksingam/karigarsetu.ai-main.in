import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard3D } from '../../components/3d/ProductCard3D';
import { CRAFT_CATEGORIES } from '../../data/seedData';
export const MarketplacePage = () => {
    const { products } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlCategory = searchParams.get('category') || 'all';
    const urlSearch = searchParams.get('search') || '';
    const [search, setSearch] = useState(urlSearch);
    const [selectedCategory, setSelectedCategory] = useState(urlCategory);
    const [selectedMaterial, setSelectedMaterial] = useState('all');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedRating, setSelectedRating] = useState(0);
    const [maxPrice, setMaxPrice] = useState(20000);
    const [sortBy, setSortBy] = useState('recommended');
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    // Extract unique materials & states from products
    const materials = useMemo(() => {
        return ['all', ...Array.from(new Set(products.map((p) => p.material)))];
    }, [products]);
    const states = useMemo(() => {
        return ['all', ...Array.from(new Set(products.map((p) => p.state)))];
    }, [products]);
    // Comprehensive Search & Multi-Filter (Section 24)
    const filteredProducts = useMemo(() => {
        return products
            .filter((p) => {
            // Search by product name, seller, material, category, location, color
            const q = search.toLowerCase().trim();
            const matchesSearch = !q ||
                p.name.toLowerCase().includes(q) ||
                p.seller.full_name.toLowerCase().includes(q) ||
                p.seller.username.toLowerCase().includes(q) ||
                p.material.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.city.toLowerCase().includes(q) ||
                p.state.toLowerCase().includes(q) ||
                p.primary_color.toLowerCase().includes(q);
            const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
            const matchesMat = selectedMaterial === 'all' || p.material === selectedMaterial;
            const matchesState = selectedState === 'all' || p.state === selectedState;
            const matchesRating = selectedRating === 0 || p.rating >= selectedRating;
            const matchesPrice = p.price <= maxPrice;
            return matchesSearch && matchesCat && matchesMat && matchesState && matchesRating && matchesPrice;
        })
            .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            if (sortBy === 'price_low') {
                return a.price - b.price;
            }
            if (sortBy === 'price_high') {
                return b.price - a.price;
            }
            if (sortBy === 'rating') {
                return b.rating - a.rating;
            }
            // Recommended default
            return b.quality_score - a.quality_score;
        });
    }, [products, search, selectedCategory, selectedMaterial, selectedState, selectedRating, maxPrice, sortBy]);
    const resetFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        setSelectedMaterial('all');
        setSelectedState('all');
        setSelectedRating(0);
        setMaxPrice(20000);
        setSortBy('recommended');
    };
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-heritage-sand pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-heritage-terracotta mb-1">
              <img src="/assets/karigarsetu-ai-logo.png" alt="KARIGARSETU.AI" className="w-5 h-5 rounded-full object-contain"/>
              <span>Direct Artisan Marketplace</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
              Handcrafted Treasures of India
            </h1>
            <p className="text-xs text-heritage-charcoal/70 mt-0.5">
              Showing {filteredProducts.length} authentic listings certified by KARIGARSETU.AI.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3"/>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search craft, artisan, material, city..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-white text-xs font-medium focus:border-heritage-terracotta outline-none shadow-sm"/>
            {search && (<button type="button" onClick={() => setSearch('')} className="absolute right-3 top-3 text-xs text-heritage-charcoal/40 hover:text-heritage-brown">
                <X className="w-3.5 h-3.5"/>
              </button>)}
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CRAFT_CATEGORIES.map((cat) => (<button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 shadow-sm ${selectedCategory === cat.id
                ? 'bg-heritage-terracotta text-white shadow-md'
                : 'bg-white text-heritage-brown border border-heritage-sand hover:bg-heritage-sand/60'}`}>
              <span>{cat.name}</span>
            </button>))}
        </div>

        {/* Controls Bar: Sort and Filter Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-heritage-sand shadow-sm">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button onClick={() => setFilterDrawerOpen(!filterDrawerOpen)} className="px-3 py-1.5 rounded-xl bg-heritage-sand/60 hover:bg-heritage-sand text-xs font-bold text-heritage-brown flex items-center space-x-1.5 transition">
              <SlidersHorizontal className="w-3.5 h-3.5 text-heritage-terracotta"/>
              <span>Filter Crafts</span>
            </button>
            {(selectedCategory !== 'all' || selectedMaterial !== 'all' || selectedState !== 'all' || selectedRating > 0 || maxPrice < 20000 || search) && (<button onClick={resetFilters} className="text-[11px] font-bold text-heritage-terracotta hover:underline">
                Clear All Filters
              </button>)}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-heritage-charcoal/60 font-semibold whitespace-nowrap">
              Sort by:
            </span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-bold text-heritage-brown focus:border-heritage-terracotta outline-none">
              <option value="recommended">Recommended (AI Quality)</option>
              <option value="newest">Newest Additions</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Expandable Filter Drawer */}
        {filterDrawerOpen && (<div className="bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d space-y-6">
            <div className="flex items-center justify-between border-b border-heritage-sand pb-3">
              <h3 className="font-serif font-bold text-base text-heritage-brown flex items-center">
                <Filter className="w-4 h-4 mr-1.5 text-heritage-terracotta"/>
                Refine Craft Specifications
              </h3>
              <button onClick={() => setFilterDrawerOpen(false)} className="text-xs text-heritage-charcoal/60 hover:text-heritage-brown">
                Close Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              {/* Material Filter */}
              <div>
                <label className="block font-bold text-heritage-brown mb-1.5">
                  Raw Material
                </label>
                <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} className="w-full p-2 rounded-xl border border-heritage-sand bg-heritage-ivory/30 text-xs font-medium focus:border-heritage-terracotta outline-none">
                  {materials.map((m) => (<option key={m} value={m}>
                      {m === 'all' ? 'All Materials' : m}
                    </option>))}
                </select>
              </div>

              {/* State / Origin Filter */}
              <div>
                <label className="block font-bold text-heritage-brown mb-1.5">
                  Artisan State of Origin
                </label>
                <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full p-2 rounded-xl border border-heritage-sand bg-heritage-ivory/30 text-xs font-medium focus:border-heritage-terracotta outline-none">
                  {states.map((s) => (<option key={s} value={s}>
                      {s === 'all' ? 'All States of India' : s}
                    </option>))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block font-bold text-heritage-brown mb-1.5">
                  Minimum Artisan Rating
                </label>
                <select value={selectedRating} onChange={(e) => setSelectedRating(Number(e.target.value))} className="w-full p-2 rounded-xl border border-heritage-sand bg-heritage-ivory/30 text-xs font-medium focus:border-heritage-terracotta outline-none">
                  <option value="0">All Ratings</option>
                  <option value="4.5">4.5★ and above (Master level)</option>
                  <option value="4.8">4.8★ and above (Top rated)</option>
                </select>
              </div>

              {/* Max Price Slider */}
              <div>
                <div className="flex justify-between font-bold text-heritage-brown mb-1.5">
                  <span>Max Price</span>
                  <span className="text-heritage-terracotta font-extrabold">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input type="range" min="500" max="20000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-heritage-terracotta"/>
              </div>
            </div>
          </div>)}

        {/* 3D Product Grid (Section 23 & 33) */}
        {filteredProducts.length === 0 ? (<div className="bg-white rounded-3xl p-16 text-center border border-heritage-sand space-y-3">
            <Layers className="w-12 h-12 text-heritage-charcoal/40 mx-auto"/>
            <h3 className="font-serif font-bold text-lg text-heritage-brown">
              No matching handicrafts found.
            </h3>
            <p className="text-xs text-heritage-charcoal/60">
              Try adjusting your search terms, price limit, or category filter.
            </p>
            <button onClick={resetFilters} className="px-4 py-2 bg-heritage-terracotta text-white rounded-xl text-xs font-bold shadow-sm">
              Reset All Filters
            </button>
          </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (<ProductCard3D key={prod.id} product={prod}/>))}
          </div>)}
      </div>
    </div>);
};
