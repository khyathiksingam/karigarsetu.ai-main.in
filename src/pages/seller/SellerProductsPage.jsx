import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit3, Trash2, Star, Scan, Layers, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
export const SellerProductsPage = () => {
    const { currentUser, products, deleteProduct } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const sellerProducts = products.filter((p) => p.seller_id === currentUser?.id);
    const filtered = sellerProducts.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.material.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    const categories = ['all', ...Array.from(new Set(sellerProducts.map((p) => p.category)))];
    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to remove "${name}" from your active catalog?`)) {
            deleteProduct(id);
        }
    };
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-heritage-terracotta mb-1">
              <Layers className="w-3.5 h-3.5"/>
              <span>Catalog Management</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
              My Handcrafted Products
            </h1>
            <p className="text-xs text-heritage-charcoal/70 mt-0.5">
              Manage inventory, pricing, and AI-estimated dimensions for your listings.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/seller/ai-analyzer" className="px-4 py-2.5 rounded-xl bg-heritage-sand hover:bg-heritage-sand/80 text-heritage-brown font-bold text-xs flex items-center space-x-1.5 transition">
              <Scan className="w-4 h-4 text-heritage-terracotta"/>
              <span>Analyze New Craft</span>
            </Link>
            <Link to="/seller/products/new" className="px-4 py-2.5 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition">
              <PlusCircle className="w-4 h-4"/>
              <span>Manual Add</span>
            </Link>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-heritage-sand shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3"/>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search your crafts or materials..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"/>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (<button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat
                ? 'bg-heritage-terracotta text-white'
                : 'bg-heritage-sand/40 text-heritage-charcoal/70 hover:bg-heritage-sand'}`}>
                {cat === 'all' ? 'All Categories' : cat}
              </button>))}
          </div>
        </div>

        {/* Products Table / Cards */}
        {filtered.length === 0 ? (<div className="text-center py-16 bg-white rounded-3xl border border-dashed border-heritage-sand p-8">
            <Layers className="w-12 h-12 text-heritage-charcoal/40 mx-auto mb-3"/>
            <h3 className="font-serif font-bold text-lg text-heritage-brown">
              You haven't listed any matching crafts yet.
            </h3>
            <p className="text-xs text-heritage-charcoal/60 mt-1 max-w-sm mx-auto">
              Use our AI Product Analyzer to turn your craft photos into market-ready listings in seconds.
            </p>
            <Link to="/seller/ai-analyzer" className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-terracotta text-white font-bold text-xs shadow-md">
              <Scan className="w-4 h-4"/>
              <span>Analyze Your First Product</span>
            </Link>
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((prod) => (<div key={prod.id} className="bg-white rounded-3xl p-4 border border-heritage-sand shadow-3d hover:shadow-3d-lg transition flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-heritage-sand/30">
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover"/>
                    <span className="absolute top-2 left-2 bg-heritage-brown/80 backdrop-blur-md text-heritage-gold-light text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {prod.category}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md text-heritage-brown text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5"/>
                      {prod.rating} ({prod.review_count})
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-serif font-bold text-base text-heritage-brown line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-heritage-charcoal/60 mt-0.5 line-clamp-2">
                      {prod.description}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-heritage-ivory/50 p-2.5 rounded-xl border border-heritage-sand">
                      <div>
                        <span className="text-heritage-charcoal/50 block text-[10px]">Material</span>
                        <span className="font-bold text-heritage-brown truncate block">{prod.material}</span>
                      </div>
                      <div>
                        <span className="text-heritage-charcoal/50 block text-[10px]">Dimensions</span>
                        <span className="font-bold text-heritage-brown block">
                          {prod.dimensions.length}×{prod.dimensions.width}×{prod.dimensions.height} cm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-heritage-sand flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-heritage-charcoal/50 block">Price</span>
                    <span className="text-base font-extrabold text-heritage-terracotta">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Link to={`/product/${prod.id}`} target="_blank" className="p-2 rounded-xl text-heritage-brown hover:bg-heritage-sand/60 transition" title="View Public Listing">
                      <ExternalLink className="w-4 h-4"/>
                    </Link>
                    <Link to={`/seller/products/${prod.id}`} className="p-2 rounded-xl text-heritage-brown hover:bg-heritage-sand/60 transition" title="Edit Craft Details">
                      <Edit3 className="w-4 h-4"/>
                    </Link>
                    <button type="button" onClick={() => handleDelete(prod.id, prod.name)} className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition" title="Delete Product">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
};
