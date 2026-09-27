import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Hammer,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Check,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LocationInput } from '../../components/common/LocationInput';
import { ProfileImageEditor } from '../../components/common/ProfileImageEditor';
import { sendSupabaseOtp, verifySupabaseOtp } from '../../services/supabase';
import { OtpInputModal } from '../../components/common/OtpInputModal';
import { getTranslation } from '../../i18n/translations';

export const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'seller';
  const [role, setRole] = useState(initialRole);
  const { signup, language } = useApp();
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    district: '',
    postalCode: '',
    latitude: null,
    longitude: null,
    craftSpecialization: '',
    bio: '',
    profileImage: '',
    gender: 'PREFER_NOT_TO_SAY',
    avatar: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Verification State
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verifiedContact, setVerifiedContact] = useState('');
  const [otpChannel, setOtpChannel] = useState('email');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendSignupOtp = async (channel) => {
    setErrorMsg('');
    const target = channel === 'mobile' ? formData.mobile.trim() : formData.email.trim();

    if (channel === 'mobile' && target.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number above first.');
      return;
    }
    if (channel === 'email' && (!target.includes('@') || target.length < 5)) {
      setErrorMsg('Please enter a valid email address above first.');
      return;
    }

    setOtpChannel(channel);
    try {
      localStorage.setItem('karigarsetu_pending_role', role);
      await sendSupabaseOtp({ channel, value: target });
      setResendCooldown(45);
      setIsOtpModalOpen(true);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to send OTP. Please try again.');
    }
  };

  const handleVerifySignupOtpModal = async (token) => {
    const target = otpChannel === 'mobile' ? formData.mobile.trim() : formData.email.trim();
    try {
      await verifySupabaseOtp({
        channel: otpChannel,
        value: target,
        token,
      });

      setIsOtpVerified(true);
      setVerifiedContact(target);
      setIsOtpModalOpen(false);
    } catch (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('expired')) {
        throw new Error('OTP expired. Please request a new code.');
      } else {
        throw new Error('Invalid OTP code. Please check and retry.');
      }
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Lakshadweep', 'Puducherry',
  ];

  const genderOptions = [
    { value: 'MALE', label: t('common.male') },
    { value: 'FEMALE', label: t('common.female') },
    { value: 'PREFER_NOT_TO_SAY', label: t('common.preferNotToSay') },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.state || !formData.city.trim()) {
      setErrorMsg('Please select a state and enter your city, village, or cluster.');
      return;
    }
    if (!isOtpVerified) {
      setErrorMsg('Please verify your email or mobile number with OTP before completing account creation.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const nextProfileImage = formData.profileImage || formData.avatar || '';

      signup(
        {
          full_name: formData.fullName,
          username: formData.username,
          email: formData.email,
          mobile: formData.mobile,
          city: formData.city,
          state: formData.state,
          district: formData.district,
          postal_code: formData.postalCode,
          latitude: formData.latitude,
          longitude: formData.longitude,
          craft_specialization: role === 'seller' ? formData.craftSpecialization : undefined,
          bio: formData.bio,
          profile_image: nextProfileImage,
          avatar: nextProfileImage,
          gender: formData.gender || 'PREFER_NOT_TO_SAY',
          password: formData.password,
        },
        role
      );

      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/buyer/marketplace');
      }
    } catch (err) {
      setErrorMsg('Account registration encountered an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-ivory bg-heritage-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <img
              src="/assets/karigarsetu-ai-logo.png"
              alt="KARIGARSETU.AI Official Logo"
              className="h-14 w-14 rounded-full object-contain shadow-md border-2 border-heritage-gold/50 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col text-left">
              <span className="font-display font-black text-2xl tracking-wider text-heritage-brown leading-none">
                KARIGARSETU.AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-terracotta mt-1">
                From Artisan to Market — Powered by AI
              </span>
            </div>
          </Link>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-heritage-brown mt-3">
            What would you like to use KARIGARSETU.AI for?
          </h2>
          <p className="text-xs text-heritage-charcoal/70 mt-1 font-medium">
            Choose a role for your account and continue to secure verification.
          </p>
        </div>

        {/* Selected Role Pill Selector */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex p-1 bg-white rounded-2xl border border-heritage-sand shadow-sm">
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
                role === 'seller'
                  ? 'bg-heritage-terracotta text-white shadow-sm'
                  : 'text-heritage-charcoal/70 hover:text-heritage-brown'
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>🏪 Artisan / Seller</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
                role === 'buyer'
                  ? 'bg-heritage-brown text-heritage-gold-light shadow-sm'
                  : 'text-heritage-charcoal/70 hover:text-heritage-brown'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>🛍️ Buyer / Patron</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-heritage-terracotta/20 shadow-3d">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-heritage-sand/30 rounded-2xl border border-heritage-sand">
              <label className="block text-xs font-bold text-heritage-brown mb-3">
                {t('profile.profilePhoto')}
              </label>
              <ProfileImageEditor
                value={formData.profileImage || formData.avatar}
                name={formData.fullName || 'User'}
                onChange={(profileImage) => setFormData((prev) => ({ ...prev, profileImage, avatar: profileImage }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  {t('profile.fullName')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  {t('profile.username')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                  placeholder="e.g. rameshcrafts"
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-heritage-brown">
                {t('profile.gender')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={formData.gender === option.value}
                    onClick={() => setFormData((prev) => ({ ...prev, gender: option.value }))}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-terracotta ${
                      formData.gender === option.value
                        ? 'border-transparent bg-[#C8702A] text-white'
                        : 'border-[#E8DCCB] bg-white text-[#1A3A5C] hover:border-heritage-terracotta/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                    placeholder="ramesh@artisan.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Mobile Number (with WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                  />
                </div>
              </div>
            </div>

            {/* OTP Verification Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-heritage-sand/40 to-heritage-ivory border border-heritage-terracotta/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-heritage-terracotta" />
                  <span className="text-xs font-bold text-heritage-brown">
                    Contact Verification
                  </span>
                </div>
                {isOtpVerified ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    Verification Required
                  </span>
                )}
              </div>

              {isOtpVerified ? (
                <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-medium">
                      Verified contact: <strong className="font-mono">{verifiedContact}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOtpVerified(false)}
                    className="text-[10px] text-emerald-700 underline font-semibold hover:text-emerald-900"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-heritage-charcoal/70">
                    Authenticate your contact details before submitting registration:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendSignupOtp('email')}
                      disabled={isSubmitting || isOtpModalOpen}
                      className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-white border border-heritage-sand hover:border-heritage-terracotta hover:bg-heritage-sand/20 text-xs font-bold text-heritage-brown flex items-center justify-center space-x-1.5 transition shadow-2xs disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Mail className="w-3.5 h-3.5 text-heritage-terracotta" />
                      <span>{isSubmitting ? 'Sending OTP...' : 'Verify with Email OTP'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendSignupOtp('mobile')}
                      className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-white border border-heritage-sand hover:border-heritage-terracotta hover:bg-heritage-sand/20 text-xs font-bold text-heritage-brown flex items-center justify-center space-x-1.5 transition shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-heritage-terracotta" />
                      <span>Verify with Mobile SMS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  State *
                </label>
                <select
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                >
                  <option value="">Select State</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  City / Village / Cluster *
                </label>
                <LocationInput
                  city={formData.city}
                  state={formData.state}
                  onChangeCity={(city) => setFormData((prev) => ({ ...prev, city }))}
                  onChangeState={(state) => setFormData((prev) => ({ ...prev, state }))}
                  onLocationDetails={(details) =>
                    setFormData((prev) => ({ ...prev, ...details, postalCode: details.postalCode || '' }))
                  }
                />
              </div>
            </div>

            {role === 'seller' && (
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Craft Specialization / Tradition *
                </label>
                <input
                  type="text"
                  required
                  value={formData.craftSpecialization}
                  onChange={(e) => setFormData({ ...formData, craftSpecialization: e.target.value })}
                  placeholder="e.g. Traditional Teakwood Carving, Pit-Loom Cotton, Bell Metal"
                  className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-heritage-brown mb-1">
                Bio / Artisan Story
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your lineage, generations of practice, or passion for authentic handmade crafts..."
                className="w-full px-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C8702A] to-[#A8561D] hover:shadow-lg text-white font-bold text-sm shadow-3d hover:scale-101 transition flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Account Creation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-heritage-charcoal/70 font-medium mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-heritage-terracotta hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>

      {/* Premium 6-Box OTP Verification Modal */}
      <OtpInputModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        channel={otpChannel}
        targetValue={otpChannel === 'mobile' ? formData.mobile : formData.email}
        onVerify={handleVerifySignupOtpModal}
        onResend={() => handleSendSignupOtp(otpChannel)}
        onChangeContact={() => setIsOtpModalOpen(false)}
        resendCooldown={resendCooldown}
      />
    </div>
  );
};
