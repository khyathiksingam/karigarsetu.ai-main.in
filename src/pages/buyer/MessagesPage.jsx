import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../../components/common/Avatar';
export const MessagesPage = () => {
    const { messages, sendMessage, currentUser, currentRole } = useApp();
    const [activePartnerId, setActivePartnerId] = useState(null);
    const [inputText, setInputText] = useState('');
    // Determine conversation partners
    const partners = currentRole === 'seller'
        ? []
        : [];
    const currentPartner = partners.find((p) => p.id === activePartnerId) || partners[0];
    // Filter messages between currentUser and activePartner
    const conversation = messages.filter((m) => (m.sender_id === currentUser?.id && m.receiver_id === activePartnerId) ||
        (m.sender_id === activePartnerId && m.receiver_id === currentUser?.id) ||
        (m.sender_id === 'buyer_1' && m.receiver_id === 'seller_1') ||
        (m.sender_id === 'seller_1' && m.receiver_id === 'buyer_1'));
    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim())
            return;
        sendMessage(activePartnerId, inputText.trim());
        setInputText('');
    };
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-heritage-terracotta mb-1">
            <MessageSquare className="w-3.5 h-3.5"/>
            <span>Direct Artisan Dialogue</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
            Messages & Inquiries
          </h1>
          <p className="text-xs text-heritage-charcoal/70 mt-0.5">
            Connect directly with traditional craftspeople to discuss custom requirements or craft lineages.
          </p>
        </div>

        {/* 2-Column Chat Interface (Section 30) */}
        <div className="bg-white rounded-3xl border border-heritage-sand shadow-3d overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          {/* Conversation List (Left) */}
          <div className="md:col-span-4 border-r border-heritage-sand bg-heritage-ivory/40 p-4 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/60 px-2 block mb-2">
              Recent Conversations
            </span>

            {partners.map((partner) => {
            const isSelected = partner.id === activePartnerId;
            return (<button key={partner.id} onClick={() => setActivePartnerId(partner.id)} className={`w-full p-3 rounded-2xl text-left flex items-center space-x-3 transition ${isSelected
                    ? 'bg-white border-2 border-heritage-terracotta shadow-sm'
                    : 'hover:bg-heritage-sand/60 border border-transparent'}`}>
                  <Avatar src={partner.profile_image} name={partner.full_name} role={partner.role || 'seller'} size="md" className="border border-heritage-gold shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-heritage-brown truncate">
                      {partner.full_name}
                    </p>
                    <p className="text-[10px] text-heritage-terracotta font-medium truncate">
                      {partner.craft_specialization || partner.city}
                    </p>
                  </div>
                </button>);
        })}
          </div>

          {/* Chat Window (Right) */}
          <div className="md:col-span-8 flex flex-col justify-between bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-heritage-sand bg-heritage-ivory/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar src={currentPartner.profile_image} name={currentPartner.full_name} role={currentPartner.role || 'seller'} size="md" className="border border-heritage-gold shrink-0"/>
                <div>
                  <h3 className="font-serif font-bold text-sm text-heritage-brown">
                    {currentPartner.full_name}
                  </h3>
                  <p className="text-[10px] text-heritage-charcoal/60">
                    {currentPartner.city}, {currentPartner.state} &bull; Verified
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Active Dialogue
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[380px]">
              {conversation.length === 0 ? (<div className="text-center py-12 text-heritage-charcoal/50 text-xs">
                  No messages yet. Send a greeting to start your conversation with {currentPartner.full_name}!
                </div>) : (conversation.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id || (currentUser?.role === 'buyer' && msg.sender_id === 'buyer_1');
            return (<div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Product Reference Pill */}
                      {msg.product_name && (<span className="text-[9px] font-semibold text-heritage-charcoal/60 mb-1 bg-heritage-sand/40 px-2 py-0.5 rounded">
                          Referencing: {msg.product_name}
                        </span>)}

                      <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${isMe
                    ? 'bg-heritage-terracotta text-white rounded-br-none'
                    : 'bg-heritage-sand/50 text-heritage-brown-dark rounded-bl-none border border-heritage-sand'}`}>
                        <p>{msg.text}</p>
                      </div>

                      <span className="text-[9px] text-heritage-charcoal/40 mt-1 px-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>);
        }))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 border-t border-heritage-sand flex items-center space-x-2">
              <input type="text" required value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={`Message ${currentPartner.full_name}...`} className="flex-1 p-3 rounded-2xl border border-heritage-sand bg-heritage-ivory/30 text-xs font-medium focus:border-heritage-terracotta outline-none"/>
              <button type="submit" className="p-3 rounded-2xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white transition shadow-sm">
                <Send className="w-4 h-4"/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>);
};
