import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Star, MapPin, Sparkles, ShoppingBag, MessageSquare, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard3D } from '../../components/3d/ProductCard3D';
import { Avatar } from '../../components/common/Avatar';
export const ArtisanProfilePage = () => {
    const { username } = useParams();
    const { products, reviews, currentUser, sendMessage } = useApp();
    const artisan = products.find((product) => product.seller?.username === username || product.seller_id === username)?.seller || (currentUser?.role === 'seller' ? currentUser : null);
    const [activeTab, setActiveTab] = useState('products');
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const [inquiryText, setInquiryText] = useState('');
    const [inquirySent, setInquirySent] = useState(false);
    const artisanProducts = artisan ? products.filter((p) => p.seller_id === artisan.id || p.seller?.username === artisan.username) : [];
    const artisanReviews = artisan ? reviews.filter((r) => r.seller_id === artisan.id) : [];
    const handleSendInquiry = (e) => {
        e.preventDefault();
        if (!inquiryText.trim())
            return;
        sendMessage(artisan.id, inquiryText.trim());
        setInquirySent(true);
        setTimeout(() => {
            setInquirySent(false);
            setInquiryModalOpen(false);
            setInquiryText('');
        }, 1500);
    };
    if (!artisan) {
      return <div className="min-h-screen bg-heritage-ivory py-16 text-center text-heritage-brown">Artisan profile not found.</div>;
    }
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link to="/marketplace" className="inline-flex items-center text-xs font-bold text-heritage-brown hover:text-heritage-terracotta transition">
            <ArrowLeft className="w-4 h-4 mr-1.5"/>
            Back to Marketplace
          </Link>
        </div>

        {/* SECTION 20: PUBLIC ARTISAN PROFILE HERO */}
        <div className="bg-gradient-to-r from-heritage-brown via-heritage-brown-dark to-heritage-terracotta text-white rounded-3xl p-6 sm:p-10 border-2 border-heritage-gold shadow-3d-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar with Badge Ring */}
            <div className="relative">
              <Avatar src={artisan.profile_image} name={artisan.full_name} role="seller" size="xl" className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 border-heritage-gold shadow-lg"/>
              <span className="absolute -bottom-2 -right-2 bg-heritage-gold text-heritage-brown p-2 rounded-2xl shadow-md">
                <Award className="w-5 h-5"/>
              </span>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left flex-1 space-y-2">
              <div className="inline-flex items-center space-x-2 bg-heritage-gold/20 text-heritage-gold-light px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-heritage-gold"/>
                <span>Verified Karigar &bull; {artisan.badge}</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
                {artisan.full_name}
              </h1>

              <p className="text-sm font-semibold text-heritage-terracotta-light">
                @{artisan.username} &bull; {artisan.craft_specialization}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-heritage-sand/80 pt-1">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-heritage-terracotta"/>
                  {artisan.city}, {artisan.state}
                </span>
                <span className="flex items-center text-heritage-gold font-bold">
                  <Star className="w-3.5 h-3.5 fill-current mr-1 text-heritage-gold"/>
                  {artisan.rating} ({artisan.review_count || 36} reviews)
                </span>
                <span className="flex items-center">
                  <ShoppingBag className="w-3.5 h-3.5 mr-1"/>
                  {artisan.sales_count || 18} Crafts Sold
                </span>
              </div>

              <p className="text-xs sm:text-sm text-heritage-sand/90 font-medium max-w-2xl pt-2 leading-relaxed">
                {artisan.bio}
              </p>
            </div>

            {/* Credits Card Display (Section 20: 1,250 KARIGARSETU CREDITS) */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-heritage-gold/40 text-center shrink-0 w-full md:w-56 space-y-3">
              <div>
                <span className="text-3xl sm:text-4xl font-black font-serif text-heritage-gold-light block">
                  {artisan.credits.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-heritage-sand/80 block mt-0.5">
                  KARIGARSETU CREDITS
                </span>
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30 uppercase">
                {artisan.badge}
              </span>

              <button onClick={() => setInquiryModalOpen(true)} className="w-full py-2.5 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5">
                <MessageSquare className="w-4 h-4"/>
                <span>Contact Artisan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-3 border-b border-heritage-sand pb-3">
          <button onClick={() => setActiveTab('products')} className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition ${activeTab === 'products'
            ? 'bg-heritage-terracotta text-white shadow-sm'
            : 'bg-white text-heritage-brown hover:bg-heritage-sand/60'}`}>
            Handcrafted Catalog ({artisanProducts.length})
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition ${activeTab === 'reviews'
            ? 'bg-heritage-terracotta text-white shadow-sm'
            : 'bg-white text-heritage-brown hover:bg-heritage-sand/60'}`}>
            Patron Reviews ({artisanReviews.length})
          </button>
        </div>

        {/* TAB 1: ARTISAN PRODUCTS */}
        {activeTab === 'products' && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artisanProducts.map((prod) => (<ProductCard3D key={prod.id} product={prod}/>))}
          </div>)}

        {/* TAB 2: REVIEWS */}
        {activeTab === 'reviews' && (<div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sand shadow-3d space-y-6">
            <h3 className="font-serif font-bold text-xl text-heritage-brown">
              Verified Patron Testimonials
            </h3>

            <div className="space-y-4">
              {artisanReviews.map((rev) => (<div key={rev.id} className="p-4 rounded-2xl bg-heritage-ivory/50 border border-heritage-sand space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-heritage-brown">
                        {rev.buyer_name}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    </div>
                    <div className="flex text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-current"/>))}
                    </div>
                  </div>

                  <p className="text-xs text-heritage-charcoal/80 leading-relaxed font-medium">
                    "{rev.comment}"
                  </p>

                  <span className="text-[10px] text-heritage-charcoal/50 block">
                    Product: {rev.product_name}
                  </span>
                </div>))}
            </div>
          </div>)}

        {/* INQUIRY MODAL */}
        {inquiryModalOpen && (<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-heritage-sand shadow-3d-lg space-y-4">
              <h3 className="font-serif font-bold text-xl text-heritage-brown">
                Send Direct Message to {artisan.full_name}
              </h3>
              <p className="text-xs text-heritage-charcoal/70">
                Connect directly with this craftsperson for bespoke commissions or bulk orders.
              </p>

              {inquirySent ? (<div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
                  Message sent! You can follow the conversation in Messages.
                </div>) : (<form onSubmit={handleSendInquiry} className="space-y-4">
                  <textarea rows={4} required value={inquiryText} onChange={(e) => setInquiryText(e.target.value)} placeholder="Namaste, I am interested in custom crafts or have a query..." className="w-full p-3 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
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
