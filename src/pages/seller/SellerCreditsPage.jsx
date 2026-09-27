import React from 'react';
import { Sparkles, CheckCircle2, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CreditBadgeRadial } from '../../components/3d/CreditBadgeRadial';
export const SellerCreditsPage = () => {
    const { currentUser, creditTransactions } = useApp();
    const userTxs = creditTransactions.filter((tx) => tx.seller_id === currentUser?.id);
    const tiers = [
        { name: 'New Artisan', min: 0, max: 499, perk: 'Basic listing privileges & automated AI product appraisal.' },
        { name: 'Rising Karigar', min: 500, max: 999, perk: 'Marketplace featured search placement & buyer direct chat.' },
        { name: 'Trusted Artisan', min: 1000, max: 1599, perk: 'Gold badge on all cards, priority AI pricing index, and ONDC export linkage.' },
        { name: 'Master Karigar', min: 1600, max: 2500, perk: 'AI Recognition flag, national exhibition invites, and zero transaction fee threshold.' },
    ];
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-heritage-brown via-heritage-brown-dark to-heritage-terracotta text-white rounded-3xl p-6 sm:p-8 shadow-3d-lg border-2 border-heritage-gold/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-heritage-gold/20 text-heritage-gold-light px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-heritage-gold"/>
              <span>Artisan Reputation & Gamification Engine</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
              KarigarSetu Credits
            </h1>
            <p className="text-xs sm:text-sm text-heritage-sand/80 mt-1 max-w-xl font-medium leading-relaxed">
              Earn platform reputation points for publishing authentic handicrafts, fulfilling orders promptly, and delighting patrons across India.
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl border border-heritage-gold/40 text-center">
            <span className="text-xs text-heritage-gold uppercase tracking-wider block font-bold">
              Current Balance
            </span>
            <span className="text-3xl font-black font-serif text-heritage-gold-light">
              {(Number(currentUser?.credits ?? 0)).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-white/70 block mt-0.5">KARIGARSETU.AI CREDITS</span>
          </div>
        </div>

        {/* 2-Column Split: 3D Radial Visual (Left) vs Badge Tiers & Rules (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: 3D RADIAL VISUALIZATION (Section 35) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border-2 border-heritage-gold/40 shadow-3d flex flex-col items-center justify-center">
            <h2 className="text-xs font-bold text-heritage-terracotta uppercase tracking-wider mb-6">
              3D Tier Progress Gauge
            </h2>

            <CreditBadgeRadial credits={Number(currentUser?.credits ?? 0)} badge={currentUser?.badge || 'New Artisan'} size="lg" showDetails={true}/>

            <div className="mt-8 w-full p-4 bg-heritage-sand/30 rounded-2xl border border-heritage-sand text-xs space-y-2 text-heritage-charcoal/80">
              <div className="flex items-center space-x-2 text-heritage-brown font-bold">
                <Info className="w-4 h-4 text-heritage-terracotta shrink-0"/>
                <span>What are KARIGARSETU.AI Credits?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-heritage-charcoal/70">
                Credits represent verified artisan credibility and craft activity on the platform. They unlock higher seller tier badges, priority search ranking, and wholesale B2B buyer inquiries. Credits do not represent real fiat currency.
              </p>
            </div>
          </div>

          {/* RIGHT: EARNING RULES & BADGE MILESTONES */}
          <div className="lg:col-span-7 space-y-6">
            {/* Earning Matrix (Section 21) */}
            <div className="bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d">
              <h3 className="font-serif font-bold text-lg text-heritage-brown mb-4">
                How to Earn Karigar Credits
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-heritage-sand/40 rounded-2xl border border-heritage-sand">
                  <span className="text-xs text-heritage-charcoal/60 block font-medium">Publish Craft</span>
                  <span className="text-lg font-black text-emerald-700 block mt-1">+50</span>
                  <span className="text-[10px] text-heritage-charcoal/60">Per new listing</span>
                </div>

                <div className="p-3 bg-heritage-sand/40 rounded-2xl border border-heritage-sand">
                  <span className="text-xs text-heritage-charcoal/60 block font-medium">Order Sold</span>
                  <span className="text-lg font-black text-emerald-700 block mt-1">+100</span>
                  <span className="text-[10px] text-heritage-charcoal/60">Per delivery</span>
                </div>

                <div className="p-3 bg-heritage-sand/40 rounded-2xl border border-heritage-sand">
                  <span className="text-xs text-heritage-charcoal/60 block font-medium">5-Star Review</span>
                  <span className="text-lg font-black text-emerald-700 block mt-1">+25</span>
                  <span className="text-[10px] text-heritage-charcoal/60">Verified rating</span>
                </div>

                <div className="p-3 bg-heritage-sand/40 rounded-2xl border border-heritage-sand">
                  <span className="text-xs text-heritage-charcoal/60 block font-medium">Profile Setup</span>
                  <span className="text-lg font-black text-emerald-700 block mt-1">+20</span>
                  <span className="text-[10px] text-heritage-charcoal/60">One-time bonus</span>
                </div>
              </div>
            </div>

            {/* Artisan Badge Milestones */}
            <div className="bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d space-y-3">
              <h3 className="font-serif font-bold text-lg text-heritage-brown mb-2">
                Artisan Tier Milestones
              </h3>

              <div className="space-y-3">
                {tiers.map((t, idx) => {
            const isCurrent = currentUser?.badge === t.name;
            const isUnlocked = (Number(currentUser?.credits ?? 0)) >= t.min;
            return (<div key={idx} className={`p-4 rounded-2xl border transition flex items-start justify-between ${isCurrent
                    ? 'bg-heritage-gold/15 border-heritage-gold ring-1 ring-heritage-gold/30'
                    : isUnlocked
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-heritage-ivory/40 border-heritage-sand opacity-60'}`}>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-heritage-brown">
                            {t.name}
                          </span>
                          {isCurrent && (<span className="bg-heritage-terracotta text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Active Tier
                            </span>)}
                          {isUnlocked && !isCurrent && (<span className="text-emerald-700 text-[10px] font-semibold flex items-center">
                              <CheckCircle2 className="w-3 h-3 mr-0.5"/> Unlocked
                            </span>)}
                        </div>
                        <p className="text-xs text-heritage-charcoal/70">
                          {t.perk}
                        </p>
                      </div>

                      <span className="text-xs font-mono font-bold text-heritage-brown shrink-0 ml-4">
                        {t.min} – {t.max}+ pts
                      </span>
                    </div>);
        })}
              </div>
            </div>
          </div>
        </div>

        {/* AUDIT LOG: TRANSACTION HISTORY (Section 21) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-terracotta/20 shadow-3d">
          <h3 className="font-serif font-bold text-xl text-heritage-brown mb-4">
            Credit Audit History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-heritage-sand text-heritage-charcoal/60 uppercase text-[10px]">
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Activity / Action</th>
                  <th className="pb-3 font-bold">Description</th>
                  <th className="pb-3 font-bold text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-sand/60">
                {userTxs.map((tx) => (<tr key={tx.id} className="hover:bg-heritage-ivory/50">
                    <td className="py-3.5 text-heritage-charcoal/70 font-mono text-[11px]">
                      {new Date(tx.created_at).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            })}
                    </td>
                    <td className="py-3.5 font-bold text-heritage-brown capitalize">
                      {tx.action.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 text-heritage-charcoal/80">
                      {tx.description}
                    </td>
                    <td className="py-3.5 text-right font-black text-emerald-700 text-sm">
                      +{tx.amount}
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);
};
