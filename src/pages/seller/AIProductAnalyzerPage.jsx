import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  Upload,
  Camera,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit3,
  Copy,
  UserX,
  AlertTriangle,
  ShieldAlert,
  FileText,
  ShieldCheck,
  Info,
  Layers,
  Tag,
  HeartHandshake,
  Check,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { analyzeProductImage, SCAN_STEPS } from '../../services/aiService';
import { CameraCaptureModal } from '../../components/common/CameraCaptureModal';

const SpecField = ({ label, value, badge, className = '', highlight = false, isEditing, onEditChange }) => (
  <div className={`p-4 rounded-2xl ${highlight ? 'bg-amber-50/80 border-amber-200/80' : 'bg-heritage-ivory/60 border-heritage-sand/80'} border flex flex-col justify-between transition-all hover:shadow-xs ${className}`}>
    <div className="flex items-center justify-between mb-1.5 gap-2">
      <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block">
        {label}
      </span>
      {badge && (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
          {badge}
        </span>
      )}
    </div>
    {isEditing ? (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onEditChange?.(e.target.value)}
        className="w-full text-xs font-bold text-heritage-brown bg-white border border-heritage-sand p-2 rounded-xl focus:border-heritage-terracotta outline-none"
      />
    ) : (
      <div className="text-sm font-black text-heritage-brown break-words leading-snug">
        {value || '—'}
      </div>
    )}
  </div>
);

const ConfidenceGauge = ({ confidence }) => {
  const normalizedConfidence = Number(confidence) || 0;
  const safeConfidence = normalizedConfidence <= 1 ? normalizedConfidence * 100 : Math.min(100, Math.max(0, normalizedConfidence));
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeConfidence / 100) * circumference;

  return (
    <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-heritage-gold/15 to-heritage-sand/30 border border-heritage-gold/40">
      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
        <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 60 60" aria-hidden="true">
          <circle
            cx="30"
            cy="30"
            r={radius}
            className="text-heritage-sand/80"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="30"
            cy="30"
            r={radius}
            className="text-emerald-600 transition-all duration-1000 ease-out"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-black text-heritage-brown">
            {safeConfidence}%
          </span>
        </div>
      </div>
      <div>
        <div className="flex items-center space-x-1.5 flex-wrap gap-1">
          <span className="text-xs font-black text-heritage-brown uppercase tracking-wider">
            AI Visual Confidence
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            {safeConfidence >= 90 ? 'High Confidence' : safeConfidence >= 75 ? 'Verified Features' : 'Visual Match'}
          </span>
        </div>
        <p className="text-[11px] text-heritage-charcoal/80 font-medium mt-0.5">
          Confidence evaluated on visible Indian handicraft characteristics and craftsmanship cues.
        </p>
      </div>
    </div>
  );
};

