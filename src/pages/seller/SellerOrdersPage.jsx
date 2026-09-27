import React, { useState } from 'react';
import { ShoppingBag, MapPin, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
export const SellerOrdersPage = () => {
    const { orders, currentUser, updateOrderStatus } = useApp();
    const [activeTab, setActiveTab] = useState('all');
    const sellerOrders = orders.filter((o) => o.seller_id === currentUser?.id);
    const filteredOrders = activeTab === 'all'
        ? sellerOrders
        : sellerOrders.filter((o) => o.status === activeTab);
    const handleStatusTransition = (orderId, currentStatus) => {
        let nextStatus = 'confirmed';
        if (currentStatus === 'ordered')
            nextStatus = 'confirmed';
        else if (currentStatus === 'confirmed')
            nextStatus = 'preparing';
        else if (currentStatus === 'preparing')
            nextStatus = 'shipped';
        else if (currentStatus === 'shipped')
            nextStatus = 'delivered';
        updateOrderStatus(orderId, nextStatus);
    };
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-heritage-terracotta mb-1">
              <ShoppingBag className="w-3.5 h-3.5"/>
              <span>Fulfillment Dashboard</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
              Customer Orders & Dispatch
            </h1>
            <p className="text-xs text-heritage-charcoal/70 mt-0.5">
              Fulfill buyer orders directly and earn Karigar Credits upon successful delivery.
            </p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-2 border-b border-heritage-sand overflow-x-auto pb-2">
          {['all', 'confirmed', 'preparing', 'shipped', 'delivered'].map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${activeTab === tab
                ? 'bg-heritage-terracotta text-white shadow-sm'
                : 'bg-white text-heritage-charcoal/70 hover:bg-heritage-sand/60'}`}>
              {tab === 'all' ? `All Orders (${sellerOrders.length})` : tab}
            </button>))}
        </div>

        {/* Orders Listing */}
        {filteredOrders.length === 0 ? (<div className="bg-white rounded-3xl p-12 text-center border border-heritage-sand">
            <ShoppingBag className="w-12 h-12 text-heritage-charcoal/40 mx-auto mb-3"/>
            <h3 className="font-serif font-bold text-lg text-heritage-brown">
              No orders found in this status.
            </h3>
            <p className="text-xs text-heritage-charcoal/60 mt-1">
              Check other tabs or analyze new products to increase your sales.
            </p>
          </div>) : (<div className="space-y-4">
            {filteredOrders.map((ord) => (<div key={ord.id} className="bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d space-y-4">
                {/* Top Row: Code, Date, Total */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-heritage-sand gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-sm text-heritage-brown">
                      {ord.order_code}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${ord.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ord.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'}`}>
                      Status: {ord.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-heritage-charcoal/60 block">Total Payout</span>
                    <span className="font-extrabold text-base text-heritage-terracotta">
                      ₹{ord.total_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Items & Buyer Address */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Order Items */}
                  <div className="md:col-span-7 space-y-3">
                    <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase">
                      Ordered Crafts ({ord.items.length})
                    </span>
                    {ord.items.map((item, idx) => (<div key={idx} className="flex items-center space-x-3 bg-heritage-ivory/50 p-2.5 rounded-2xl border border-heritage-sand">
                        <img src={item.product_image} alt={item.product_name} className="w-14 h-14 rounded-xl object-cover border border-heritage-sand"/>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-heritage-brown">
                            {item.product_name}
                          </p>
                          <p className="text-[11px] text-heritage-charcoal/70">
                            Quantity: {item.quantity} &bull; ₹{item.price.toLocaleString('en-IN')} each
                          </p>
                        </div>
                      </div>))}
                  </div>

                  {/* Buyer & Shipping Information */}
                  <div className="md:col-span-5 bg-heritage-sand/30 p-4 rounded-2xl border border-heritage-sand text-xs space-y-2">
                    <span className="font-bold text-heritage-brown block uppercase tracking-wider text-[10px]">
                      Shipping Destination
                    </span>
                    <p className="font-bold text-heritage-charcoal">
                      {ord.buyer_name}
                    </p>
                    <div className="flex items-start space-x-1.5 text-heritage-charcoal/70">
                      <MapPin className="w-3.5 h-3.5 text-heritage-terracotta shrink-0 mt-0.5"/>
                      <span>
                        {ord.shipping_address.street}, {ord.shipping_address.city}, {ord.shipping_address.state} - {ord.shipping_address.pincode}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-heritage-charcoal/70">
                      <Phone className="w-3.5 h-3.5 text-heritage-terracotta"/>
                      <span>{ord.buyer_mobile}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Status Advancement Action */}
                <div className="pt-3 border-t border-heritage-sand flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-heritage-charcoal/60">
                    Payment Method: <strong className="text-heritage-charcoal">{ord.payment_method}</strong> ({ord.payment_id})
                  </span>

                  {ord.status !== 'delivered' && (<button type="button" onClick={() => handleStatusTransition(ord.id, ord.status)} className="px-4 py-2 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5">
                      <span>
                        Mark as{' '}
                        {ord.status === 'ordered'
                        ? 'Confirmed'
                        : ord.status === 'confirmed'
                            ? 'Preparing'
                            : ord.status === 'preparing'
                                ? 'Shipped'
                                : 'Delivered (+100 Credits)'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5"/>
                    </button>)}
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
};
