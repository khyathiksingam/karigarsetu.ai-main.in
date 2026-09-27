import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COUPONS } from '../data/seedData';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const AppContext = createContext(undefined);

const STORAGE_KEYS = {
  USER: 'karigarsetu_user_v3',
  ROLE: 'karigarsetu_role_v3',
  AUTH_SESSION: 'karigarsetu_auth_session_active_v3',
  REGISTERED_USERS: 'karigarsetu_registered_users_v3',
  PRODUCTS: 'karigarsetu_products_v3',
  CART: 'karigarsetu_cart_v3',
  WISHLIST: 'karigarsetu_wishlist_v3',
  ORDERS: 'karigarsetu_orders_v3',
  CREDITS: 'karigarsetu_credits_v3',
  REVIEWS: 'karigarsetu_reviews_v3',
  MESSAGES: 'karigarsetu_messages_v3',
  COUPONS: 'karigarsetu_coupons',
};

const DEFAULT_ACCOUNTS = [];

function normalizeRoles(profile, fallbackRole = null) {
  const explicitRoles = Array.isArray(profile?.roles) ? profile.roles.filter(Boolean) : [];
  const legacyRole = profile?.role || fallbackRole;
  const merged = [...new Set([...(explicitRoles || []), legacyRole, fallbackRole].filter(Boolean))];
  return merged.length ? merged : fallbackRole ? [fallbackRole] : [];
}

function normalizeProfile(profile, fallbackRole = null) {
  const normalizedRoles = normalizeRoles(profile, fallbackRole);
  const activeRole = profile?.role || fallbackRole || normalizedRoles[0] || null;
  return {
    ...profile,
    gender: profile?.gender || 'PREFER_NOT_TO_SAY',
    avatar: profile?.avatar || profile?.profile_image || '',
    role: activeRole,
    roles: normalizedRoles,
  };
}

function getBadgeForCredits(credits) {
  if (credits >= 1600) return 'Master Karigar';
  if (credits >= 1000) return 'Trusted Artisan';
  if (credits >= 500) return 'Rising Karigar';
  return 'New Artisan';
}

