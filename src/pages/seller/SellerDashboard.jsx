import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scan, Layers, PlusCircle, ShoppingBag, Award, TrendingUp, Eye, Star, ArrowRight, IndianRupee, CheckCircle2, Package, Camera, Upload, Building2, ShieldCheck, Tag, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CreditBadgeRadial } from '../../components/3d/CreditBadgeRadial';
import { Avatar } from '../../components/common/Avatar';
export const SellerDashboard = () => {
    const { currentUser, products, orders, creditTransactions, logout, updateUserProfile, coupons } = useApp();
    const avatarInputRef = React.useRef(null);
    const [photoUpdatedToast, setPhotoUpdatedToast] = React.useState(false);
    const navigate = useNavigate();
    const sellerProducts = products.filter((p) => p.seller_id === currentUser?.id);
    const sellerOrders = orders.filter((o) => o.seller_id === currentUser?.id);
    const totalEarnings = sellerOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const totalViews = sellerProducts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
    const productsSold = Number(currentUser?.sales_count ?? sellerOrders.length ?? 0);
    const handleAvatarFile = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newImage = event.target.result;
                    updateUserProfile({ profile_image: newImage });
                    setPhotoUpdatedToast(true);
                    setTimeout(() => setPhotoUpdatedToast(false), 3000);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Photo Update Success Banner */}
        {photoUpdatedToast && (<div className="p-3 bg-emerald-700 text-white rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300"/>
              <span>Artisan Profile Photo Updated Successfully! Reflected across KARIGARSETU.AI.</span>
            </div>
            <button onClick={() => setPhotoUpdatedToast(false)} className="text-emerald-200 hover:text-white">&times;</button>
          </div>)}

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-heritage-brown via-heritage-brown-dark to-heritage-terracotta text-white rounded-3xl p-6 sm:p-8 shadow-3d-lg border-2 border-heritage-gold/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative group cursor-pointer" title="Click to change profile picture" onClick={() => avatarInputRef.current?.click()}>
              <Avatar src={currentUser?.profile_image} name={currentUser?.full_name} role={currentUser?.role || 'seller'} size="xl" className="rounded-2xl border-2 border-heritage-gold shadow-md group-hover:opacity-85 transition overflow-hidden"/>
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition text-white">
                <Camera className="w-5 h-5"/>
                <span className="text-[9px] font-bold mt-0.5">Edit</span>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-heritage-terracotta text-white p-1 rounded-full shadow-sm">
                <Upload className="w-2.5 h-2.5"/>
              </span>
              <input type="file" ref={avatarInputRef} accept="image/*" className="hidden" onChange={handleAvatarFile}/>
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 bg-heritage-gold/20 text-heritage-gold-light px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5 border border-heritage-gold/30">
                <img src="/assets/karigarsetu-ai-logo.png" alt="KARIGARSETU.AI" className="w-5 h-5 rounded-full object-contain"/>
                <span>Verified Artisan &bull; {currentUser?.badge}</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
                Welcome, {currentUser?.full_name || 'Artisan'}
              </h1>
              <p className="text-xs sm:text-sm text-heritage-sand/80 font-medium mt-0.5">
                {currentUser?.craft_specialization || 'New Artisan'} &bull; {currentUser?.city || 'Your city'}, {currentUser?.state || 'Your state'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/seller/ai-analyzer" className="px-5 py-3 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md flex items-center space-x-2 transition hover:scale-102">
              <Scan className="w-4 h-4"/>
              <span>AI Product Analyzer</span>
            </Link>
            <Link to="/seller/products/new" className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-heritage-gold-light border border-heritage-gold/40 font-bold text-xs transition">
              <PlusCircle className="w-4 h-4 inline mr-1.5"/>
              Add Craft
            </Link>
          </div>
        </div>

        {/* SECTION 12: SIX MANDATORY STATISTICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 1. Total Products */}
          <div className="card-3d bg-white p-4 sm:p-5 rounded-2xl border border-heritage-terracotta/20 shadow-3d flex flex-col justify-between">
            <div className="flex items-center justify-between text-heritage-charcoal/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">Products</span>
              <Layers className="w-4 h-4 text-heritage-terracotta"/>
            </div>
            <p className="font-serif font-black text-2xl sm:text-3xl text-heritage-brown mt-3">
              {sellerProducts.length}
            </p>
            <span className="text-[10px] text-heritage-green-light font-semibold mt-1">
              Active in Catalog
            </span>
          </div>

          {/* 2. Products Sold */}
          <div className="card-3d bg-white p-4 sm:p-5 rounded-2xl border border-heritage-terracotta/20 shadow-3d flex flex-col justify-between">
            <div className="flex items-center justify-between text-heritage-charcoal/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">Sold</span>
              <ShoppingBag className="w-4 h-4 text-heritage-gold-dark"/>
            </div>
            <p className="font-serif font-black text-2xl sm:text-3xl text-heritage-brown mt-3">
              {productsSold}
            </p>
            <span className="text-[10px] text-heritage-terracotta font-semibold mt-1">
              Lifetime Delivered
            </span>
          </div>

          {/* 3. Earnings */}
          <div className="card-3d bg-white p-4 sm:p-5 rounded-2xl border border-heritage-terracotta/20 shadow-3d flex flex-col justify-between">
            <div className="flex items-center justify-between text-heritage-charcoal/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">Earnings</span>
              <IndianRupee className="w-4 h-4 text-emerald-600"/>
            </div>
            <p className="font-serif font-black text-2xl sm:text-3xl text-emerald-700 mt-3">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1">
              100% Direct Payout
            </span>
          </div>

          {/* 4. Credits */}
          <div className="card-3d bg-white p-4 sm:p-5 rounded-2xl border border-heritage-gold/40 shadow-3d flex flex-col justify-between">
            <div className="flex items-center justify-between text-heritage-charcoal/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">Credits</span>
              <Award className="w-4 h-4 text-heritage-gold-dark"/>
            </div>
            <p className="font-serif font-black text-2xl sm:text-3xl text-heritage-terracotta mt-3">
              {Number(currentUser?.credits ?? 0)}
            </p>
            <span className="text-[10px] text-heritage-gold-dark font-semibold mt-1">
              {currentUser?.badge || 'New Artisan'}
            </span>
          </div>

          {/* 5. Rating */}
          <div className="card-3d bg-white p-4 sm:p-5 rounded-2xl border border-heritage-terracotta/20 shadow-3d flex flex-col justify-between">
            <div className="flex items-center justify-between text-heritage-charcoal/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">Rating</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500"/>
            </div>
            <p className="font-serif font-black text-2xl sm:text-3xl text-heritage-brown mt-3">
              {(Number(currentUser?.rating ?? 5.0)).toFixed(1)}★
            </p>
            <span className="text-[10px] text-amber-700 font-semibold mt-1">
              Based on {Number(currentUser?.review_count ?? 0)} reviews
            </span>
          </div>

          {/* 6. Product Views */}
          <div className="card-3d bg-white p-4 sm:p-5 rounded-2xl border border-heritage-terracotta/20 shadow-3d flex flex-col justify-between">
            <div className="flex items-center justify-between text-heritage-charcoal/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">Views</span>
              <Eye className="w-4 h-4 text-heritage-brown"/>
            </div>
            <p className="font-serif font-black text-2xl sm:text-3xl text-heritage-brown mt-3">
              {totalViews.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-heritage-green font-semibold mt-1">
              High Buyer Interest
            </span>
          </div>
        </div>

        {/* Dashboard Navigation Grid */}
        <div className="bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d">
          <h2 className="text-xs font-bold text-heritage-terracotta uppercase tracking-wider mb-4">
            Artisan Management Suite
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Link to="/seller/ai-analyzer" className="p-4 rounded-2xl bg-heritage-sand/40 hover:bg-heritage-sand hover:border-heritage-terracotta border border-heritage-sand transition flex flex-col items-center text-center group">
              <div className="w-10 h-10 rounded-xl bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Scan className="w-5 h-5"/>
              </div>
              <span className="text-xs font-bold text-heritage-brown">AI Analyzer</span>
              <span className="text-[10px] text-heritage-charcoal/60 mt-0.5">Appraise & Price</span>
            </Link>

            <Link to="/seller/products" className="p-4 rounded-2xl bg-heritage-sand/40 hover:bg-heritage-sand hover:border-heritage-terracotta border border-heritage-sand transition flex flex-col items-center text-center group">
              <div className="w-10 h-10 rounded-xl bg-heritage-brown/10 text-heritage-brown flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5"/>
              </div>
              <span className="text-xs font-bold text-heritage-brown">My Products</span>
              <span className="text-[10px] text-heritage-charcoal/60 mt-0.5">Edit & Stock</span>
            </Link>

            <Link to="/seller/orders" className="p-4 rounded-2xl bg-heritage-sand/40 hover:bg-heritage-sand hover:border-heritage-terracotta border border-heritage-sand transition flex flex-col items-center text-center group">
              <div className="w-10 h-10 rounded-xl bg-emerald-700/10 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5"/>
              </div>
              <span className="text-xs font-bold text-heritage-brown">Orders ({sellerOrders.length})</span>
              <span className="text-[10px] text-heritage-charcoal/60 mt-0.5">Fulfill & Track</span>
            </Link>

            <Link to="/seller/credits" className="p-4 rounded-2xl bg-heritage-sand/40 hover:bg-heritage-sand hover:border-heritage-terracotta border border-heritage-sand transition flex flex-col items-center text-center group">
              <div className="w-10 h-10 rounded-xl bg-heritage-gold/20 text-heritage-brown flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5"/>
              </div>
              <span className="text-xs font-bold text-heritage-brown">Karigar Credits</span>
              <span className="text-[10px] text-heritage-charcoal/60 mt-0.5">Badges & Ledger</span>
            </Link>

            <Link to="/seller/analytics" className="p-4 rounded-2xl bg-heritage-sand/40 hover:bg-heritage-sand hover:border-heritage-terracotta border border-heritage-sand transition flex flex-col items-center text-center group">
              <div className="w-10 h-10 rounded-xl bg-purple-700/10 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5"/>
              </div>
              <span className="text-xs font-bold text-heritage-brown">Analytics</span>
              <span className="text-[10px] text-heritage-charcoal/60 mt-0.5">Trends & Insights</span>
            </Link>
          </div>
        </div>

        {/* Main 2-Column Split: Active Orders vs Credit Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recent Orders Fulfillment */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-heritage-brown">
                  Recent Customer Orders
                </h3>
                <p className="text-xs text-heritage-charcoal/70">
                  Manage shipments and mark orders completed to claim Karigar Credits.
                </p>
              </div>
              <Link to="/seller/orders" className="text-xs font-bold text-heritage-terracotta hover:underline flex items-center">
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1"/>
              </Link>
            </div>

            {sellerOrders.length === 0 ? (<div className="text-center py-12 bg-heritage-ivory/50 rounded-2xl border border-dashed border-heritage-sand">
                <Package className="w-10 h-10 text-heritage-charcoal/40 mx-auto mb-2"/>
                <p className="text-sm font-bold text-heritage-brown">Your orders will appear here.</p>
                <p className="text-xs text-heritage-charcoal/60 mt-1">Publish more crafts with AI to attract buyers.</p>
              </div>) : (<div className="space-y-3">
                {sellerOrders.slice(0, 3).map((ord) => (<div key={ord.id} className="p-4 rounded-2xl border border-heritage-sand bg-heritage-ivory/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img src={ord.items[0]?.product_image} alt="Product" className="w-14 h-14 rounded-xl object-cover border border-heritage-sand shadow-sm"/>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold font-mono text-heritage-brown">
                            {ord.order_code}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ord.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ord.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'}`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-heritage-charcoal mt-1 line-clamp-1">
                          {ord.items[0]?.product_name}
                        </p>
                        <p className="text-[11px] text-heritage-charcoal/60">
                          Buyer: {ord.buyer_name} &bull; {ord.shipping_address.city}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                      <span className="font-extrabold text-sm text-heritage-terracotta">
                        ₹{ord.total_amount.toLocaleString('en-IN')}
                      </span>
                      <Link to="/seller/orders" className="text-xs font-bold text-heritage-brown bg-heritage-sand/60 px-3 py-1.5 rounded-lg hover:bg-heritage-sand transition mt-1">
                        Manage Status
                      </Link>
                    </div>
                  </div>))}
              </div>)}
          </div>

          {/* Right Column: 3D Radial Credits Widget */}
          <div className="lg:col-span-4 bg-gradient-to-b from-white to-heritage-sand/30 rounded-3xl p-6 border border-heritage-gold/40 shadow-3d flex flex-col items-center justify-between">
            <div className="w-full text-center pb-2 border-b border-heritage-sand">
              <h3 className="font-serif font-bold text-lg text-heritage-brown">
                KarigarSetu Reputation
              </h3>
              <p className="text-xs text-heritage-charcoal/60">
                Official Artisan Standing
              </p>
            </div>

            <div className="my-6">
              <CreditBadgeRadial credits={Number(currentUser?.credits ?? 0)} badge={currentUser?.badge || 'New Artisan'} size="lg"/>
            </div>

            <div className="w-full bg-white p-3.5 rounded-2xl border border-heritage-sand text-xs space-y-1.5">
              <div className="flex justify-between font-medium text-heritage-charcoal/70">
                <span>Product Published</span>
                <span className="font-bold text-emerald-700">+50 Credits</span>
              </div>
              <div className="flex justify-between font-medium text-heritage-charcoal/70">
                <span>Completed Sale</span>
                <span className="font-bold text-emerald-700">+100 Credits</span>
              </div>
              <div className="flex justify-between font-medium text-heritage-charcoal/70">
                <span>5-Star Review</span>
                <span className="font-bold text-emerald-700">+25 Credits</span>
              </div>
            </div>

            <Link to="/seller/credits" className="mt-4 text-xs font-bold text-heritage-terracotta hover:underline">
              View Full Credit History & Milestones &rarr;
            </Link>
          </div>
        </div>

        {/* FINANCIALS & STORE PROMOTIONS: BANK DETAILS & COUPONS WIDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Details & Payout Status Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-heritage-terracotta/20 shadow-3d space-y-4">
            <div className="flex items-center justify-between border-b border-heritage-sand pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Building2 className="w-4 h-4"/>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-heritage-brown">
                    Direct Bank Settlement
                  </h3>
                  <p className="text-[11px] text-heritage-charcoal/60">
                    Direct-to-bank escrow payments via ONDC & NPCI
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600"/>
                <span>PFMS Verified</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-heritage-ivory/50 rounded-xl border border-heritage-sand">
                <span className="text-[10px] text-heritage-charcoal/60 block font-semibold">Bank Name</span>
                <span className="font-bold text-heritage-brown">
                  {currentUser?.bank_details?.bank_name || 'State Bank of India'}
                </span>
              </div>

              <div className="p-3 bg-heritage-ivory/50 rounded-xl border border-heritage-sand">
                <span className="text-[10px] text-heritage-charcoal/60 block font-semibold">Account Number</span>
                <span className="font-mono font-bold text-heritage-brown">
                  {currentUser?.bank_details?.account_number ? `••••••••${currentUser.bank_details.account_number.slice(-4)}` : 'Not added yet'}
                </span>
              </div>

              <div className="p-3 bg-heritage-ivory/50 rounded-xl border border-heritage-sand">
                <span className="text-[10px] text-heritage-charcoal/60 block font-semibold">IFSC Code</span>
                <span className="font-mono font-bold text-heritage-brown">
                  {currentUser?.bank_details?.ifsc_code || 'Not added yet'}
                </span>
              </div>

              <div className="p-3 bg-heritage-ivory/50 rounded-xl border border-heritage-sand">
                <span className="text-[10px] text-heritage-charcoal/60 block font-semibold">Artisan UPI ID</span>
                <span className="font-mono font-bold text-heritage-brown truncate block">
                  {currentUser?.bank_details?.upi_id || 'Not added yet'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-700 font-semibold flex items-center">
                <FileCheck className="w-3.5 h-3.5 mr-1"/>
                <span>Passbook / Cheque Uploaded</span>
              </span>
              <Link to="/seller/profile" className="text-xs font-bold text-heritage-terracotta hover:underline flex items-center">
                <span>Edit Bank Details & Cheque &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Store Coupons & Vouchers Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-heritage-terracotta/20 shadow-3d space-y-4">
            <div className="flex items-center justify-between border-b border-heritage-sand pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Tag className="w-4 h-4"/>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-heritage-brown">
                    Store Coupons & Vouchers
                  </h3>
                  <p className="text-[11px] text-heritage-charcoal/60">
                    Active promotional discounts redeemable by buyers at checkout
                  </p>
                </div>
              </div>

              <Link to="/seller/profile" className="text-[11px] font-bold text-heritage-terracotta hover:underline">
                + New Voucher
              </Link>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {coupons.slice(0, 3).map((c) => (<div key={c.id} className="p-2.5 rounded-xl bg-heritage-ivory/40 border border-heritage-sand flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-heritage-brown text-heritage-gold font-mono font-bold text-[11px]">
                      {c.code}
                    </span>
                    <span className="text-[11px] text-heritage-charcoal font-medium line-clamp-1">
                      {c.description}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700 shrink-0">
                    {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                  </span>
                </div>))}
            </div>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-[11px] text-heritage-charcoal/60">
                {coupons.length} promotional vouchers active
              </span>
              <Link to="/seller/profile" className="font-bold text-heritage-terracotta hover:underline flex items-center">
                <span>Manage All Store Coupons &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
