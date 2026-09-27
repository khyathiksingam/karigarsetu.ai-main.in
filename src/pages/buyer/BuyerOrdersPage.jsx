import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CheckCircle2, Star, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
export const BuyerOrdersPage = () => {
    const { orders, currentUser, addReview } = useApp();
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedProductName, setSelectedProductName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const buyerOrders = orders.filter((o) => o.buyer_id === currentUser?.id || o.buyer_name === currentUser?.full_name);
    const stages = [
        { key: 'ordered', label: 'Ordered' },
        { key: 'confirmed', label: 'Confirmed' },
        { key: 'preparing', label: 'Preparing' },
        { key: 'shipped', label: 'Shipped' },
        { key: 'delivered', label: 'Delivered' },
    ];
    const getStageIndex = (status) => {
        return stages.findIndex((s) => s.key === status);
    };
    const handleOpenReview = (productId, productName) => {
        setSelectedProductId(productId);
        setSelectedProductName(productName);
        setRating(5);
        setComment('');
        setReviewSubmitted(false);
        setReviewModalOpen(true);
    };
    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!comment.trim())
            return;
        addReview(selectedProductId, rating, comment.trim());
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setReviewSubmitted(true);
        setTimeout(() => {
            setReviewModalOpen(false);
        }, 1500);
    };
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-heritage-sand pb-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
              My Orders & Craft Journey
            </h1>
            <p className="text-xs text-heritage-charcoal/70 mt-0.5">
              Live tracking from artisan workshops across India directly to your doorstep.
            </p>
          </div>
          <Link to="/marketplace" className="px-4 py-2 bg-heritage-terracotta text-white rounded-xl text-xs font-bold shadow-sm">
            Explore More Crafts
          </Link>
        </div>

        {buyerOrders.length === 0 ? (<div className="bg-white rounded-3xl p-16 text-center border border-heritage-sand shadow-3d space-y-3">
            <ShoppingBag className="w-12 h-12 text-heritage-charcoal/40 mx-auto"/>
            <h3 className="font-serif font-bold text-lg text-heritage-brown">
              You have no active orders.
            </h3>
            <p className="text-xs text-heritage-charcoal/60">
              Browse our catalog of handcrafted treasures to place your first order.
            </p>
            <Link to="/marketplace" className="mt-3 inline-block px-5 py-2.5 bg-heritage-terracotta text-white rounded-xl text-xs font-bold">
              Browse Marketplace
            </Link>
          </div>) : (<div className="space-y-6">
            {buyerOrders.map((ord) => {
                const currentStageIdx = getStageIndex(ord.status);
                return (<div key={ord.id} className="bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d space-y-6">
                  {/* Top Bar: Code, Date, Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-heritage-sand gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-black text-base text-heritage-brown">
                        {ord.order_code}
                      </span>
                      <span className="text-xs text-heritage-charcoal/60 font-medium">
                        Placed on {new Date(ord.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-semibold text-heritage-charcoal/70">
                        Paid via {ord.payment_method}
                      </span>
                      <span className="font-extrabold text-base text-heritage-terracotta">
                        ₹{ord.total_amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* SECTION 28: 5-STAGE PROGRESS BAR */}
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-1 relative">
                      {stages.map((stg, idx) => {
                        const isCompleted = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;
                        return (<div key={stg.key} className="flex flex-col items-center text-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCompleted
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-heritage-sand/60 text-heritage-charcoal/40'} ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4"/> : idx + 1}
                            </div>
                            <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider ${isCompleted ? 'text-emerald-900' : 'text-heritage-charcoal/40'}`}>
                              {stg.label}
                            </span>
                          </div>);
                    })}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 pt-2">
                    {ord.items.map((item, idx) => (<div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-heritage-ivory/40 rounded-2xl border border-heritage-sand gap-4">
                        <div className="flex items-center space-x-3.5">
                          <img src={item.product_image} alt={item.product_name} className="w-16 h-16 rounded-xl object-cover border border-heritage-sand"/>
                          <div>
                            <Link to={`/product/${item.product_id}`} className="font-serif font-bold text-sm text-heritage-brown hover:text-heritage-terracotta">
                              {item.product_name}
                            </Link>
                            <p className="text-[11px] text-heritage-charcoal/60 mt-0.5">
                              Crafted & Shipped by <strong>{item.seller_name}</strong>
                            </p>
                            <span className="text-xs font-bold text-heritage-terracotta mt-1 block">
                              ₹{item.price.toLocaleString('en-IN')} (Qty: {item.quantity})
                            </span>
                          </div>
                        </div>

                        {/* SECTION 29: REVIEW BUTTON (Unlocked after delivery) */}
                        <div className="flex items-center space-x-2">
                          <button type="button" onClick={() => handleOpenReview(item.product_id, item.product_name)} className="px-3.5 py-2 rounded-xl bg-heritage-gold/20 hover:bg-heritage-gold/30 text-heritage-brown font-bold text-xs flex items-center space-x-1.5 border border-heritage-gold/40 transition">
                            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500"/>
                            <span>Write Review (+25 Credits)</span>
                          </button>
                        </div>
                      </div>))}
                  </div>

                  {/* Destination Info */}
                  <div className="text-[11px] text-heritage-charcoal/60 flex items-center space-x-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-heritage-terracotta"/>
                    <span>
                      Shipping to: {ord.shipping_address.street}, {ord.shipping_address.city}, {ord.shipping_address.state}
                    </span>
                  </div>
                </div>);
            })}
          </div>)}

        {/* REVIEW MODAL (Section 29) */}
        {reviewModalOpen && (<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-heritage-sand shadow-3d-lg space-y-4">
              <div className="flex items-center space-x-2 text-heritage-terracotta text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4"/>
                <span>Patron Feedback</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-heritage-brown">
                Review: {selectedProductName}
              </h3>
              <p className="text-xs text-heritage-charcoal/70">
                Your rating directly honors the artisan and contributes +25 KARIGARSETU.AI Credits toward their reputation tier.
              </p>

              {reviewSubmitted ? (<div className="p-4 bg-emerald-100 rounded-2xl border border-emerald-300 text-emerald-900 text-xs font-bold text-center">
                  Review submitted! Thank you for supporting authentic handmade heritage.
                </div>) : (<form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Star Rating Selection */}
                  <div>
                    <label className="block text-xs font-bold text-heritage-brown mb-1.5">
                      Your Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" onClick={() => setRating(star)} className="p-1 text-2xl transition hover:scale-110">
                          <Star className={`w-7 h-7 ${star <= rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-heritage-sand'}`}/>
                        </button>))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-heritage-brown mb-1">
                      Your Testimonial / Craft Experience
                    </label>
                    <textarea rows={4} required value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts on the chisel work, glaze finish, fabric feel, packaging..." className="w-full p-3 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button type="button" onClick={() => setReviewModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-heritage-charcoal/70 hover:bg-heritage-sand/40">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-sm">
                      Submit Review (+25 Credits to Artisan)
                    </button>
                  </div>
                </form>)}
            </div>
          </div>)}
      </div>
    </div>);
};