export const AppProvider = ({ children }) => {
  // Load persistent state: first-time visitors start logged out as guests
  const [currentUser, setCurrentUser] = useState(() => {
    const hasActiveSession = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
    if (!hasActiveSession) {
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return normalizeProfile(parsed, parsed?.role || null);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const hasActiveSession = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
    if (hasActiveSession) {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (saved) return saved;
      if (currentUser?.role) return currentUser.role;
    }
    return null;
  });

  const [language, setLanguage] = useState(() => localStorage.getItem('karigarsetu_language') || 'en');

  useEffect(() => {
    localStorage.setItem('karigarsetu_language', language);
  }, [language]);

  // Sync Supabase Auth session & Profile
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;

    const syncSession = async (session) => {
      const authUser = session?.user;
      if (!authUser) {
        setCurrentUser(null);
        setCurrentRole(null);
        localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ROLE);
        localStorage.removeItem('karigarsetu_pending_role');
        localStorage.removeItem('karigarsetu_google_role');
        return;
      }

      const pendingRole =
        localStorage.getItem('karigarsetu_google_role') ||
        localStorage.getItem('karigarsetu_pending_role') ||
        null;

      // Fetch existing profile from Supabase
      try {
        const { data: dbProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        let profile;
        if (dbProfile && !error) {
          profile = normalizeProfile(dbProfile, pendingRole);
        } else {
          profile = normalizeProfile(
            {
              id: authUser.id,
              email: authUser.email || '',
              username:
                authUser.user_metadata?.user_name ||
                authUser.email?.split('@')[0] ||
                `user_${authUser.id.slice(0, 8)}`,
              full_name:
                authUser.user_metadata?.full_name ||
                authUser.user_metadata?.name ||
                authUser.email?.split('@')[0] ||
                'Artisan Patron',
              profile_image: authUser.user_metadata?.avatar_url || '',
              mobile: authUser.phone || '',
              city: 'Bengaluru',
              state: 'Karnataka',
              role: pendingRole,
              roles: [pendingRole],
              credits: pendingRole === 'seller' ? 50 : 0,
              badge: 'New Artisan',
              bio: '',
            },
            pendingRole
          );
          // Insert profile into database
          await supabase.from('profiles').upsert({ ...profile, role: profile.role, roles: profile.roles });
        }

        setCurrentUser(profile);
        setCurrentRole(profile.role);
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
        localStorage.setItem(STORAGE_KEYS.ROLE, profile.role);
        localStorage.removeItem('karigarsetu_google_role');
        localStorage.removeItem('karigarsetu_pending_role');
      } catch (err) {
        console.warn('Profile sync notice:', err.message);
      }
    };

    supabase.auth.getSession().then(({ data }) => syncSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => syncSession(session));

    return () => listener.subscription.unsubscribe();
  }, []);

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Load products from Supabase on mount if available
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    async function fetchSupabaseProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, seller:profiles(*)');
        if (data && data.length > 0 && !error) {
          const mapped = data.map((p) => ({
            ...p,
            seller: p.seller || {
              id: p.seller_id,
              full_name: 'Verified Artisan',
              city: p.city,
              state: p.state,
            },
          }));
          setProducts((prev) => {
            // Merge without duplicates
            const existingIds = new Set(mapped.map((m) => m.id));
            const uniquePrev = prev.filter((item) => !existingIds.has(item.id));
            return [...mapped, ...uniquePrev];
          });
        }
      } catch (err) {
        console.warn('Supabase products fetch notice:', err.message);
      }
    }
    fetchSupabaseProducts();
  }, []);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [creditTransactions, setCreditTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CREDITS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_COUPONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (currentUser) {
      const persistedUser = {
        ...currentUser,
        role: currentRole || currentUser.role,
        roles: normalizeRoles({ ...currentUser, role: currentRole || currentUser.role }, currentRole || currentUser.role),
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(persistedUser));
      localStorage.setItem(STORAGE_KEYS.ROLE, persistedUser.role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser, currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(creditTransactions));
  }, [creditTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse registered users:', e);
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  const findExistingAccountByEmail = async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) return null;

    const localMatch = registeredUsers.find(
      (account) => account?.email?.toLowerCase() === cleanEmail || account?.username?.toLowerCase() === cleanEmail
    );
    if (localMatch) return localMatch;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', cleanEmail)
          .limit(1);

        if (!error && data && data[0]) {
          return { profile: data[0], email: data[0].email, role: data[0].role || null };
        }
      } catch (err) {
        console.warn('Profile lookup notice:', err.message);
      }
    }

    return null;
  };

  const login = (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return false;
    }

    const account = registeredUsers.find(
      (acc) =>
        acc.email.toLowerCase() === cleanId ||
        acc.username.toLowerCase() === cleanId ||
        acc.profile.mobile?.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (!account) {
      return false;
    }

    const isPasswordValid = account.passwordHash === cleanPass;
    if (!isPasswordValid) {
      return false;
    }

    const normalizedProfile = normalizeProfile(
      {
        ...account.profile,
        gender: account.profile?.gender || 'PREFER_NOT_TO_SAY',
        avatar: account.profile?.avatar || account.profile?.profile_image || '',
        role: account.role,
        roles: account.profile?.roles?.length ? account.profile.roles : [account.role],
      },
      account.role
    );

    setCurrentUser(normalizedProfile);
    setCurrentRole(normalizedProfile.role);
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedProfile));
    localStorage.setItem(STORAGE_KEYS.ROLE, normalizedProfile.role);
    return true;
  };

  const signup = (userData, role) => {
    const userId = `user_${Date.now()}`;
    const cleanPassword = userData.password ? userData.password.trim() : 'User@123';
    const newUser = normalizeProfile(
      {
        id: userId,
        full_name: userData.full_name || '',
        username: (userData.username || `user_${Math.floor(Math.random() * 9000 + 1000)}`).toLowerCase(),
        email: (userData.email || `${userId}@karigarsetu.ai`).toLowerCase(),
        mobile: userData.mobile || '',
        profile_image: userData.profile_image || '',
        avatar: userData.avatar || userData.profile_image || '',
        gender: userData.gender || 'PREFER_NOT_TO_SAY',
        role: role,
        roles: [role],
        city: userData.city || 'Bengaluru',
        state: userData.state || 'Karnataka',
        district: userData.district || '',
        postal_code: userData.postal_code || '',
        latitude: userData.latitude ?? null,
        longitude: userData.longitude ?? null,
        bio: userData.bio || '',
        craft_specialization: userData.craft_specialization || '',
        credits: role === 'seller' ? 50 : 0, // 50 welcome credits
        badge: 'New Artisan',
        rating: 5.0,
        review_count: 0,
        sales_count: 0,
        products_count: 0,
        created_at: new Date().toISOString(),
      },
      role
    );

    const newAccount = {
      id: userId,
      email: newUser.email,
      username: newUser.username,
      passwordHash: cleanPassword,
      role: role,
      profile: newUser,
    };

    setRegisteredUsers((prev) => [
      ...prev.filter(
        (u) => u.email.toLowerCase() !== newUser.email && u.username.toLowerCase() !== newUser.username
      ),
      newAccount,
    ]);

    setCurrentUser(newUser);
    setCurrentRole(role);
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.ROLE, role);

    // Save to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles').upsert(newUser).catch(console.warn);
    }

    if (role === 'seller') {
      awardCredits(newUser.id, 20, 'profile_completed', 'Profile registration completed');
    }
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut().catch((error) => console.warn('Supabase sign-out failed:', error));
    }
    setCurrentUser(null);
    setCurrentRole(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem('karigarsetu_pending_role');
    localStorage.removeItem('karigarsetu_google_role');
    sessionStorage.removeItem('karigarsetu_google_oauth_inflight');
    sessionStorage.removeItem('karigarsetu_oauth_callback_processed');
  };

  const setAuthenticatedSession = (profile, roleOverride) => {
    const nextRole = roleOverride || profile?.role || null;
    if (!nextRole) {
      return null;
    }

    const normalizedProfile = normalizeProfile(
      {
        id: profile?.id || `user_${Date.now()}`,
        full_name: profile?.full_name || profile?.name || profile?.email?.split('@')[0] || 'Artisan Patron',
        username: profile?.username || profile?.email?.split('@')[0] || `user_${Math.random().toString(36).slice(2, 8)}`,
        email: profile?.email || '',
        mobile: profile?.mobile || '',
        profile_image: profile?.profile_image || '',
        avatar: profile?.avatar || profile?.profile_image || '',
        gender: profile?.gender || 'PREFER_NOT_TO_SAY',
        role: nextRole,
        roles: profile?.roles || [nextRole],
        city: profile?.city || 'Bengaluru',
        state: profile?.state || 'Karnataka',
        district: profile?.district || '',
        postal_code: profile?.postal_code || '',
        craft_specialization: profile?.craft_specialization || '',
        bio: profile?.bio || '',
        credits: profile?.credits ?? (nextRole === 'seller' ? 50 : 0),
        badge: profile?.badge || 'New Artisan',
        rating: profile?.rating ?? 5.0,
        review_count: profile?.review_count ?? 0,
        sales_count: profile?.sales_count ?? 0,
        products_count: profile?.products_count ?? 0,
        created_at: profile?.created_at || new Date().toISOString(),
      },
      nextRole
    );

    setCurrentUser(normalizedProfile);
    setCurrentRole(normalizedProfile.role);
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedProfile));
    localStorage.setItem(STORAGE_KEYS.ROLE, normalizedProfile.role);
    localStorage.removeItem('karigarsetu_pending_role');
    return normalizedProfile;
  };

  const switchRole = (newRole) => {
    if (!newRole) return;
    setCurrentRole(newRole);
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const nextUser = normalizeProfile({ ...prev, role: newRole }, newRole);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const updateUserProfile = (updates) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles').update(updates).eq('id', currentUser.id).catch(console.warn);
    }

    if (updatedUser.role === 'seller') {
      setProducts((prev) =>
        prev.map((p) =>
          p.seller_id === updatedUser.id || p.seller?.username === updatedUser.username
            ? {
                ...p,
                seller: {
                  ...p.seller,
                  full_name: updatedUser.full_name,
                  username: updatedUser.username,
                  profile_image: updatedUser.profile_image,
                  city: updatedUser.city,
                  state: updatedUser.state,
                  craft_specialization: updatedUser.craft_specialization,
                },
              }
            : p
        )
      );
    }
  };

  // Product CRUD
  const addProduct = (data) => {
    const seller = currentUser?.role === 'seller' ? currentUser : null;
    const sellerId = seller ? seller.id : `artisan_${Date.now()}`;
    const newId = `prod_${Date.now()}`;
    const newProd = {
      ...data,
      id: newId,
      seller_id: sellerId,
      seller: {
        id: sellerId,
        full_name: seller?.full_name || 'Master Artisan',
        username: seller?.username || 'artisan',
        city: seller?.city || data.city || 'Jaipur',
        state: seller?.state || data.state || 'Rajasthan',
        rating: seller?.rating || 5.0,
        badge: seller?.badge || 'New Artisan',
        profile_image: seller?.profile_image || '',
        craft_specialization: seller?.craft_specialization || data.category,
      },
      rating: 5.0,
      review_count: 0,
      views: 1,
      likes: 0,
      created_at: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('products').insert([newProd]).catch(console.warn);
    }

    if (currentUser && currentUser.id === sellerId) {
      setCurrentUser({
        ...currentUser,
        products_count: (currentUser.products_count || 0) + 1,
      });
    }

    awardCredits(sellerId, 50, 'product_published', `Product published: ${newProd.name}`);
    return newProd;
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').update(updates).eq('id', id).catch(console.warn);
    }
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').delete().eq('id', id).catch(console.warn);
    }
  };

  const getProductById = (id) => {
    return products.find((p) => p.id === id);
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const isPresent = prev.includes(productId);
      const next = isPresent ? prev.filter((id) => id !== productId) : [...prev, productId];

      if (isSupabaseConfigured && supabase && currentUser) {
        if (isPresent) {
          supabase.from('wishlists').delete().eq('user_id', currentUser.id).eq('product_id', productId).catch(console.warn);
        } else {
          supabase.from('wishlists').insert([{ user_id: currentUser.id, product_id: productId }]).catch(console.warn);
        }
      }
      return next;
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Orders
  const createOrder = (
    shippingAddress,
    paymentMethod = 'Razorpay Instant UPI',
    discountAmount = 0,
    couponCode = ''
  ) => {
    if (cart.length === 0) return null;
    const buyer = currentUser || {
      id: `guest_${Date.now()}`,
      full_name: 'Artisan Patron',
      email: 'patron@karigarsetu.ai',
      mobile: '+91 9876543210',
    };

    const subtotal = cartSubtotal;
    const delivery_fee = subtotal > 1500 ? 0 : 99;
    const total_amount = Math.max(0, subtotal + delivery_fee - discountAmount);
    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `KS202600${uniqueNumber}`;

    const primarySeller = cart[0].product.seller || { id: `seller_${Date.now()}`, full_name: 'Master Artisan' };

    const newOrder = {
      id: `ord_${Date.now()}`,
      order_code: orderCode,
      buyer_id: buyer.id,
      buyer_name: buyer.full_name,
      buyer_email: buyer.email,
      buyer_mobile: buyer.mobile,
      seller_id: primarySeller.id,
      seller_name: primarySeller.full_name,
      items: cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images?.[0] || '',
        price: item.product.price,
        quantity: item.quantity,
        seller_id: item.product.seller_id,
        seller_name: item.product.seller?.full_name || 'Artisan',
      })),
      subtotal,
      delivery_fee,
      discount_amount: discountAmount > 0 ? discountAmount : undefined,
      coupon_applied: couponCode || undefined,
      total_amount,
      shipping_address: shippingAddress,
      status: 'confirmed',
      payment_method: paymentMethod,
      payment_status: 'paid',
      payment_id: `PAY_RZP_${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').insert([newOrder]).catch(console.warn);
    }

    awardCredits(primarySeller.id, 100, 'product_sold', `Order ${orderCode} received (${newOrder.items[0]?.product_name})`);
    return newOrder;
  };

  const applyCoupon = (code, subtotal) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean);
    if (!found) {
      return { success: false, message: `Coupon code '${code}' is invalid.`, discount: 0 };
    }
    if (!found.is_active) {
      return { success: false, message: `Coupon code '${found.code}' has expired.`, discount: 0 };
    }
    if (found.min_order_amount && subtotal < found.min_order_amount) {
      return {
        success: false,
        message: `Minimum order amount of ₹${found.min_order_amount.toLocaleString('en-IN')} required for this voucher.`,
        discount: 0,
      };
    }
    let discount = 0;
    if (found.discount_type === 'percentage') {
      discount = Math.round((subtotal * found.discount_value) / 100);
      if (discount > 2500) discount = 2500;
    } else {
      discount = Math.min(found.discount_value, subtotal);
    }
    return {
      success: true,
      message: `Coupon '${found.code}' applied! Saved ₹${discount.toLocaleString('en-IN')}.`,
      discount,
      coupon: found,
    };
  };

  const addCoupon = (couponData) => {
    const newCoupon = {
      ...couponData,
      id: `coup_${Date.now()}`,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    return newCoupon;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status, updated_at: new Date().toISOString() } : ord))
    );
    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId).catch(console.warn);
    }
  };

  // Credits
  const awardCredits = (sellerId, amount, action, description) => {
    const newTx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      seller_id: sellerId,
      amount,
      action,
      description,
      created_at: new Date().toISOString(),
    };
    setCreditTransactions((prev) => [newTx, ...prev]);

    if (currentUser && currentUser.id === sellerId) {
      const updatedCredits = (currentUser.credits || 0) + amount;
      const updatedBadge = getBadgeForCredits(updatedCredits);
      setCurrentUser({
        ...currentUser,
        credits: updatedCredits,
        badge: updatedBadge,
      });
    }
  };

  // Reviews
  const addReview = (productId, rating, comment) => {
    const buyer = currentUser || { full_name: 'Artisan Patron', id: `buyer_${Date.now()}` };
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const newRev = {
      id: `rev_${Date.now()}`,
      product_id: productId,
      product_name: targetProduct.name,
      buyer_id: buyer.id,
      buyer_name: buyer.full_name,
      seller_id: targetProduct.seller_id,
      rating,
      comment,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);

    const currentReviews = reviews.filter((r) => r.product_id === productId);
    const totalStars = currentReviews.reduce((sum, r) => sum + r.rating, rating);
    const newAvg = Number((totalStars / (currentReviews.length + 1)).toFixed(1));

    updateProduct(productId, {
      rating: newAvg,
      review_count: (targetProduct.review_count || 0) + 1,
    });

    setOrders((prev) =>
      prev.map((o) => (o.items.some((i) => i.product_id === productId) ? { ...o, has_review: true } : o))
    );

    if (rating >= 4) {
      awardCredits(
        targetProduct.seller_id,
        25,
        'positive_review',
        `${rating}-star review on ${targetProduct.name}`
      );
    }
  };

  // Messages
  const sendMessage = (receiverId, text, productId, productName) => {
    const sender = currentUser || { full_name: 'Artisan Patron', id: `user_${Date.now()}`, role: 'buyer' };
    const targetSeller = products.find((product) => product.seller_id === receiverId)?.seller;
    const receiverName = targetSeller ? targetSeller.full_name : 'Artisan Support';

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender_id: sender.id,
      sender_name: sender.full_name,
      receiver_id: receiverId,
      receiver_name: receiverName,
      product_id: productId,
      product_name: productName,
      text,
      created_at: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('messages').insert([newMsg]).catch(console.warn);
    }

    if (sender.role === 'buyer') {
      setTimeout(() => {
        const replyMsg = {
          id: `msg_${Date.now() + 1}`,
          sender_id: receiverId,
          sender_name: receiverName,
          receiver_id: sender.id,
          receiver_name: sender.full_name,
          product_id: productId,
          product_name: productName,
          text: `Namaste ${sender.full_name}! Thank you for your message. Every craft is 100% handmade and can be tailored to your specifications.`,
          created_at: new Date().toISOString(),
          read: false,
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 1500);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        language,
        setLanguage,
        isAuthenticated: Boolean(currentUser),
        findExistingAccountByEmail,
        login,
        signup,
        logout,
        setAuthenticatedSession,
        switchRole,
        updateUserProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        creditTransactions,
        awardCredits,
        reviews,
        addReview,
        messages,
        sendMessage,
        coupons,
        applyCoupon,
        addCoupon,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
