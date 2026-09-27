import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, MessageSquare, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard3D } from '../../components/3d/ProductCard3D';
import { Avatar } from '../../components/common/Avatar';
export const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, products, addToCart, toggleWishlist, isInWishlist, sendMessage } = useApp();
    const product = getProductById(id || '');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [addedNotice, setAddedNotice] = useState(false);
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [inquiryText, setInquiryText] = useState('');
    const [inquirySent, setInquirySent] = useState(false);
    if (!product) {
        return (<div className="min-h-screen bg-heritage-ivory py-16 px-4 text-center">
        <h2 className="font-serif font-bold text-2xl text-heritage-brown">Craft Not Found</h2>
        <p className="text-xs text-heritage-charcoal/60 mt-2">This handicraft listing may have been moved or sold.</p>
        <Link to="/marketplace" className="mt-4 inline-block px-4 py-2 bg-heritage-terracotta text-white rounded-xl text-xs font-bold">
          Return to Marketplace
        </Link>
      </div>);
    }
    const wishlisted = isInWishlist(product.id);
    const moreFromArtisan = products.filter((p) => p.seller_id === product.seller_id && p.id !== product.id);
    const handleAddToCart = () => {
        addToCart(product, 1);
        setAddedNotice(true);
        setTimeout(() => setAddedNotice(false), 2000);
    };
    const handleBuyNow = () => {
        addToCart(product, 1);
        navigate('/buyer/checkout');
    };
    const handleSendInquiry = (e) => {
        e.preventDefault();
        if (!inquiryText.trim())
            return;
        sendMessage(product.seller_id, inquiryText.trim(), product.id, product.name);
        setInquirySent(true);
        setTimeout(() => {
            setInquirySent(false);
            setInquiryModalOpen(false);
            setInquiryText('');
        }, 1500);
    };
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation back */}
        <div>
          <Link to="/marketplace" className="inline-flex items-center text-xs font-bold text-heritage-brown hover:text-heritage-terracotta transition">
            <ArrowLeft className="w-4 h-4 mr-1.5"/>
            Back to Marketplace
          </Link>
        </div>

        {/* Product Showcase: Gallery (Left) vs Specs & Actions (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: IMAGE GALLERY (Section 25) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-heritage-terracotta/20 shadow-3d group">
              <img src={product.images[selectedImageIndex] || product.images[0]} alt={product.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105"/>

              <div className="absolute top-4 left-4 bg-heritage-brown/90 backdrop-blur-md text-heritage-gold-light text-xs font-bold px-3 py-1 rounded-full border border-heritage-gold/40 flex items-center space-x-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-heritage-gold"/>
                <span>Verified Craft Listing</span>
              </div>

              <button onClick={() => toggleWishlist(product.id)} className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition shadow-md ${wishlisted
            ? 'bg-heritage-terracotta text-white'
            : 'bg-white/80 text-heritage-brown hover:bg-white'}`}>
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`}/>
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (<div className="flex space-x-3">
                {product.images.map((img, idx) => (<button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${selectedImageIndex === idx
                    ? 'border-heritage-terracotta scale-105 shadow-md'
                    : 'border-heritage-sand opacity-70 hover:opacity-100'}`}>
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover"/>
                  </button>))}
              </div>)}
          </div>

          {/* RIGHT: SPECS & BUYER ACTIONS */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
                {product.category} &bull; {product.state}
              </span>
              <h1 className="font-serif font-black text-2xl sm:text-4xl text-heritage-brown mt-1 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mt-2.5">
                <div className="flex items-center space-x-1 text-amber-600">
                  <Star className="w-4 h-4 fill-current"/>
                  <span className="text-sm font-bold">{product.rating}</span>
                  <span className="text-xs text-heritage-charcoal/60">
                    ({product.review_count} verified reviews)
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  In Stock ({product.quantity} available)
                </span>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="p-5 rounded-2xl bg-white border border-heritage-terracotta/20 shadow-3d flex items-baseline justify-between">
              <div>
                <span className="text-xs text-heritage-charcoal/60 font-semibold block">
                  Artisan Direct Price
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-3xl font-black text-heritage-terracotta-dark">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.market_price_max > product.price && (<span className="text-sm text-heritage-charcoal/50 line-through">
                      ₹{product.market_price_max.toLocaleString('en-IN')}
                    </span>)}
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                  Free delivery across India on orders above ₹1,500
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-heritage-charcoal/50 block">
                  Craft Quality Score
                </span>
                <span className="text-lg font-black text-heritage-brown">
                  {product.quality_score} / 5.0
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-heritage-brown">
                Craft Heritage & Story
              </h3>
              <p className="text-xs sm:text-sm text-heritage-charcoal/80 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications Grid (Section 25) */}
            <div className="bg-white rounded-2xl p-5 border border-heritage-sand space-y-3">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-heritage-terracotta">
                Specifications & Provenance
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-heritage-charcoal/50 block">Raw Material</span>
                  <span className="font-bold text-heritage-brown">{product.material}</span>
                </div>
                <div>
                  <span className="text-[10px] text-heritage-charcoal/50 block">Traditional Style</span>
                  <span className="font-bold text-heritage-brown">{product.model_style}</span>
                </div>
                <div>
                  <span className="text-[10px] text-heritage-charcoal/50 block flex items-center">
                    Dimensions 
                    {product.is_dimensions_estimated && (<span className="ml-1 text-[9px] font-semibold text-emerald-700">(AI Estimated)</span>)}
                  </span>
                  <span className="font-bold text-heritage-brown">
                    {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-heritage-charcoal/50 block">Colorway</span>
                  <span className="font-bold text-heritage-brown">
                    {product.primary_color} {product.secondary_color ? `& ${product.secondary_color}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-heritage-charcoal/50 block">Crafting Duration</span>
                  <span className="font-bold text-heritage-brown">{product.crafting_time_days} days handwork</span>
                </div>
                <div>
                  <span className="text-[10px] text-heritage-charcoal/50 block">Geographic Origin</span>
                  <span className="font-bold text-heritage-brown">{product.city}, {product.state}</span>
                </div>
              </div>
            </div>

            {/* MANDATORY SECTION 25: ARTISAN PROFILE CARD */}
            <div className="bg-gradient-to-r from-heritage-sand/60 to-white rounded-2xl p-4 border border-heritage-gold/50 shadow-sm flex items-center justify-between">
              <Link to={`/artisan/${product.seller.username}`} className="flex items-center space-x-3 group">
                <Avatar src={product.seller.profile_image} name={product.seller.full_name} role="seller" size="md" className="border-2 border-heritage-gold shadow-sm shrink-0"/>
                <div>
                  <span className="text-[10px] font-bold text-heritage-terracotta uppercase tracking-wider block">
                    Sold by Master Artisan
                  </span>
                  <h4 className="font-serif font-bold text-sm text-heritage-brown group-hover:text-heritage-terracotta transition">
                    {product.seller.full_name}
                  </h4>
                  <p className="text-[11px] text-heritage-charcoal/70">
                    @{product.seller.username} &bull; {product.seller.city}, {product.seller.state}
                  </p>
                </div>
              </Link>

              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] font-bold bg-heritage-gold/20 text-heritage-brown border border-heritage-gold/40 px-2.5 py-0.5 rounded-full">
                  {product.seller.badge}
                </span>
                <button type="button" onClick={() => setInquiryModalOpen(true)} className="mt-2 text-xs font-bold text-heritage-terracotta hover:underline flex items-center">
                  <MessageSquare className="w-3.5 h-3.5 mr-1"/>
                  Contact Seller
                </button>
              </div>
            </div>

            {/* BUYER ACTION BUTTONS (Section 25) */}
            <div className="space-y-3 pt-2">
              {addedNotice && (<div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-700"/>
                  <span>Added to your cart!</span>
                </div>)}

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button type="button" onClick={handleAddToCart} className="w-full sm:flex-1 py-3.5 rounded-2xl bg-heritage-sand hover:bg-heritage-sand/80 text-heritage-brown font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-heritage-terracotta"/>
                  <span>Add to Cart</span>
                </button>

                <button type="button" onClick={handleBuyNow} className="w-full sm:flex-1 py-3.5 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-3d hover:shadow-3d-lg transition flex items-center justify-center space-x-2">
                  <span>Buy Now (Instant Checkout)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 25: MORE PRODUCTS FROM THIS ARTISAN */}
        {moreFromArtisan.length > 0 && (<div className="pt-10 border-t border-heritage-sand space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-2xl text-heritage-brown">
                  More Handcrafted Creations by {product.seller.full_name}
                </h3>
                <p className="text-xs text-heritage-charcoal/60 mt-0.5">
                  Explore other authentic pieces crafted in the same workshop.
                </p>
              </div>
              <Link to={`/artisan/${product.seller.username}`} className="text-xs font-bold text-heritage-terracotta hover:underline">
                View Artisan Studio &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreFromArtisan.slice(0, 4).map((p) => (<ProductCard3D key={p.id} product={p}/>))}
            </div>
          </div>)}

        {/* CONTACT SELLER MODAL */}
        {inquiryModalOpen && (<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-heritage-sand shadow-3d-lg space-y-4">
              <h3 className="font-serif font-bold text-xl text-heritage-brown">
                Send Inquiry to {product.seller.full_name}
              </h3>
              <p className="text-xs text-heritage-charcoal/70">
                Ask about custom dimensions, material inquiries, or gift packaging directly to the craftsperson.
              </p>

              {inquirySent ? (<div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
                  Message delivered to artisan's inbox!
                </div>) : (<form onSubmit={handleSendInquiry} className="space-y-4">
                  <textarea rows={4} required value={inquiryText} onChange={(e) => setInquiryText(e.target.value)} placeholder="Namaste, I am interested in this craft. Could you clarify..." className="w-full p-3 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                  <div className="flex items-center justify-end space-x-3">
                    <button type="button" onClick={() => setInquiryModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-heritage-charcoal/70 hover:bg-heritage-sand/40">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-heritage-terracotta text-white font-bold text-xs shadow-sm hover:bg-heritage-terracotta-dark">
                      Send Message
                    </button>
                  </div>
                </form>)}
            </div>
          </div>)}
      </div>
    </div>);
};
