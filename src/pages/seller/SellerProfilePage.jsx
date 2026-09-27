import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Award, ExternalLink, CheckCircle2, Camera, Upload, Star, Building2, ShieldCheck, Tag, Plus, Eye, EyeOff, FileCheck, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { LocationInput } from '../../components/common/LocationInput';
import { Avatar } from '../../components/common/Avatar';
import { ProfileImageEditor } from '../../components/common/ProfileImageEditor';
const POPULAR_BANKS = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Union Bank of India',
    'IndusInd Bank',
];
export const SellerProfilePage = () => {
    const { currentUser, updateUserProfile, coupons, addCoupon } = useApp();
    const passbookInputRef = useRef(null);
    const voucherFlyerInputRef = useRef(null);
    // Active section tab
    const [activeTab, setActiveTab] = useState('profile');
    // Profile fields
    const [fullName, setFullName] = useState(currentUser?.full_name || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [craft, setCraft] = useState(currentUser?.craft_specialization || '');
    const [city, setCity] = useState(currentUser?.city || '');
    const [state, setState] = useState(currentUser?.state || '');
    const [profileImage, setProfileImage] = useState(currentUser?.profile_image || '');
    // Bank fields
    const initialBank = currentUser?.bank_details;
    const [accountHolderName, setAccountHolderName] = useState(initialBank?.account_holder_name || currentUser?.full_name || '');
    const [bankName, setBankName] = useState(initialBank?.bank_name || '');
    const [accountNumber, setAccountNumber] = useState(initialBank?.account_number || '');
    const [ifscCode, setIfscCode] = useState(initialBank?.ifsc_code || '');
    const [upiId, setUpiId] = useState(initialBank?.upi_id || '');
    const [passbookImage, setPassbookImage] = useState(initialBank?.passbook_image || '');
    const [showAccountNumber, setShowAccountNumber] = useState(false);
    const [bankSaved, setBankSaved] = useState(false);
    // New Coupon Creator fields
    const [newCouponCode, setNewCouponCode] = useState('');
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState(15);
    const [minOrder, setMinOrder] = useState(999);
    const [couponDescription, setCouponDescription] = useState('');
    const [voucherFlyerImage, setVoucherFlyerImage] = useState(null);
    const [couponSavedMsg, setCouponSavedMsg] = useState(null);
    const [saved, setSaved] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);
    const handlePassbookUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newDoc = event.target.result;
                    setPassbookImage(newDoc);
                    setBankSaved(true);
                    setTimeout(() => setBankSaved(false), 3000);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleVoucherFlyerUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setVoucherFlyerImage(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateUserProfile({
            full_name: fullName,
            bio,
            craft_specialization: craft,
            city,
            state,
            profile_image: profileImage,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };
    const handleSaveBankDetails = (e) => {
        e.preventDefault();
        updateUserProfile({
            bank_details: {
                account_holder_name: accountHolderName,
                bank_name: bankName,
                account_number: accountNumber,
                ifsc_code: ifscCode.toUpperCase().trim(),
                upi_id: upiId.toLowerCase().trim(),
                passbook_image: passbookImage,
                is_verified: true,
            },
        });
        setBankSaved(true);
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
        });
        setTimeout(() => setBankSaved(false), 3500);
    };
    const handleCreateCoupon = (e) => {
        e.preventDefault();
        if (!newCouponCode.trim())
            return;
        addCoupon({
            code: newCouponCode.toUpperCase().replace(/\s+/g, ''),
            discount_type: discountType,
            discount_value: Number(discountValue),
            min_order_amount: Number(minOrder),
            description: couponDescription || `${discountValue}${discountType === 'percentage' ? '%' : '₹'} off on artisan crafts`,
            voucher_image: voucherFlyerImage || undefined,
            created_by_artisan: currentUser?.full_name,
            is_active: true,
        });
        setCouponSavedMsg(`Coupon ${newCouponCode.toUpperCase()} published successfully!`);
        setNewCouponCode('');
        setCouponDescription('');
        setVoucherFlyerImage(null);
        confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 },
        });
        setTimeout(() => setCouponSavedMsg(null), 3000);
    };
    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Public Profile Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-heritage-terracotta mb-1">
              <User className="w-3.5 h-3.5"/>
              <span>Artisan Identity & Financial Settings</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
              Artisan Profile & Direct Payouts
            </h1>
            <p className="text-xs text-heritage-charcoal/70 mt-0.5">
              Manage your craft lineage, direct bank settlement details (PFMS/NPCI verified), and promotional store vouchers.
            </p>
          </div>

          <Link to={`/artisan/${currentUser?.username || currentUser?.full_name?.replace(/\s+/g, '-').toLowerCase() || 'artisan'}`} className="px-4 py-2.5 rounded-xl bg-heritage-brown text-heritage-gold-light hover:bg-heritage-brown-dark font-bold text-xs flex items-center space-x-2 transition shadow-sm">
            <span>View Public Artisan Profile</span>
            <ExternalLink className="w-3.5 h-3.5"/>
          </Link>
        </div>

        {/* Profile Card Summary with Interactive Avatar Upload */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-terracotta/20 shadow-3d flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <ProfileImageEditor value={profileImage} name={fullName} onChange={(image) => { setProfileImage(image); updateUserProfile({ profile_image: image }); }} />

          <div className="text-center sm:text-left space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-serif font-black text-2xl text-heritage-brown">
                {fullName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-heritage-gold/20 text-heritage-brown border border-heritage-gold/40 uppercase">
                {currentUser?.badge || 'New Artisan'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600"/>
                <span>Bank Verified</span>
              </span>
            </div>
            <p className="text-xs text-heritage-terracotta font-semibold">
              @{currentUser?.username} &bull; {craft}
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-4 text-xs text-heritage-charcoal/70 pt-1">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-heritage-terracotta"/>
                {city}, {state}
              </span>
              <span className="flex items-center text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-500"/>
                {(Number(currentUser?.rating ?? 5.0)).toFixed(1)} ({Number(currentUser?.review_count ?? 0)} reviews)
              </span>
              <span className="flex items-center text-heritage-brown font-bold">
                <Award className="w-3.5 h-3.5 mr-1 text-heritage-gold"/>
                {Number(currentUser?.credits ?? 0)} Credits
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-heritage-sand gap-2">
          <button type="button" onClick={() => setActiveTab('profile')} className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${activeTab === 'profile'
            ? 'border-heritage-terracotta text-heritage-terracotta bg-white/60 rounded-t-2xl'
            : 'border-transparent text-heritage-charcoal/70 hover:text-heritage-brown'}`}>
            <User className="w-4 h-4"/>
            <span>Profile & Heritage Story</span>
          </button>

          <button type="button" onClick={() => setActiveTab('banking')} className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${activeTab === 'banking'
            ? 'border-heritage-terracotta text-heritage-terracotta bg-white/60 rounded-t-2xl'
            : 'border-transparent text-heritage-charcoal/70 hover:text-heritage-brown'}`}>
            <Building2 className="w-4 h-4"/>
            <span>Bank Details & Cheque Upload</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          <button type="button" onClick={() => setActiveTab('coupons')} className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${activeTab === 'coupons'
            ? 'border-heritage-terracotta text-heritage-terracotta bg-white/60 rounded-t-2xl'
            : 'border-transparent text-heritage-charcoal/70 hover:text-heritage-brown'}`}>
            <Tag className="w-4 h-4"/>
            <span>Store Coupons & Vouchers</span>
          </button>
        </div>

        {/* TAB 1: PROFILE & STORY */}
        {activeTab === 'profile' && (<div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sand shadow-3d animate-fade-in">
            <h3 className="font-serif font-bold text-lg text-heritage-brown mb-4 pb-3 border-b border-heritage-sand">
              Update Profile Information
            </h3>

            {saved && (<div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600"/>
                <span>Profile details and picture updated across all listings!</span>
              </div>)}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    Full Name
                  </label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    Craft Specialization
                  </label>
                  <input type="text" value={craft} onChange={(e) => setCraft(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                </div>
              </div>

              {/* Smart Location Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    City / Village / Cluster
                  </label>
                  <LocationInput city={city} state={state} onChangeCity={setCity} onChangeState={setState}/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    State
                  </label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Artisan Story & Heritage Bio
                </label>
                <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"/>
              </div>

              <button type="submit" className="py-3 px-6 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition">
                Save Profile Changes
              </button>
            </form>
          </div>)}

        {/* TAB 2: BANK DETAILS & CHEQUE UPLOAD (Mandatory Seller Requirement) */}
        {activeTab === 'banking' && (<div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sand shadow-3d space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-heritage-sand pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-heritage-brown">
                  Bank Account & Direct Payout Settings
                </h3>
                <p className="text-xs text-heritage-charcoal/70 mt-0.5">
                  Direct settlement via ONDC Escrow, NEFT/IMPS, and UPI QR without middlemen deductions.
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1.5 self-start sm:self-auto">
                <ShieldCheck className="w-4 h-4 text-emerald-600"/>
                <span>PFMS / NPCI Verified Account</span>
              </span>
            </div>

            {bankSaved && (<div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600"/>
                <span>Bank account details and verification passbook document updated! Buyers can now settle directly into this account.</span>
              </div>)}

            <form onSubmit={handleSaveBankDetails} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    Beneficiary / Account Holder Name
                  </label>
                  <input type="text" required value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none bg-white"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    Bank Name
                  </label>
                  <div className="space-y-1">
                    <select value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none bg-white">
                      {POPULAR_BANKS.map((b) => (<option key={b} value={b}>{b}</option>))}
                      <option value="Other Regional Rural Bank">Other Regional / Gramin Bank</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-heritage-brown">
                      Bank Account Number
                    </label>
                    <button type="button" onClick={() => setShowAccountNumber(!showAccountNumber)} className="text-[10px] text-heritage-terracotta font-bold hover:underline flex items-center space-x-1">
                      {showAccountNumber ? <EyeOff className="w-3 h-3 mr-0.5"/> : <Eye className="w-3 h-3 mr-0.5"/>}
                      <span>{showAccountNumber ? 'Mask' : 'Show'}</span>
                    </button>
                  </div>
                  <input type={showAccountNumber ? 'text' : 'password'} required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-mono font-bold focus:border-heritage-terracotta outline-none bg-white"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    IFSC Code (Indian Financial System Code)
                  </label>
                  <input type="text" required value={ifscCode} onChange={(e) => setIfscCode(e.target.value.toUpperCase())} placeholder="e.g. SBIN0001234" className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-mono uppercase font-bold focus:border-heritage-terracotta outline-none bg-white"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Primary Artisan UPI ID / VPA
                </label>
                <div className="relative">
                  <input type="text" required value={upiId} onChange={(e) => setUpiId(e.target.value.toLowerCase())} placeholder="e.g. yourname@upi or 9876543210@paytm" className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-mono font-bold focus:border-heritage-terracotta outline-none bg-white pr-24"/>
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live VPA
                  </span>
                </div>
                <p className="text-[10px] text-heritage-charcoal/60 mt-1">
                  Buyers can scan your dynamic QR code or pay to this UPI ID directly at checkout.
                </p>
              </div>

              {/* PASSBOOK / CANCELLED CHEQUE UPLOAD SECTION */}
              <div className="pt-2 border-t border-heritage-sand space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-heritage-brown flex items-center space-x-1.5">
                      <FileCheck className="w-4 h-4 text-heritage-terracotta"/>
                      <span>Bank Passbook Front Page or Cancelled Cheque</span>
                    </h4>
                    <p className="text-[11px] text-heritage-charcoal/70">
                      Required for NPCI / Public Financial Management System (PFMS) direct subsidy and escrow verification.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Verified Document
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 aspect-video w-full rounded-2xl overflow-hidden border-2 border-dashed border-heritage-terracotta/40 bg-heritage-ivory/60 relative group flex items-center justify-center">
                    {passbookImage ? (<>
                        <img src={passbookImage} alt="Bank Passbook" className="w-full h-full object-cover group-hover:opacity-85 transition"/>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <button type="button" onClick={() => passbookInputRef.current?.click()} className="px-3 py-1.5 rounded-xl bg-white text-heritage-brown text-xs font-bold shadow">
                            Change Document
                          </button>
                        </div>
                      </>) : (<div className="text-center p-4">
                        <Upload className="w-8 h-8 text-heritage-terracotta mx-auto mb-1"/>
                        <span className="text-xs font-bold text-heritage-brown">Upload Cheque / Passbook</span>
                      </div>)}
                  </div>

                  <div className="sm:col-span-7 space-y-3">
                    <button type="button" onClick={() => passbookInputRef.current?.click()} className="w-full py-3 px-4 rounded-xl border border-heritage-terracotta bg-heritage-sand/30 hover:bg-heritage-sand text-xs font-bold text-heritage-terracotta flex items-center justify-center space-x-2 transition">
                      <Upload className="w-4 h-4"/>
                      <span>{passbookImage ? 'Upload Updated Passbook or Cheque' : 'Select Cheque Image from Device'}</span>
                    </button>
                    <input type="file" ref={passbookInputRef} accept="image/*,.pdf" className="hidden" onChange={handlePassbookUpload}/>
                    <div className="text-[11px] text-heritage-charcoal/60 space-y-1">
                      <p className="flex items-center space-x-1">
                        <Check className="w-3 h-3 text-emerald-600 mr-1"/>
                        <span>Clear photograph of passbook with Account No & IFSC legible</span>
                      </p>
                      <p className="flex items-center space-x-1">
                        <Check className="w-3 h-3 text-emerald-600 mr-1"/>
                        <span>Accepted formats: PNG, JPG, PDF (Max 10MB)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="py-3 px-6 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4"/>
                <span>Save Bank Details & Payout Profile</span>
              </button>
            </form>
          </div>)}

        {/* TAB 3: STORE COUPONS & VOUCHERS MANAGEMENT (User Request) */}
        {activeTab === 'coupons' && (<div className="space-y-6 animate-fade-in">
            {/* Create New Voucher Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sand shadow-3d space-y-5">
              <div className="flex items-center justify-between border-b border-heritage-sand pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-heritage-brown flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-heritage-terracotta"/>
                    <span>Create New Artisan Store Coupon / Voucher</span>
                  </h3>
                  <p className="text-xs text-heritage-charcoal/70 mt-0.5">
                    Create special promotional discount codes and upload gift certificates for buyers to redeem at checkout.
                  </p>
                </div>
              </div>

              {couponSavedMsg && (<div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600"/>
                  <span>{couponSavedMsg}</span>
                </div>)}

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-heritage-brown mb-1">
                      Coupon Code
                    </label>
                    <input type="text" required value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())} placeholder="e.g. CRAFT2026 or DIWALI15" className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-mono uppercase font-bold focus:border-heritage-terracotta outline-none"/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-heritage-brown mb-1">
                      Discount Type
                    </label>
                    <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-bold focus:border-heritage-terracotta outline-none bg-white">
                      <option value="percentage">Percentage Discount (%)</option>
                      <option value="fixed">Flat Cash Discount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-heritage-brown mb-1">
                      Discount Amount ({discountType === 'percentage' ? '%' : '₹'})
                    </label>
                    <input type="number" required min={1} max={discountType === 'percentage' ? 80 : 5000} value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-bold focus:border-heritage-terracotta outline-none"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-heritage-brown mb-1">
                      Minimum Order Value (₹)
                    </label>
                    <input type="number" min={0} value={minOrder} onChange={(e) => setMinOrder(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-bold focus:border-heritage-terracotta outline-none"/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-heritage-brown mb-1">
                      Description / Terms
                    </label>
                    <input type="text" value={couponDescription} onChange={(e) => setCouponDescription(e.target.value)} placeholder="e.g. Special festive discount on all handloom orders" className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"/>
                  </div>
                </div>

                {/* Upload Voucher Flyer / Certificate */}
                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    Upload Voucher Graphic / Gift Certificate (Optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    <button type="button" onClick={() => voucherFlyerInputRef.current?.click()} className="py-2.5 px-4 rounded-xl border border-dashed border-heritage-terracotta bg-heritage-sand/30 hover:bg-heritage-sand text-xs font-bold text-heritage-terracotta flex items-center space-x-1.5 transition">
                      <Upload className="w-3.5 h-3.5"/>
                      <span>{voucherFlyerImage ? 'Replace Voucher Graphic' : 'Upload Voucher Flyer'}</span>
                    </button>
                    {voucherFlyerImage && (<div className="flex items-center space-x-2">
                        <img src={voucherFlyerImage} alt="Voucher Flyer" className="w-10 h-10 rounded-lg object-cover border border-heritage-sand"/>
                        <button type="button" onClick={() => setVoucherFlyerImage(null)} className="text-xs text-red-600 hover:underline font-bold">
                          Remove
                        </button>
                      </div>)}
                    <input type="file" ref={voucherFlyerInputRef} accept="image/*" className="hidden" onChange={handleVoucherFlyerUpload}/>
                  </div>
                </div>

                <button type="submit" className="py-3 px-6 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition flex items-center space-x-2">
                  <Plus className="w-4 h-4"/>
                  <span>Publish Store Voucher</span>
                </button>
              </form>
            </div>

            {/* List of Active Store Coupons */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sand shadow-3d space-y-4">
              <h3 className="font-serif font-bold text-lg text-heritage-brown border-b border-heritage-sand pb-3">
                Active Store Vouchers ({coupons.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map((c) => (<div key={c.id} className="p-4 rounded-2xl border border-dashed border-heritage-terracotta/40 bg-heritage-ivory/50 flex items-start justify-between space-x-3 relative overflow-hidden group hover:border-heritage-terracotta transition">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-lg bg-heritage-brown text-heritage-gold font-mono font-black text-xs">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-heritage-brown mt-1">
                        {c.description}
                      </p>
                      <p className="text-[10px] text-heritage-charcoal/60">
                        Min. Order: ₹{c.min_order_amount?.toLocaleString('en-IN') || 'None'}
                      </p>
                    </div>

                    <button type="button" onClick={() => copyCode(c.code)} className="p-2 rounded-xl bg-white border border-heritage-sand hover:border-heritage-terracotta text-heritage-brown transition shrink-0" title="Copy Coupon Code">
                      {copiedCode === c.code ? (<Check className="w-4 h-4 text-emerald-600"/>) : (<Copy className="w-4 h-4"/>)}
                    </button>
                  </div>))}
              </div>
            </div>
          </div>)}
      </div>
    </div>);
};
