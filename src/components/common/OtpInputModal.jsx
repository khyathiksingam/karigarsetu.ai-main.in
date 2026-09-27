import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, RefreshCw, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OtpInputModal = ({
  isOpen,
  onClose,
  channel = 'email', // 'email' | 'mobile' | 'whatsapp'
  targetValue = '',
  onVerify,
  onResend,
  onChangeContact,
  resendCooldown = 0,
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const inputRefs = useRef([]);

  // Reset digits when modal opens
  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setErrorMsg('');
      setSuccessMsg('');
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, targetValue]);

  // Mask contact info for display
  const getMaskedTarget = () => {
    if (!targetValue) return '';
    if (channel === 'email') {
      const [user, domain] = targetValue.split('@');
      if (!domain) return targetValue;
      const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
      return `${maskedUser}@${domain}`;
    }
    // Phone
    const digitsOnly = targetValue.replace(/\D/g, '');
    if (digitsOnly.length >= 10) {
      const prefix = digitsOnly.slice(0, 2);
      const suffix = digitsOnly.slice(-3);
      return `+91 ${prefix}*** **${suffix}`;
    }
    return targetValue;
  };

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Single digit input
    const char = clean[clean.length - 1];
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg('');

    // Auto-focus next box
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);
    setErrorMsg('');

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // If all 6 digits are pasted, trigger auto submit
    if (pasted.length === 6) {
      triggerSubmit(pasted);
    }
  };

  const triggerSubmit = async (fullOtp) => {
    const code = fullOtp || digits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      await onVerify(code);
      setSuccessMsg('Verification successful!');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerSubmit();
  };

  const handleResendClick = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setErrorMsg('');
    try {
      await onResend();
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMsg(err.message || 'Unable to resend OTP. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-heritage-sand overflow-hidden"
        >
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full text-heritage-charcoal/50 hover:text-heritage-brown hover:bg-heritage-sand/40 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-gradient-to-br from-[#C8702A]/20 to-[#D7B36A]/20 flex items-center justify-center text-heritage-terracotta border border-[#C8702A]/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-black text-2xl text-heritage-brown">
              Verify Your {channel === 'email' ? 'Email' : 'Contact'}
            </h3>
            <p className="text-xs text-heritage-charcoal/70 mt-1 font-medium">
              We have sent a 6-digit verification code to
            </p>
            <p className="text-sm font-mono font-bold text-heritage-terracotta mt-0.5">
              {getMaskedTarget()}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 6 OTP Boxes Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center items-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-black text-xl sm:text-2xl rounded-2xl border-2 border-heritage-sand bg-heritage-ivory/50 text-heritage-brown focus:border-heritage-terracotta focus:bg-white focus:ring-2 focus:ring-heritage-terracotta/20 outline-none transition-all shadow-inner"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || digits.join('').length < 6}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
                digits.join('').length === 6 && !isLoading
                  ? 'bg-gradient-to-r from-[#C8702A] to-[#A8561D] text-white hover:shadow-lg hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Footer with Resend countdown and change contact */}
            <div className="flex items-center justify-between text-xs text-heritage-charcoal/70 pt-2 border-t border-heritage-sand">
              <div>
                {resendCooldown > 0 ? (
                  <span className="font-semibold text-gray-400">
                    Didn't receive code? Resend in <strong className="font-mono text-heritage-terracotta">{resendCooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendClick}
                    className="font-bold text-heritage-terracotta hover:underline flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>
                )}
              </div>

              {onChangeContact && (
                <button
                  type="button"
                  onClick={onChangeContact}
                  className="font-semibold text-heritage-charcoal/60 hover:text-heritage-brown hover:underline"
                >
                  Change {channel === 'email' ? 'Email' : 'Number'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
