import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard3D } from '../../components/3d/ProductCard3D';
export const WishlistPage = () => {
    const { wishlist, products } = useApp();
    const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-heritage-sand pb-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
              My Saved Heritage Crafts
            </h1>
            <p className="text-xs text-heritage-charcoal/70 mt-0.5">
              {wishlistedProducts.length} pieces bookmarked from India's traditional masters.
            </p>
          </div>
          <Link to="/marketplace" className="text-xs font-bold text-heritage-terracotta hover:underline flex items-center">
            <ArrowLeft className="w-3.5 h-3.5 mr-1"/>
            Discover More
          </Link>
        </div>

        {wishlistedProducts.length === 0 ? (<div className="bg-white rounded-3xl p-16 text-center border border-heritage-sand shadow-3d space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-heritage-sand/60 text-heritage-terracotta flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8"/>
            </div>
            <h3 className="font-serif font-bold text-xl text-heritage-brown">
              Your wishlist is currently empty.
            </h3>
            <p className="text-xs text-heritage-charcoal/70">
              Save your favorite wood carvings, handlooms, and pottery pieces as you explore the marketplace.
            </p>
            <Link to="/marketplace" className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-terracotta text-white font-bold text-xs shadow-sm hover:bg-heritage-terracotta-dark">
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((prod) => (<ProductCard3D key={prod.id} product={prod}/>))}
          </div>)}
      </div>
    </div>);
};
