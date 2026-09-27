import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Plus, Minus, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
export const CartPage = () => {
    const { cart, updateCartQuantity, removeFromCart, cartSubtotal, toggleWishlist } = useApp();
    const navigate = useNavigate();
    const deliveryFee = cartSubtotal > 1500 || cartSubtotal === 0 ? 0 : 99;
    const totalAmount = cartSubtotal + deliveryFee;
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-heritage-sand pb-4">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
              My Shopping Bag
            </h1>
            <p className="text-xs text-heritage-charcoal/70 mt-0.5">
              {cart.length} unique handcrafted items directly supporting rural artisan livelihoods.
            </p>
          </div>
          <Link to="/marketplace" className="text-xs font-bold text-heritage-terracotta hover:underline flex items-center">
            <ArrowLeft className="w-3.5 h-3.5 mr-1"/>
            Continue Browsing
          </Link>
        </div>

        {cart.length === 0 ? (<div className="bg-white rounded-3xl p-16 text-center border border-heritage-sand space-y-4 max-w-lg mx-auto shadow-3d">
            <div className="w-16 h-16 rounded-2xl bg-heritage-sand/60 text-heritage-terracotta flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8"/>
            </div>
            <h3 className="font-serif font-black text-2xl text-heritage-brown">
              Your cart is waiting for something handmade.
            </h3>
            <p className="text-xs text-heritage-charcoal/70 leading-relaxed">
              Every creation you choose preserves a family craft lineage and brings authentic Indian art into your living space.
            </p>
            <Link to="/marketplace" className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-heritage-terracotta text-white font-bold text-xs shadow-md hover:bg-heritage-terracotta-dark transition">
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>) : (<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CART ITEMS LIST (Section 26) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (<div key={item.product.id} className="bg-white rounded-3xl p-5 border border-heritage-sand shadow-3d flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 rounded-2xl object-cover border border-heritage-sand shadow-sm"/>
                    <div>
                      <span className="text-[10px] font-bold text-heritage-terracotta uppercase tracking-wider block">
                        Sold by {item.product.seller.full_name} (@{item.product.seller.username})
                      </span>
                      <Link to={`/product/${item.product.id}`} className="font-serif font-bold text-base text-heritage-brown hover:text-heritage-terracotta transition line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-heritage-charcoal/60 mt-0.5">
                        {item.product.material} &bull; {item.product.city}, {item.product.state}
                      </p>
                      <span className="text-xs font-bold text-heritage-terracotta mt-1 block">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 bg-heritage-sand/40 p-1 rounded-xl border border-heritage-sand">
                      <button type="button" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1.5 rounded-lg bg-white hover:bg-heritage-sand text-heritage-brown transition shadow-xs">
                        <Minus className="w-3.5 h-3.5"/>
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-heritage-brown">
                        {item.quantity}
                      </span>
                      <button type="button" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1.5 rounded-lg bg-white hover:bg-heritage-sand text-heritage-brown transition shadow-xs">
                        <Plus className="w-3.5 h-3.5"/>
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-heritage-brown block">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <button type="button" onClick={() => toggleWishlist(item.product.id)} className="text-[10px] font-semibold text-heritage-charcoal/60 hover:text-heritage-terracotta flex items-center">
                          <Heart className="w-3 h-3 mr-0.5"/> Save
                        </button>
                        <button type="button" onClick={() => removeFromCart(item.product.id)} className="text-[10px] font-semibold text-red-600 hover:underline flex items-center">
                          <Trash2 className="w-3 h-3 mr-0.5"/> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>))}
            </div>

            {/* ORDER SUMMARY (Section 26) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-heritage-terracotta/20 shadow-3d space-y-6">
              <h3 className="font-serif font-bold text-xl text-heritage-brown border-b border-heritage-sand pb-3">
                Order Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-heritage-charcoal/70">
                  <span>Subtotal</span>
                  <span className="font-bold text-heritage-brown">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-heritage-charcoal/70">
                  <span>Estimated Delivery</span>
                  <span className="font-bold text-emerald-700">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-heritage-charcoal/70">
                  <span>Direct Artisan Allocation</span>
                  <span className="font-bold text-heritage-brown">100%</span>
                </div>

                <div className="pt-3 border-t border-heritage-sand flex justify-between text-sm">
                  <span className="font-bold text-heritage-brown">Total Amount</span>
                  <span className="font-black text-xl text-heritage-terracotta-dark">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {cartSubtotal < 1500 && (<div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                  Add ₹{1500 - cartSubtotal} more of handicrafts to unlock <strong>FREE delivery</strong> across India!
                </div>)}

              <button type="button" onClick={() => navigate('/buyer/checkout')} className="w-full py-4 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-3d hover:shadow-3d-lg transition flex items-center justify-center space-x-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4"/>
              </button>

              <div className="pt-2 text-[10px] text-heritage-charcoal/60 space-y-1 text-center">
                <p>100% Secure Payment &bull; Instant Artisan Dispatch</p>
                <p>Protected by KARIGARSETU.AI Authenticity Guarantee</p>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
};