export const AIProductAnalyzerPage = () => {
  const { addProduct, currentUser } = useApp();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageFile = (file) => {
    setUploadError(null);
    setAnalysisError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('The selected image is larger than 15MB. Please choose a smaller photo.');
      return;
    }

    setFileObject(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result);
      setAnalysisResult(null);
      setPublishedSuccess(false);
      setCurrentStepIndex(-1);
      setCompletedSteps([]);
    };
    reader.onerror = () => {
      setUploadError('Failed to read image from device. Please try another photo.');
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFileObject(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setCurrentStepIndex(-1);
    setCompletedSteps([]);
    setPublishedSuccess(false);
    setUploadError(null);
    setIsEditMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage || isAnalyzing) return;
    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setAnalysisResult(null);
    setAnalysisError(null);
    setCopiedDescription(false);
    setIsEditMode(false);

    try {
      const response = await analyzeProductImage(fileObject || selectedImage, (stepIdx) => {
        setCurrentStepIndex(stepIdx);
        setCompletedSteps((prev) => Array.from(new Set([...prev, stepIdx])));
      });
      setAnalysisResult(response.result);
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisResult(null);
      setAnalysisError(err instanceof Error ? err.message : 'AI analysis is temporarily unavailable. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyDescription = async () => {
    const description = analysisResult?.detailedDescription || analysisResult?.description || analysisResult?.shortDescription;
    if (!description || !navigator.clipboard) return;
    await navigator.clipboard.writeText(description);
    setCopiedDescription(true);
    setTimeout(() => setCopiedDescription(false), 2000);
  };

  const handleResultChange = (field, value) => {
    setAnalysisResult((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handlePublishDirectly = () => {
    if (!analysisResult || !selectedImage) return;

    if (!currentUser || currentUser.role !== 'seller') {
      navigate('/login');
      return;
    }

    const suggestedPrice = Number(analysisResult.suggestedPrice || analysisResult.price || 999);
    const minPrice = Number(analysisResult.priceRange?.min || analysisResult.estimatedPriceMin || Math.round(suggestedPrice * 0.8));
    const maxPrice = Number(analysisResult.priceRange?.max || analysisResult.estimatedPriceMax || Math.round(suggestedPrice * 1.35));

    const newProd = addProduct({
      name: analysisResult.productTitle || analysisResult.productName || 'Handcrafted Heritage Item',
      description: analysisResult.detailedDescription || analysisResult.description || 'Authentic handmade Indian craft.',
      category: analysisResult.category || 'Handicraft',
      material: Array.isArray(analysisResult.materials) ? analysisResult.materials.join(', ') : (analysisResult.material || 'Natural Materials'),
      model_style: analysisResult.designStyle || analysisResult.craftType || 'Traditional Craft',
      dimensions: {
        length: 25,
        width: 25,
        height: 10,
        unit: 'cm',
      },
      is_dimensions_estimated: true,
      primary_color: Array.isArray(analysisResult.colors) ? (analysisResult.colors[0] || 'Earth Tone') : 'Earth Tone',
      secondary_color: Array.isArray(analysisResult.colors) ? (analysisResult.colors[1] || 'Natural Accent') : 'Natural Accent',
      quality_score: 4.8,
      market_price_min: minPrice,
      market_price_max: maxPrice,
      suggested_price: suggestedPrice,
      price: suggestedPrice,
      quantity: 5,
      crafting_time_days: 7,
      images: [selectedImage],
      state: currentUser?.state || 'Rajasthan',
      city: currentUser?.city || 'Jaipur',
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setPublishedSuccess(true);
    setTimeout(() => {
      navigate(`/product/${newProd.id}`);
    }, 1800);
  };

  const handleEditBeforePublish = () => {
    if (!analysisResult) return;
    if (!currentUser || currentUser.role !== 'seller') {
      navigate('/login');
      return;
    }

    const suggestedPrice = Number(analysisResult.suggestedPrice || analysisResult.price || 999);
    const minPrice = Number(analysisResult.priceRange?.min || analysisResult.estimatedPriceMin || Math.round(suggestedPrice * 0.8));
    const maxPrice = Number(analysisResult.priceRange?.max || analysisResult.estimatedPriceMax || Math.round(suggestedPrice * 1.35));

    navigate('/seller/products/new', {
      state: {
        prefill: {
          name: analysisResult.productTitle || analysisResult.productName || 'Handcrafted Heritage Item',
          category: analysisResult.category || 'Handicraft',
          material: Array.isArray(analysisResult.materials) ? analysisResult.materials.join(', ') : (analysisResult.material || 'Natural Materials'),
          model: analysisResult.designStyle || analysisResult.craftType || 'Traditional Craft',
          primaryColor: Array.isArray(analysisResult.colors) ? (analysisResult.colors[0] || 'Natural Earth') : 'Natural Earth',
          secondaryColor: Array.isArray(analysisResult.colors) ? (analysisResult.colors[1] || 'Accent Tone') : 'Accent Tone',
          price: suggestedPrice,
          suggestedPrice,
          minPrice,
          maxPrice,
          qualityScore: 4.8,
          image: selectedImage,
          description: analysisResult.detailedDescription || analysisResult.shortDescription || '',
          detailedDescription: analysisResult.detailedDescription || '',
          seoDescription: analysisResult.seoDescription || '',
          keywords: analysisResult.keywords || [],
          highlights: analysisResult.highlights || [],
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-heritage-brown via-heritage-brown-dark to-heritage-terracotta text-white rounded-3xl p-6 sm:p-8 shadow-3d-lg border-2 border-heritage-gold/40 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center space-x-4">
            <img
              src="/assets/karigarsetu-ai-logo.png"
              alt="KARIGARSETU.AI Official Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain bg-white/10 p-0.5 border-2 border-heritage-gold/60 shadow-md shrink-0"
            />
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-heritage-gold/20 text-heritage-gold-light px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-heritage-gold" aria-hidden="true" />
                <span>Multimodal Vision & Smart Cataloguing</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white">
                AI Product Analyzer & Appraiser
              </h1>
              <p className="text-xs sm:text-sm text-heritage-sand/90 mt-1 max-w-2xl font-normal leading-relaxed">
                Upload a photograph of your handicraft to identify craft traditions, materials, visual characteristics, and generate marketplace-ready listings.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-black/25 px-4 py-2.5 rounded-2xl border border-heritage-gold/30 shrink-0 self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-heritage-gold-light">
              Gemini Vision Ready
            </span>
          </div>
        </div>

        {/* MAIN 2-COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: IMAGE UPLOAD & PROGRESS */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-heritage-brown uppercase tracking-wider">
                Handicraft Photograph
              </h2>
              {selectedImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {/* Dropzone & Preview Container */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => {
                if (!selectedImage && !isAnalyzing) {
                  fileInputRef.current?.click();
                }
              }}
              className={`relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-dashed border-heritage-sand bg-heritage-ivory/50 flex flex-col items-center justify-center transition shadow-inner group ${
                !selectedImage && !isAnalyzing
                  ? 'cursor-pointer hover:border-heritage-terracotta hover:bg-heritage-sand/30'
                  : ''
              }`}
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Handicraft Upload Preview"
                    className={`w-full h-full object-contain bg-heritage-ivory/80 transition duration-500 ${
                      isAnalyzing ? 'brightness-90 contrast-110' : ''
                    }`}
                  />

                  {/* Change Photo Overlay */}
                  {!isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 p-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white text-heritage-brown text-xs font-bold shadow-md hover:bg-heritage-sand transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-heritage-terracotta" aria-hidden="true" />
                        <span>Replace Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCameraActive(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-heritage-terracotta text-white text-xs font-bold shadow-md hover:bg-heritage-terracotta-dark transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" aria-hidden="true" />
                        <span>Retake Photo</span>
                      </button>
                    </div>
                  )}

                  {/* Scanning Animation */}
                  {isAnalyzing && (
                    <>
                      <div className="scanning-beam animate-scan-laser" />
                      <div className="absolute inset-0 bg-heritage-terracotta/10 pointer-events-none" />
                      <div className="absolute top-4 left-4 bg-heritage-brown/90 text-heritage-gold text-[10px] font-bold px-3 py-1.5 rounded-full border border-heritage-gold/40 flex items-center space-x-2 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>GEMINI AI MULTIMODAL APPRAISAL...</span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mx-auto shadow-inner">
                    <Upload className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-heritage-brown">
                      Drag and drop your handicraft photo here
                    </p>
                    <p className="text-xs text-heritage-charcoal/60 mt-1">
                      Supports JPG, PNG, WEBP
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-heritage-terracotta text-white text-xs font-bold shadow-sm hover:bg-heritage-terracotta-dark transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Browse File</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCameraActive(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-heritage-sand hover:bg-heritage-sand/80 text-heritage-brown text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-3 px-3 rounded-2xl border border-heritage-sand bg-heritage-ivory/60 hover:bg-heritage-sand text-xs font-bold text-heritage-brown flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-heritage-terracotta" aria-hidden="true" />
                <span>{selectedImage ? 'Replace Image' : 'Browse File'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCameraActive(true)}
                className="py-3 px-3 rounded-2xl border border-heritage-sand bg-heritage-ivory/60 hover:bg-heritage-sand text-xs font-bold text-heritage-brown flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-heritage-brown" aria-hidden="true" />
                <span>{selectedImage ? 'Retake Photo' : 'Take Photo'}</span>
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                <span>{uploadError}</span>
              </div>
            )}

            {analysisError && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1.5 flex-1">
                  <span className="block font-bold">{analysisError}</span>
                  <button
                    type="button"
                    onClick={handleStartAnalysis}
                    className="inline-flex items-center space-x-1.5 text-amber-950 underline underline-offset-2 font-black cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Retry Analysis</span>
                  </button>
                </div>
              </div>
            )}

            {/* ANALYZE WITH AI ACTION BUTTON */}
            <button
              type="button"
              disabled={!selectedImage || isAnalyzing}
              onClick={handleStartAnalysis}
              className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base shadow-3d-lg transition-all flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer ${
                !selectedImage || isAnalyzing
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  : 'bg-gradient-to-r from-heritage-terracotta via-amber-600 to-heritage-terracotta-dark text-white hover:scale-[1.01] hover:shadow-glow-terracotta'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Analyzing with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" aria-hidden="true" />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>

            {/* 8-STEP PROGRESS CHECKLIST */}
            {(isAnalyzing || analysisResult) && (
              <div className="pt-4 border-t border-heritage-sand space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black text-heritage-brown uppercase tracking-wider">
                    AI Multimodal Appraisal Sequence
                  </p>
                  <span className="text-[10px] font-bold text-heritage-charcoal/60">
                    {completedSteps.length} of {SCAN_STEPS.length} Completed
                  </span>
                </div>
                <div className="space-y-1.5">
                  {SCAN_STEPS.map((step, idx) => {
                    const isDone = completedSteps.includes(idx) || Boolean(analysisResult);
                    const isCurrent = currentStepIndex === idx && isAnalyzing;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/60'
                            : isCurrent
                            ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300 animate-pulse'
                            : 'text-heritage-charcoal/40 bg-heritage-ivory/40'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-bold">
                              {step.id}
                            </div>
                          )}
                          <span className="truncate font-medium">{step.label}</span>
                        </div>
                        <span className="text-[10px] opacity-75 shrink-0 ml-2 hidden sm:inline">
                          {step.detail}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: STRUCTURED AI APPRAISAL RESULT */}
          <div className="lg:col-span-7 space-y-6">
            {!analysisResult && !isAnalyzing ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-heritage-sand shadow-3d text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-heritage-sand/50 text-heritage-terracotta flex items-center justify-center mx-auto shadow-inner">
                  <Scan className="w-10 h-10" aria-hidden="true" />
                </div>
                <h3 className="font-serif font-black text-2xl text-heritage-brown">
                  Awaiting Handicraft Photograph
                </h3>
                <p className="text-xs sm:text-sm text-heritage-charcoal/70 leading-relaxed max-w-md mx-auto">
                  {selectedImage ? (
                    <>
                      Photo ready! Click <strong className="text-heritage-brown">"Analyze with AI"</strong> to inspect the uploaded image and generate your structured marketplace catalog.
                    </>
                  ) : (
                    <>
                      Upload a photograph of your handicraft or capture one using your camera to generate an AI Appraisal Report.
                    </>
                  )}
                </p>
              </div>
            ) : isAnalyzing ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-heritage-sand shadow-3d text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-heritage-gold/20 text-heritage-gold-dark flex items-center justify-center mx-auto animate-spin shadow-inner">
                  <RefreshCw className="w-10 h-10" aria-hidden="true" />
                </div>
                <h3 className="font-serif font-black text-2xl text-heritage-brown">
                  Analyzing Handicraft Structure
                </h3>
                <p className="text-xs sm:text-sm text-heritage-charcoal/70 max-w-md mx-auto">
                  Analyzing visual details... Identifying craft characteristics... Generating marketplace description...
                </p>
              </div>
            ) : analysisResult ? (
              analysisResult.isValidCraft === false || analysisResult.isHumanSubject === true || analysisResult.isDocumentSubject === true ? (
                /* REJECTION CARD FOR DOCUMENT / HUMAN / NON-CRAFT */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-300 shadow-3d-lg space-y-6 animate-fade-in">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
                      {analysisResult.isDocumentSubject ? (
                        <FileText className="w-5 h-5 text-rose-700" aria-hidden="true" />
                      ) : analysisResult.isHumanSubject ? (
                        <UserX className="w-5 h-5 text-rose-700" aria-hidden="true" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-rose-700" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                        {analysisResult.isDocumentSubject
                          ? 'Document Detected'
                          : analysisResult.isHumanSubject
                          ? 'Portrait Subject Detected'
                          : 'Non-Craft Item'}
                      </span>
                      <h3 className="font-serif font-black text-lg text-rose-950 mt-1">
                        {analysisResult.isDocumentSubject
                          ? 'Printed Document / Text Sheet'
                          : analysisResult.isHumanSubject
                          ? 'Portrait / Person Photography'
                          : 'Unrecognized Craft Subject'}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
                    <div className="flex items-start space-x-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="space-y-1 text-xs text-rose-900 font-medium">
                        <p className="font-bold">
                          {analysisResult.rejectionReason || 'Please upload an authentic handmade physical craft item.'}
                        </p>
                        <p className="text-[11px] text-rose-800/80 leading-relaxed">
                          Under KARIGARSETU.AI marketplace guidelines, the analyzer evaluates genuine handmade crafts (woodwork, pottery, handlooms, brass metalware, cane/bamboo, jute work, and traditional art).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold text-heritage-brown uppercase tracking-wider">
                      Please try again with a handicraft photo:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-3 px-4 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" aria-hidden="true" />
                        <span>Upload Craft Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraActive(true)}
                        className="py-3 px-4 rounded-xl border border-heritage-sand bg-heritage-sand/40 hover:bg-heritage-sand text-heritage-brown font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" aria-hidden="true" />
                        <span>Take Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* STRUCTURED AI APPRAISAL REPORT */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-heritage-gold shadow-3d-lg space-y-6 relative overflow-hidden animate-fade-in">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-heritage-sand/80 pb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src="/assets/karigarsetu-ai-logo.png"
                        alt="KARIGARSETU.AI"
                        className="w-12 h-12 rounded-full object-contain border border-heritage-gold/50 shadow-xs"
                      />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-heritage-terracotta">
                          AI Generated — Review Before Publishing
                        </span>
                        <h2 className="font-serif font-black text-2xl text-heritage-brown leading-tight">
                          AI APPRAISAL REPORT
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                          isEditMode
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-heritage-sand/50 text-heritage-brown hover:bg-heritage-sand'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditMode ? 'Done Editing' : 'Edit Fields'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Published Success Alert */}
                  {publishedSuccess && (
                    <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-bounce">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                      <span>
                        Product published to Marketplace! +50 Karigar Credits added to your balance! Redirecting...
                      </span>
                    </div>
                  )}

                  {/* Confidence Gauge */}
                  <ConfidenceGauge confidence={analysisResult.confidence} />

                  <div className="p-4 bg-gradient-to-r from-heritage-terracotta/10 to-heritage-gold/10 border border-heritage-terracotta/20 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-heritage-terracotta">AI Price Suggestion</p>
                        <p className="font-serif font-black text-2xl text-heritage-brown">
                          ₹{Number(analysisResult.suggestedPrice || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/60">Confidence</p>
                        <p className="text-sm font-black text-heritage-brown">{Math.round((Number(analysisResult.confidence) || 0) * 100)}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap text-[11px] font-medium text-heritage-charcoal/75">
                      <span className="bg-white/80 border border-heritage-sand rounded-full px-2.5 py-1">
                        Suggested range: ₹{Number(analysisResult.priceRange?.min || analysisResult.estimatedPriceMin || 0).toLocaleString('en-IN')} – ₹{Number(analysisResult.priceRange?.max || analysisResult.estimatedPriceMax || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {(Array.isArray(analysisResult.pricingFactors) && analysisResult.pricingFactors.length > 0) && (
                      <ul className="text-[11px] text-heritage-charcoal/80 font-medium list-disc list-inside space-y-1 pl-1">
                        {analysisResult.pricingFactors.map((factor, index) => (
                          <li key={`${factor}-${index}`}>{factor}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* SECTION 1: PRODUCT IDENTITY */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 border-b border-heritage-sand/80 pb-2">
                      <span className="text-xs font-black text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                        01
                      </span>
                      <h3 className="text-xs font-black text-heritage-brown uppercase tracking-wider">
                        PRODUCT TITLE & CLASSIFICATION
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SpecField
                        label="Product Title"
                        value={analysisResult.productTitle || analysisResult.productName}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('productTitle', v)}
                        className="sm:col-span-2"
                        highlight
                      />
                      <SpecField
                        label="Craft Category"
                        value={analysisResult.category}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('category', v)}
                      />
                      <SpecField
                        label="Craft Type / Subcategory"
                        value={analysisResult.craftType || analysisResult.subcategory}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('craftType', v)}
                      />
                    </div>
                  </div>

                  {/* SECTION 2: MATERIALS, COLORS & TEXTURE */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 border-b border-heritage-sand/80 pb-2">
                      <span className="text-xs font-black text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                        02
                      </span>
                      <h3 className="text-xs font-black text-heritage-brown uppercase tracking-wider">
                        MATERIALS, COLORS & TEXTURE
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <SpecField
                        label="Materials"
                        value={Array.isArray(analysisResult.materials) ? analysisResult.materials.join(', ') : analysisResult.material}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('materials', v.split(',').map((s) => s.trim()))}
                      />
                      <SpecField
                        label="Colors"
                        value={Array.isArray(analysisResult.colors) ? analysisResult.colors.join(', ') : analysisResult.primaryColor}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('colors', v.split(',').map((s) => s.trim()))}
                      />
                      <SpecField
                        label="Surface Texture & Finish"
                        value={analysisResult.texture}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('texture', v)}
                      />
                      <SpecField
                        label="Patterns / Motifs"
                        value={Array.isArray(analysisResult.patterns) ? analysisResult.patterns.join(', ') : analysisResult.patterns}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('patterns', v.split(',').map((s) => s.trim()))}
                      />
                      <SpecField
                        label="Design Style"
                        value={analysisResult.designStyle}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('designStyle', v)}
                      />
                      <SpecField
                        label="Shape & Geometry"
                        value={analysisResult.shape}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('shape', v)}
                      />
                    </div>
                  </div>

                  {/* SECTION 3: CRAFTING TECHNIQUE & CULTURAL CONTEXT */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 border-b border-heritage-sand/80 pb-2">
                      <span className="text-xs font-black text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                        03
                      </span>
                      <h3 className="text-xs font-black text-heritage-brown uppercase tracking-wider">
                        TECHNIQUE & CULTURAL CONTEXT
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SpecField
                        label="Crafting Technique"
                        value={analysisResult.craftingTechnique}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('craftingTechnique', v)}
                      />
                      <SpecField
                        label="Possible Origin (India)"
                        value={analysisResult.possibleOrigin}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('possibleOrigin', v)}
                      />
                      <SpecField
                        label="Cultural Context"
                        value={analysisResult.culturalContext}
                        isEditing={isEditMode}
                        onEditChange={(v) => handleResultChange('culturalContext', v)}
                        className="sm:col-span-2"
                      />
                    </div>
                  </div>

                  {/* SECTION 4: MARKETPLACE DESCRIPTIONS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-heritage-sand/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                          04
                        </span>
                        <h3 className="text-xs font-black text-heritage-brown uppercase tracking-wider">
                          GENERATED MARKETPLACE COPY
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyDescription}
                        className="text-xs font-bold text-heritage-terracotta hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedDescription ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Description</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-heritage-ivory/60 rounded-2xl border border-heritage-sand/80 space-y-1">
                        <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block">
                          Short Description
                        </span>
                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={analysisResult.shortDescription || ''}
                            onChange={(e) => handleResultChange('shortDescription', e.target.value)}
                            className="w-full text-xs font-medium text-heritage-charcoal bg-white border border-heritage-sand p-2 rounded-xl focus:border-heritage-terracotta outline-none"
                          />
                        ) : (
                          <p className="text-xs text-heritage-charcoal/90 font-medium leading-relaxed">
                            {analysisResult.shortDescription || '—'}
                          </p>
                        )}
                      </div>

                      <div className="p-4 bg-heritage-ivory/60 rounded-2xl border border-heritage-sand/80 space-y-1">
                        <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block">
                          Detailed Marketplace Description
                        </span>
                        {isEditMode ? (
                          <textarea
                            rows={4}
                            value={analysisResult.detailedDescription || analysisResult.description || ''}
                            onChange={(e) => handleResultChange('detailedDescription', e.target.value)}
                            className="w-full text-xs font-medium text-heritage-charcoal bg-white border border-heritage-sand p-2 rounded-xl focus:border-heritage-terracotta outline-none"
                          />
                        ) : (
                          <p className="text-xs text-heritage-charcoal/90 font-medium leading-relaxed whitespace-pre-line">
                            {analysisResult.detailedDescription || analysisResult.description || '—'}
                          </p>
                        )}
                      </div>

                      <div className="p-4 bg-heritage-ivory/60 rounded-2xl border border-heritage-sand/80 space-y-1">
                        <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block">
                          SEO Meta Description
                        </span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={analysisResult.seoDescription || ''}
                            onChange={(e) => handleResultChange('seoDescription', e.target.value)}
                            className="w-full text-xs font-medium text-heritage-charcoal bg-white border border-heritage-sand p-2 rounded-xl focus:border-heritage-terracotta outline-none"
                          />
                        ) : (
                          <p className="text-xs font-mono text-heritage-charcoal/80">
                            {analysisResult.seoDescription || '—'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: HIGHLIGHTS & TAGS */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 border-b border-heritage-sand/80 pb-2">
                      <span className="text-xs font-black text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                        05
                      </span>
                      <h3 className="text-xs font-black text-heritage-brown uppercase tracking-wider">
                        HIGHLIGHTS & SEARCH KEYWORDS
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 bg-heritage-ivory/60 rounded-2xl border border-heritage-sand/80 space-y-2">
                        <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block">
                          Craft Highlights
                        </span>
                        <ul className="space-y-1 text-xs text-heritage-charcoal/90 font-medium list-disc list-inside">
                          {(Array.isArray(analysisResult.highlights) ? analysisResult.highlights : []).map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-heritage-ivory/60 rounded-2xl border border-heritage-sand/80 space-y-2">
                        <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block">
                          Keywords & Tags
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(Array.isArray(analysisResult.keywords) ? analysisResult.keywords : []).map((k, i) => (
                            <span key={i} className="text-[10px] font-bold bg-white border border-heritage-sand px-2 py-0.5 rounded-md text-heritage-brown">
                              #{k}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BUTTONS */}
                  <div className="pt-4 border-t-2 border-heritage-sand space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={handleEditBeforePublish}
                        className="py-3.5 px-4 rounded-2xl bg-[#1A3A5C] hover:bg-[#0F2338] text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-heritage-gold" />
                        <span>Auto-Fill Product Form & Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePublishDirectly}
                        className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-heritage-terracotta to-heritage-terracotta-dark text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Publish to Marketplace (+50 Credits)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      {cameraActive && (
        <CameraCaptureModal
          isOpen={cameraActive}
          onCapture={(capturedFile) => {
            setCameraActive(false);
            handleImageFile(capturedFile);
          }}
          onClose={() => setCameraActive(false)}
        />
      )}
    </div>
  );
};
