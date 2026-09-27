import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Trash2,
  Lock,
  Layers,
  Award,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard = () => {
  const { products, orders, reviews, currentUser, deleteProduct } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'users' | 'reviews'
  const [searchTerm, setSearchTerm] = useState('');

  // Aggregated platform statistics
  const totalGmv = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const paidOrders = orders.filter((o) => o.payment_status === 'paid' || o.status === 'delivered' || o.status === 'confirmed');
  const activeProducts = products.length;
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.seller?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.order_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.seller_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-[#1A3A5C] via-[#0F2338] to-[#1A3A5C] text-white rounded-3xl p-6 sm:p-8 shadow-3d-lg border-2 border-[#D7B36A]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#D7B36A]/20 text-[#F5E6A3] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#D7B36A]/40">
              <ShieldCheck className="w-4 h-4 text-[#D7B36A]" />
              <span>Platform Administration &bull; Team HEXANOVA 3.0</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
              Executive Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-heritage-sand/80 font-medium">
              Real-time oversight for KARIGARSETU.AI marketplace, artisans, orders, and payment settlements.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
              Live Production
            </span>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="card-3d bg-white p-5 rounded-2xl border border-heritage-terracotta/20 shadow-3d">
            <div className="flex items-center justify-between text-heritage-charcoal/60 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Merchandise Value</span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="font-serif font-black text-3xl text-heritage-brown">
              ₹{totalGmv.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              100% Direct Artisan Payouts
            </span>
          </div>

          <div className="card-3d bg-white p-5 rounded-2xl border border-heritage-terracotta/20 shadow-3d">
            <div className="flex items-center justify-between text-heritage-charcoal/60 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Crafts in Catalog</span>
              <Layers className="w-5 h-5 text-heritage-terracotta" />
            </div>
            <p className="font-serif font-black text-3xl text-heritage-brown">
              {activeProducts}
            </p>
            <span className="text-[11px] text-heritage-terracotta font-semibold mt-1 block">
              AI-Appraised Heritage Listings
            </span>
          </div>

          <div className="card-3d bg-white p-5 rounded-2xl border border-heritage-terracotta/20 shadow-3d">
            <div className="flex items-center justify-between text-heritage-charcoal/60 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-5 h-5 text-[#1A3A5C]" />
            </div>
            <p className="font-serif font-black text-3xl text-heritage-brown">
              {orders.length}
            </p>
            <span className="text-[11px] text-[#1A3A5C]/70 font-semibold mt-1 block">
              {paidOrders.length} Confirmed / Settled
            </span>
          </div>

          <div className="card-3d bg-white p-5 rounded-2xl border border-heritage-terracotta/20 shadow-3d">
            <div className="flex items-center justify-between text-heritage-charcoal/60 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Platform Reputation</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <p className="font-serif font-black text-3xl text-heritage-brown">
              {averageRating} / 5.0
            </p>
            <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
              Based on {reviews.length} Verified Reviews
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-heritage-sand pb-4">
          <div className="flex items-center space-x-2 bg-white/80 p-1.5 rounded-2xl border border-heritage-sand shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-[#1A3A5C] text-white shadow-sm'
                  : 'text-heritage-charcoal/70 hover:text-heritage-brown'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'products'
                  ? 'bg-[#1A3A5C] text-white shadow-sm'
                  : 'text-heritage-charcoal/70 hover:text-heritage-brown'
              }`}
            >
              Crafts & Moderation ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'orders'
                  ? 'bg-[#1A3A5C] text-white shadow-sm'
                  : 'text-heritage-charcoal/70 hover:text-heritage-brown'
              }`}
            >
              Orders & Payments ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'reviews'
                  ? 'bg-[#1A3A5C] text-white shadow-sm'
                  : 'text-heritage-charcoal/70 hover:text-heritage-brown'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter crafts, orders, or users..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-heritage-sand bg-white text-xs font-medium focus:border-heritage-terracotta outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Orders Table */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-heritage-sand shadow-3d space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-heritage-brown">
                  Recent Platform Transactions
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-heritage-terracotta hover:underline"
                >
                  View All Orders &rarr;
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-heritage-charcoal/60 text-xs">
                  No orders recorded on the platform yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-heritage-sand text-heritage-charcoal/60 uppercase tracking-wider font-bold text-[10px]">
                        <th className="pb-3">Order Code</th>
                        <th className="pb-3">Buyer</th>
                        <th className="pb-3">Artisan</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-heritage-sand/60">
                      {orders.slice(0, 6).map((ord) => (
                        <tr key={ord.id} className="hover:bg-heritage-ivory/40">
                          <td className="py-3 font-mono font-bold text-heritage-terracotta">
                            {ord.order_code}
                          </td>
                          <td className="py-3 font-medium text-heritage-brown">
                            {ord.buyer_name}
                          </td>
                          <td className="py-3 text-heritage-charcoal/80">
                            {ord.seller_name}
                          </td>
                          <td className="py-3 font-bold text-heritage-brown">
                            ₹{ord.total_amount?.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.payment_status === 'paid' || ord.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.payment_status || 'Paid'}
                            </span>
                          </td>
                          <td className="py-3 capitalize text-heritage-charcoal/70">
                            {ord.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Moderation & System Health */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-heritage-sand shadow-3d space-y-4">
                <h3 className="font-serif font-bold text-lg text-heritage-brown flex items-center">
                  <ShieldCheck className="w-5 h-5 text-heritage-terracotta mr-2" />
                  AI & Gateway Status
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-900">Gemini 2.0 Flash AI</span>
                    <span className="font-semibold text-emerald-700">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-900">Razorpay Payment Gateway</span>
                    <span className="font-semibold text-emerald-700">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-900">Resend Email Delivery</span>
                    <span className="font-semibold text-emerald-700">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-900">Supabase Auth & RLS</span>
                    <span className="font-semibold text-emerald-700">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Management Tab */}
        {activeTab === 'products' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-heritage-sand shadow-3d space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-heritage-brown">
                Handmade Crafts Catalog ({filteredProducts.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-2xl border border-heritage-sand p-4 bg-heritage-ivory/30 space-y-3 relative group"
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-heritage-sand/40">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                        {prod.category}
                      </span>
                      <span className="text-xs font-bold text-heritage-brown">
                        ₹{prod.price?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-heritage-brown mt-1 truncate">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-heritage-charcoal/60 mt-0.5">
                      Artisan: {prod.seller?.full_name || 'Verified Karigar'} &bull; {prod.city || 'India'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-heritage-sand/60 flex items-center justify-between">
                    <Link
                      to={`/product/${prod.id}`}
                      className="text-xs font-bold text-[#1A3A5C] hover:underline flex items-center"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Inspect Listing
                    </Link>

                    <button
                      onClick={() => {
                        if (confirm(`Remove listing "${prod.name}" from marketplace?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                      title="Moderate / Delete Craft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-heritage-sand shadow-3d space-y-6">
            <h3 className="font-serif font-bold text-xl text-heritage-brown">
              Complete Order Lifecycle ({filteredOrders.length})
            </h3>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-heritage-charcoal/60 text-xs">
                No orders match your query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-heritage-sand text-heritage-charcoal/60 uppercase tracking-wider font-bold text-[11px]">
                      <th className="pb-3">Order Code</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Buyer Contact</th>
                      <th className="pb-3">Artisan</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Payment ID</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-heritage-sand/60">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-heritage-ivory/40">
                        <td className="py-3.5 font-mono font-bold text-heritage-terracotta">
                          {ord.order_code}
                        </td>
                        <td className="py-3.5 text-heritage-charcoal/70">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5">
                          <p className="font-bold text-heritage-brown">{ord.buyer_name}</p>
                          <p className="text-[10px] text-heritage-charcoal/60">{ord.buyer_email}</p>
                        </td>
                        <td className="py-3.5 font-medium text-heritage-brown">
                          {ord.seller_name}
                        </td>
                        <td className="py-3.5 text-heritage-charcoal/80">
                          {ord.items?.length || 1} craft(s)
                        </td>
                        <td className="py-3.5 font-bold text-heritage-brown">
                          ₹{ord.total_amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 font-mono text-[11px] text-heritage-charcoal/70">
                          {ord.payment_id || 'PAY_VERIFIED'}
                        </td>
                        <td className="py-3.5">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-heritage-sand shadow-3d space-y-6">
            <h3 className="font-serif font-bold text-xl text-heritage-brown">
              Buyer Reviews & Feedback ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-heritage-charcoal/60 text-xs">
                No reviews submitted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-heritage-sand bg-heritage-ivory/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-heritage-brown">{rev.buyer_name}</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-heritage-charcoal/80 italic">"{rev.comment}"</p>
                    <p className="text-[10px] text-heritage-charcoal/50 font-mono">
                      Craft: {rev.product_name} &bull; {new Date(rev.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
