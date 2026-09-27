import React from 'react';
import { ShieldCheck, Database, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, supabaseConfigurationError } from '../services/supabase';
export const SettingsPage = () => {
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-heritage-terracotta mb-1">
            <ShieldCheck className="w-3.5 h-3.5"/>
            <span>Platform Settings</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
            Platform Environment & Architecture Settings
          </h1>
          <p className="text-xs text-heritage-charcoal/70 mt-0.5">
            Review platform connectivity and service health.
          </p>
        </div>

        {/* SECTION 41 & 56: BACKEND & API STATUS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sand shadow-3d space-y-4">
          <h3 className="font-serif font-bold text-lg text-heritage-brown">
            Cloud & AI Service Health
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-heritage-ivory/50 border border-heritage-sand">
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4 text-heritage-brown"/>
                <div>
                  <p className="font-bold text-heritage-brown">Supabase Cloud Database</p>
                  <p className="text-[10px] text-heritage-charcoal/60">PostgreSQL + Storage + RLS Engine</p>
                </div>
              </div>
              <span title={isSupabaseConfigured ? 'Supabase public configuration loaded.' : supabaseConfigurationError} className={`px-3 py-1 rounded-full text-[10px] font-bold ${isSupabaseConfigured
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-heritage-gold/20 text-heritage-brown'}`}>
                {isSupabaseConfigured ? 'Connected (Live)' : 'Configuration Required'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-heritage-ivory/50 border border-heritage-sand">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-heritage-terracotta"/>
                <div>
                  <p className="font-bold text-heritage-brown">Google Gemini Vision API</p>
                  <p className="text-[10px] text-heritage-charcoal/60">Neural handicraft appraisal & pricing</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-heritage-gold/20 text-heritage-brown">
                Secure API Route Configured
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
