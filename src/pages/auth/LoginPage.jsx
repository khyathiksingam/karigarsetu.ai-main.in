import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Phone, CheckCircle, ArrowRight, AlertCircle, Mail, RefreshCw, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sendSupabaseOtp, verifySupabaseOtp, signInWithGoogle } from '../../services/supabase';
import { OtpInputModal } from '../../components/common/OtpInputModal';

export const LoginPage = () => {
  const { login, currentUser, setAuthenticatedSession, findExistingAccountByEmail } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [authMethod, setAuthMethod] = useState('credentials'); // 'credentials' | 'otp'
  const [rememberMe, setRememberMe] = useState(true);
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPortalRole, setSelectedPortalRole] = useState(null); // 'SELLER' | 'BUYER'

  const [otpTargetType, setOtpTargetType] = useState('email'); // 'email' | 'mobile' | 'whatsapp'
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal OTP state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (currentUser && location.pathname === '/login') {
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (currentUser.role === 'seller') {
        navigate('/seller/dashboard', { replace: true });
      } else {
        navigate('/buyer/dashboard', { replace: true });
      }
    }
  }, [currentUser, location.pathname, navigate]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const success = login(identity, password);
      if (success) {
        if (rememberMe) {
          localStorage.setItem('karigarsetu_remembered_identity', identity);
        } else {
          localStorage.removeItem('karigarsetu_remembered_identity');
        }

        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else {
          const savedUser = localStorage.getItem('karigarsetu_user_v3');
          const role = savedUser ? JSON.parse(savedUser).role : 'seller';
          if (role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else if (role === 'buyer') {
            navigate('/buyer/dashboard', { replace: true });
          } else {
            navigate('/seller/dashboard', { replace: true });
          }
        }
      } else {
        setErrorMsg('Invalid username/email or password.');
      }
    } catch (err) {
      setErrorMsg('Sign-in failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const targetContact = otpTargetType === 'email' ? email.trim() : mobile.trim();

    if (otpTargetType !== 'email' && targetContact.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (otpTargetType === 'email' && (!targetContact.includes('@') || targetContact.length < 5)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      if (otpTargetType === 'email') {
        const existingAccount = await findExistingAccountByEmail(targetContact);
        if (!existingAccount) {
          setErrorMsg('Account not found. Please create an account first.');
          return;
        }
      }

      await sendSupabaseOtp({ channel: otpTargetType, value: targetContact });
      setResendCooldown(45);
      setIsOtpModalOpen(true);
      setSuccessMsg('OTP sent successfully.');
    } catch (error) {
      const raw = error.message || '';
      if (raw.toLowerCase().includes('rate') || raw.toLowerCase().includes('wait')) {
        setErrorMsg('Too many requests. Please wait a moment before trying again.');
      } else if (otpTargetType === 'whatsapp') {
        setErrorMsg(raw || 'WhatsApp provider is not configured.');
      } else if (otpTargetType === 'mobile') {
        setErrorMsg(raw || 'SMS provider is not configured.');
      } else {
        setErrorMsg(raw || 'Email delivery failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpModal = async (token) => {
    const targetContact = otpTargetType === 'email' ? email.trim() : mobile.trim();
    try {
      await verifySupabaseOtp({
        channel: otpTargetType,
        value: targetContact,
        token,
      });

      const normalizedEmail = targetContact.toLowerCase();
      const existingAccount = await findExistingAccountByEmail(normalizedEmail);
      if (!existingAccount) {
        throw new Error('Account not found. Please create an account first.');
      }

      const accountProfile = existingAccount.profile || existingAccount;
      const resolvedRole = accountProfile.role || (Array.isArray(accountProfile.roles) ? accountProfile.roles[0] : null);
      if (!resolvedRole) {
        throw new Error('Your account setup is incomplete. Please complete your profile.');
      }

      const sessionProfile = {
        ...accountProfile,
        id: accountProfile.id || `otp_${normalizedEmail.replace(/[^a-z0-9]/g, '')}_${Date.now()}`,
        full_name: accountProfile.full_name || accountProfile.name || normalizedEmail.split('@')[0] || 'Artisan Patron',
        username: accountProfile.username || normalizedEmail.split('@')[0] || 'artisan_patron',
        email: normalizedEmail,
        mobile: otpTargetType === 'email' ? accountProfile.mobile || '' : targetContact,
        role: resolvedRole,
        roles: Array.isArray(accountProfile.roles) && accountProfile.roles.length ? accountProfile.roles : [resolvedRole],
        city: accountProfile.city || 'Bengaluru',
        state: accountProfile.state || 'Karnataka',
      };

      setAuthenticatedSession(sessionProfile, resolvedRole);
      setIsOtpModalOpen(false);

      if (rememberMe) {
        localStorage.setItem('karigarsetu_remembered_identity', targetContact);
      }

      if (resolvedRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (resolvedRole === 'seller') {
        navigate('/seller/dashboard', { replace: true });
      } else {
        navigate('/buyer/dashboard', { replace: true });
      }
    } catch (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('expired')) {
        throw new Error('OTP expired. Please request a new OTP.');
      } else if (msg.includes('too many')) {
        throw new Error('Too many attempts. Please try again later.');
      } else {
        throw new Error('Invalid OTP. Please check the code.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    if (sessionStorage.getItem('karigarsetu_google_oauth_inflight') === '1') {
      setErrorMsg('Google sign-in is already in progress. Please wait for the browser redirect.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setErrorMsg(err?.message || 'Google authentication is not configured correctly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-ivory bg-heritage-pattern flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        {/* Brand Header */}
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
          <h2 className="font-serif font-black text-2xl text-heritage-brown mt-4">
            Welcome Back
          </h2>
          <p className="text-xs text-heritage-charcoal/70 mt-1 font-medium">
            Sign in to manage your crafts, orders, and AI appraisals.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-terracotta/20 shadow-3d">
          {/* Method Tabs */}
          <div className="flex border-b border-heritage-sand pb-4 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('credentials');
                setErrorMsg('');
              }}
              className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 transition ${
                authMethod === 'credentials'
                  ? 'border-heritage-terracotta text-heritage-terracotta'
                  : 'border-transparent text-heritage-charcoal/60 hover:text-heritage-brown'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setErrorMsg('');
              }}
              className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 transition ${
                authMethod === 'otp'
                  ? 'border-heritage-terracotta text-heritage-terracotta'
                  : 'border-transparent text-heritage-charcoal/60 hover:text-heritage-brown'
              }`}
            >
              OTP Verification
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && !errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authMethod === 'credentials' ? (
            /* Username + Password Form */
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    required
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium text-heritage-charcoal focus:border-heritage-terracotta outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-heritage-brown">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium text-heritage-charcoal focus:border-heritage-terracotta outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-heritage-terracotta border-heritage-sand focus:ring-heritage-terracotta cursor-pointer accent-heritage-terracotta"
                  />
                  <span className="text-xs text-heritage-charcoal/80 font-medium">
                    Remember login session
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#C8702A] to-[#A8561D] hover:shadow-lg text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          ) : (
            /* Multi-Channel OTP Flow */
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Channel Switcher */}
              <div className="flex items-center space-x-1.5 bg-heritage-sand/40 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setOtpTargetType('email');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center space-x-1 ${
                    otpTargetType === 'email'
                      ? 'bg-heritage-terracotta text-white shadow-xs'
                      : 'text-heritage-brown hover:bg-white/50'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpTargetType('mobile');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center space-x-1 ${
                    otpTargetType === 'mobile'
                      ? 'bg-heritage-terracotta text-white shadow-xs'
                      : 'text-heritage-brown hover:bg-white/50'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpTargetType('whatsapp');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center space-x-1 ${
                    otpTargetType === 'whatsapp'
                      ? 'bg-heritage-terracotta text-white shadow-xs'
                      : 'text-heritage-brown hover:bg-white/50'
                  }`}
                >
                  <span>WhatsApp</span>
                </button>
              </div>

              {otpTargetType === 'email' ? (
                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium text-heritage-charcoal focus:border-heritage-terracotta outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-heritage-charcoal/60 mt-1">
                    We will send a 6-digit verification code via Resend delivery.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-heritage-brown mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium text-heritage-charcoal focus:border-heritage-terracotta outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-heritage-charcoal/60 mt-1">
                    {otpTargetType === 'whatsapp' ? 'We will deliver a 6-digit code via WhatsApp.' : 'We will send a 6-digit code via SMS.'}
                  </p>
                </div>
              )}

              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-heritage-brown">
                  Portal Role
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={selectedPortalRole === 'SELLER'}
                    onClick={() => setSelectedPortalRole('SELLER')}
                    className={`group rounded-2xl border px-3 py-3 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-terracotta focus-visible:ring-offset-2 ${
                      selectedPortalRole === 'SELLER'
                        ? 'border-transparent bg-[#C8702A] text-white shadow-md'
                        : 'border-[#E8DCCB] bg-white text-[#1A3A5C] hover:border-heritage-terracotta/50 hover:bg-heritage-ivory'
                    }`}
                  >
                    <span className="block text-sm font-bold leading-tight">Artisan / Seller</span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={selectedPortalRole === 'BUYER'}
                    onClick={() => setSelectedPortalRole('BUYER')}
                    className={`group rounded-2xl border px-3 py-3 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-terracotta focus-visible:ring-offset-2 ${
                      selectedPortalRole === 'BUYER'
                        ? 'border-transparent bg-[#C8702A] text-white shadow-md'
                        : 'border-[#E8DCCB] bg-white text-[#1A3A5C] hover:border-heritage-terracotta/50 hover:bg-heritage-ivory'
                    }`}
                  >
                    <span className="block text-sm font-bold leading-tight">Buyer / Patron</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C8702A] to-[#A8561D] hover:shadow-lg text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Google Sign-In */}
          <div className="mt-6 border-t border-heritage-sand pt-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-heritage-sand hover:bg-heritage-sand/40 text-xs font-bold text-heritage-brown flex items-center justify-center space-x-2 transition shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M21.35 12.27c0-.74-.07-1.45-.21-2.13H12v4.03h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.15c1.84-1.7 2.9-4.2 2.9-7.29Z" />
                <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.15-2.45c-.87.58-1.98.93-3.3.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.75Z" />
                <path fill="#FBBC05" d="M6.53 13.85a5.86 5.86 0 0 1 0-3.7V7.62H3.28a9.75 9.75 0 0 0 0 8.76l3.25-2.53Z" />
                <path fill="#EA4335" d="M12 6.12c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.23 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.72 5.37l3.25 2.53C7.3 7.84 9.46 6.12 12 6.12Z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-heritage-charcoal/70 font-medium mt-6">
          New to KARIGARSETU.AI?{' '}
          <Link to="/select-role" className="font-bold text-heritage-terracotta hover:underline">
            Choose Role & Join
          </Link>
        </p>
      </div>

      {/* Premium 6-box OTP Verification Modal */}
      <OtpInputModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        channel={otpTargetType}
        targetValue={otpTargetType === 'email' ? email : mobile}
        onVerify={handleVerifyOtpModal}
        onResend={handleSendOtp}
        onChangeContact={() => setIsOtpModalOpen(false)}
        resendCooldown={resendCooldown}
      />
    </div>
  );
};
