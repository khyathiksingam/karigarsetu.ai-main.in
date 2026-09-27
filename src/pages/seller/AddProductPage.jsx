import React, { useState } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Scan, CheckCircle2, Sparkles, IndianRupee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const AddProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addProduct, updateProduct, getProductById, currentUser } = useApp();
  const prefill = location.state?.prefill;
  const existingProduct = id ? getProductById(id) : null;

  const [formData, setFormData] = useState({
    name: existingProduct?.name || prefill?.productName || prefill?.name || '',
    description: existingProduct?.description || prefill?.description || prefill?.detailedDescription || '',
    category: existingProduct?.category || prefill?.category || 'Wood Craft',
    material: existingProduct?.material || prefill?.material || 'Teak Wood',
    model_style: existingProduct?.model_style || prefill?.designStyle || prefill?.model || 'Traditional Indian Style',
    length: existingProduct?.dimensions?.length || existingProduct?.dimensions_length || prefill?.length || 25,
    width: existingProduct?.dimensions?.width || existingProduct?.dimensions_width || prefill?.width || 15,
    height: existingProduct?.dimensions?.height || existingProduct?.dimensions_height || prefill?.height || 10,
    unit: 'cm',
    primary_color: existingProduct?.primary_color || prefill?.primaryColor || 'Natural Earth',
    secondary_color: existingProduct?.secondary_color || prefill?.secondaryColor || '',
    suggested_price: existingProduct?.suggested_price || prefill?.suggestedPrice || 2499,
    price: existingProduct?.price || prefill?.price || prefill?.suggestedPrice || 2499,
    quantity: existingProduct?.quantity || 5,
    crafting_time_days: existingProduct?.crafting_time_days || 7,
    image: existingProduct?.images?.[0] || prefill?.image || 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=800&auto=format&fit=crop&q=80',
    state: existingProduct?.state || currentUser?.state || 'Rajasthan',
    city: existingProduct?.city || currentUser?.city || 'Jaipur',
    quality_score: existingProduct?.quality_score || prefill?.qualityScore || 4.8,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories = [
    'Wood Craft', 'Pottery', 'Terracotta', 'Handloom', 'Bamboo',
    'Metal Craft', 'Silk Craft', 'Jewellery', 'Paintings', 'Home Decor'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingProduct) {
      updateProduct(existingProduct.id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        material: formData.material,
        model_style: formData.model_style,
        dimensions: {
          length: Number(formData.length),
          width: Number(formData.width),
          height: Number(formData.height),
          unit: formData.unit,
        },
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        suggested_price: Number(formData.suggested_price),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        crafting_time_days: Number(formData.crafting_time_days),
        images: [formData.image],
        state: formData.state,
        city: formData.city,
      });
      setSavedSuccess(true);
      setTimeout(() => navigate('/seller/products'), 1200);
    } else {
      const newProd = addProduct({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        material: formData.material,
        model_style: formData.model_style,
        dimensions: {
          length: Number(formData.length),
          width: Number(formData.width),
          height: Number(formData.height),
          unit: formData.unit,
        },
        is_dimensions_estimated: true,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        quality_score: formData.quality_score,
        market_price_min: Math.round(Number(formData.price) * 0.85),
        market_price_max: Math.round(Number(formData.price) * 1.25),
        suggested_price: Number(formData.suggested_price || formData.price),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        crafting_time_days: Number(formData.crafting_time_days),
        images: [formData.image],
        state: formData.state,
        city: formData.city,
      });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setSavedSuccess(true);
      setTimeout(() => navigate(`/product/${newProd.id}`), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/seller/products"
            className="inline-flex items-center text-xs font-bold text-heritage-brown hover:text-heritage-terracotta transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to My Catalog
          </Link>

          {!existingProduct && (
            <Link
              to="/seller/ai-analyzer"
              className="inline-flex items-center space-x-1 text-xs font-bold text-heritage-terracotta hover:underline"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Use AI Product Analyzer</span>
            </Link>
          )}
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-700 text-white rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>
                {existingProduct ? 'Craft details updated successfully!' : 'Craft published to KARIGARSETU.AI Marketplace! +50 Credits Awarded!'}
              </span>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-heritage-terracotta/20 shadow-3d">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta bg-heritage-terracotta/10 px-3 py-1 rounded-full">
              Artisan Cataloguing Portal
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-heritage-brown mt-2">
              {existingProduct ? 'Edit Craft Listing' : 'Publish New Handmade Craft'}
            </h1>
            <p className="text-xs text-heritage-charcoal/70 mt-1 font-medium">
              Review and confirm craft details, dimensions, materials, and artisan pricing before publishing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview & URL */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4 bg-heritage-sand/30 rounded-2xl border border-heritage-sand">
              <div className="md:col-span-4 aspect-square rounded-2xl overflow-hidden bg-heritage-sand border border-heritage-sand/80 shadow-inner">
                <img
                  src={formData.image}
                  alt={formData.name || 'Craft'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-8 space-y-2">
                <label className="block text-xs font-bold text-heritage-brown">
                  Product Image URL or Upload Reference
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-white text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
                <p className="text-[11px] text-heritage-charcoal/60">
                  Tip: Upload photos via AI Product Analyzer for automatic appraisal and auto-filled specs.
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Craft Title / Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Handcrafted Teakwood Elephant Figurine"
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Craft Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-heritage-brown mb-1">
                Detailed Craft Story & Description *
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the craft lineage, carving technique, wood curing, or weaving process..."
                className="w-full p-3 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
              />
            </div>

            {/* Materials & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Primary Material *
                </label>
                <input
                  type="text"
                  required
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g. Seasoned Teak Wood, Pure Mulberry Silk"
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Primary Color *
                </label>
                <input
                  type="text"
                  required
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  placeholder="e.g. Natural Teak Brown"
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Style / Design Pattern
                </label>
                <input
                  type="text"
                  value={formData.model_style}
                  onChange={(e) => setFormData({ ...formData, model_style: e.target.value })}
                  placeholder="e.g. Traditional Royal Motif"
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>
            </div>

            {/* Pricing Section with AI Suggested Price and Artisan Price */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-heritage-sand/40 border border-amber-300/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-heritage-brown uppercase tracking-wider flex items-center">
                  <Sparkles className="w-4 h-4 text-amber-600 mr-1.5" />
                  Ethical Fair-Trade Pricing
                </span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Zero Commission
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-white/80 rounded-xl border border-heritage-sand">
                  <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase block">
                    AI Suggested Price
                  </span>
                  <p className="font-serif font-black text-xl text-heritage-brown mt-1">
                    ₹{Number(formData.suggested_price || formData.price).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-heritage-charcoal/60 mt-0.5">
                    Estimated using raw material indices, craft complexity, and living wage.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    Final Artisan Listing Price (₹) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-heritage-charcoal/40 absolute left-3 top-3" />
                    <input
                      type="number"
                      min={1}
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="2499"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-heritage-terracotta/50 bg-white font-bold text-sm text-heritage-brown focus:border-heritage-terracotta outline-none shadow-sm"
                    />
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    You receive 100% of this price directly from the buyer.
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Crafting Time (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.crafting_time_days}
                  onChange={(e) => setFormData({ ...formData, crafting_time_days: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  City / Cluster *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Jaipur"
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Rajasthan"
                  className="w-full p-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C8702A] to-[#A8561D] hover:shadow-lg text-white font-bold text-sm shadow-3d hover:scale-101 transition flex items-center justify-center space-x-2"
            >
              <span>{existingProduct ? 'Save & Update Listing' : 'Publish Craft to Marketplace (+50 Credits)'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
