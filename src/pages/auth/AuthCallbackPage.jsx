import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { useApp } from '../../context/AppContext';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { updateUserProfile } = useApp();
  const [errorMsg, setErrorMsg] = useState('');
  const [statusText, setStatusText] = useState('Finalizing secure authentication...');

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) setErrorMsg('Authentication gateway not available.');
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const errorCode = params.get('error_code');
      const errorDescription = params.get('error_description');

      if (errorCode || errorDescription) {
        if (isMounted) {
          setErrorMsg('Google sign-in session expired. Please start Google sign-in again.');
          setStatusText('Google sign-in session expired. Please start Google sign-in again.');
        }
        return;
      }

      const exchangeKey = `karigarsetu_oauth_callback_processed:${window.location.search}`;
      if (sessionStorage.getItem(exchangeKey) === '1') {
        if (isMounted) {
          setStatusText('Authentication already processed. Redirecting to your portal...');
        }
      }

      try {
        if (code && sessionStorage.getItem(exchangeKey) !== '1') {
          sessionStorage.setItem(exchangeKey, '1');
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            if (exchangeError.message?.toLowerCase().includes('bad_oauth_state') || exchangeError.code === 'bad_oauth_state') {
              throw new Error('Google sign-in session expired. Please start Google sign-in again.');
            }
            throw exchangeError;
          }
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session?.user) {
          const authUser = session.user;
          const pendingRole = localStorage.getItem('karigarsetu_pending_role') || null;
          localStorage.setItem('karigarsetu_auth_session_active_v3', 'true');

          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          let userRole = existingProfile?.role || pendingRole || null;
          if (!existingProfile && !pendingRole) {
            throw new Error('This Google account is not linked to an existing KSG profile. Please sign up or sign in with a registered account.');
          }

          if (!existingProfile && pendingRole) {
            const newProfile = {
              id: authUser.id,
              full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Artisan Patron',
              username: authUser.user_metadata?.user_name || authUser.email?.split('@')[0] || `user_${authUser.id.slice(0, 8)}`,
              email: authUser.email || '',
              mobile: authUser.phone || '',
              profile_image: authUser.user_metadata?.avatar_url || '',
              role: pendingRole,
              city: 'Bengaluru',
              state: 'Karnataka',
              bio: '',
              craft_specialization: '',
              credits: pendingRole === 'seller' ? 50 : 0,
              badge: 'New Artisan',
              rating: 5.0,
            };

            await supabase.from('profiles').upsert(newProfile);
          }

          if (!userRole) {
            throw new Error('Your Google account is not linked to a verified buyer or seller profile.');
          }

          if (isMounted) {
            setStatusText('Authentication verified! Redirecting to your portal...');
            setTimeout(() => {
              sessionStorage.removeItem(exchangeKey);
              localStorage.removeItem('karigarsetu_pending_role');
              if (userRole === 'seller') {
                navigate('/seller/dashboard', { replace: true });
              } else if (userRole === 'admin') {
                navigate('/admin/dashboard', { replace: true });
              } else {
                navigate('/buyer/dashboard', { replace: true });
              }
            }, 600);
          }
        } else {
          const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (newSession?.user && isMounted) {
              const role = localStorage.getItem('karigarsetu_pending_role') || null;
              if (!role) {
                navigate('/login', { replace: true });
                return;
              }
              navigate(role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard', { replace: true });
            }
          });

          setTimeout(() => {
            if (isMounted && !errorMsg) {
              sessionStorage.removeItem(exchangeKey);
              navigate('/login', { replace: true });
            }
          }, 3000);

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err) {
        console.error('OAuth Callback Error:', err);
        if (isMounted) {
          const expiredMessage = err?.message?.includes('Google sign-in session expired')
            ? 'Google sign-in session expired. Please start Google sign-in again.'
            : 'Authentication failed or expired. Please sign in again.';
          setErrorMsg(expiredMessage);
          setStatusText(expiredMessage);
          sessionStorage.removeItem(exchangeKey);
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, updateUserProfile]);

  return (
    <div className="min-h-screen bg-heritage-ivory flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-heritage-sand shadow-3d text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-heritage-terracotta/10 flex items-center justify-center text-heritage-terracotta">
          {errorMsg ? (
            <AlertCircle className="w-8 h-8 text-red-600" />
          ) : (
            <RefreshCw className="w-8 h-8 animate-spin" />
          )}
        </div>

        <h2 className="font-serif font-black text-2xl text-heritage-brown">
          {errorMsg ? 'Authentication Notice' : 'Connecting to KARIGARSETU.AI'}
        </h2>

        <p className="text-xs sm:text-sm text-heritage-charcoal/70 font-medium">
          {errorMsg || statusText}
        </p>

        {errorMsg && (
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2.5 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition"
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
};
