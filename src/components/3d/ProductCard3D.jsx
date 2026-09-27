import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, MapPin, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
export const ProductCard3D = ({ product }) => {
    const { addToCart, toggleWishlist, isInWishlist } = useApp();
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [addedNotice, setAddedNotice] = useState(false);
    const navigate = useNavigate();
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12; // -6 to +6 deg
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
        setTilt({ x, y });
    };
    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        setAddedNotice(true);
        setTimeout(() => setAddedNotice(false), 1600);
    };
    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };
    const wishlisted = isInWishlist(product.id);
    return (<div onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave} style={{
            transform: isHovered
                ? `translateY(-8px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.02)`
                : 'translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)',
            transition: 'transform 0.25s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.25s ease',
        }} className="group relative bg-white rounded-3xl p-3.5 sm:p-4 border border-heritage-terracotta/15 shadow-3d hover:shadow-3d-lg preserve-3d flex flex-col justify-between">
      <div>
        {/* Elevated Product Image with 3D Pop Effect */}
        <div style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)' }} className="relative aspect-square w-full rounded-2xl overflow-hidden bg-heritage-sand/30 transition-transform duration-300 shadow-sm">
          <img src={product.images[0]} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"/>

          {/* AI Verified / Category Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
            <span className="bg-heritage-brown/85 backdrop-blur-md text-heritage-gold-light text-[10px] font-bold px-2 py-0.5 rounded-full border border-heritage-gold/30">
              {product.category}
            </span>
            {product.is_dimensions_estimated && (<span className="bg-emerald-800/80 backdrop-blur-md text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex items-center">
                AI Specs
              </span>)}
          </div>

          {/* Wishlist Button */}
          <button onClick={handleToggleWishlist} aria-label="Toggle Wishlist" className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${wishlisted
            ? 'bg-heritage-terracotta text-white shadow-md'
            : 'bg-white/80 text-heritage-brown hover:text-heritage-terracotta hover:bg-white'}`}>
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`}/>
          </button>

          {/* Material Tag at bottom of photo */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className="bg-white/90 backdrop-blur-sm text-heritage-brown-dark text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
              {product.material}
            </span>
            <div className="bg-white/95 backdrop-blur-sm text-heritage-brown text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 shadow-sm">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500"/>
              <span>{product.rating}</span>
            </div>
          </div>
        </div>

        {/* Product Details Header */}
        <div className="mt-3.5">
          <Link to={`/product/${product.id}`} className="block group-hover:text-heritage-terracotta transition">
            <h3 className="font-serif font-bold text-base text-heritage-charcoal line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-heritage-charcoal/70 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* MANDATORY SECTION 19: Clear Artisan Identity from Profile */}
        <div className="mt-3 pt-3 border-t border-heritage-sand/80 flex items-center justify-between">
          <Link to={`/artisan/${product.seller.username}`} className="flex items-center space-x-2 group/seller hover:opacity-90">
            <Avatar src={product.seller.profile_image} name={product.seller.full_name} role="seller" size="sm" className="border border-heritage-gold shadow-sm shrink-0"/>
            <div className="text-left">
              <p className="text-[10px] text-heritage-terracotta font-semibold uppercase tracking-wider leading-none">
                Sold by
              </p>
              <p className="text-xs font-bold text-heritage-brown group-hover/seller:text-heritage-terracotta transition leading-tight">
                {product.seller.full_name}
              </p>
              <div className="flex items-center text-[10px] text-heritage-charcoal/60 mt-0.5">
                <MapPin className="w-2.5 h-2.5 mr-0.5 text-heritage-terracotta"/>
                <span>
                  {product.seller.city}, {product.seller.state}
                </span>
              </div>
            </div>
          </Link>

          {/* Artisan Verified Badge */}
          <span className="text-[10px] font-semibold bg-heritage-gold/15 text-heritage-brown-light border border-heritage-gold/30 px-1.5 py-0.5 rounded-md">
            {product.seller.badge}
          </span>
        </div>
      </div>

      {/* Price & Action Row */}
      <div className="mt-4 pt-2.5 border-t border-heritage-sand/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-heritage-charcoal/60 font-medium block">
            Craft Price
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-lg font-extrabold text-heritage-terracotta-dark">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.market_price_max > product.price && (<span className="text-[11px] text-heritage-charcoal/50 line-through">
                ₹{product.market_price_max.toLocaleString('en-IN')}
              </span>)}
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <Link to={`/product/${product.id}`} className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-heritage-brown bg-heritage-sand/60 hover:bg-heritage-sand transition">
            Details
          </Link>
          <button onClick={handleAddToCart} className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all shadow-sm ${addedNotice
            ? 'bg-emerald-600 text-white'
            : 'bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white'}`}>
            {addedNotice ? (<>
                <CheckCircle className="w-3.5 h-3.5"/>
                <span>Added</span>
              </>) : (<>
                <ShoppingBag className="w-3.5 h-3.5"/>
                <span>Add</span>
              </>)}
          </button>
        </div>
      </div>
    </div>);
};
