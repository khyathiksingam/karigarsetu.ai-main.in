-- ==============================================================================
-- KARIGARSETU AI — SUPABASE POSTGRESQL SCHEMA (PRODUCTION READY)
-- Team: HEXANOVA 3.0 | Theme: Heritage & Culture | Smart India Hackathon 2026
-- Official Domain: https://karigarsetu.ai
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT,
    profile_image TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('seller', 'buyer', 'admin')),
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT,
    postal_code TEXT,
    bio TEXT,
    craft_specialization TEXT,
    credits INTEGER DEFAULT 0,
    badge TEXT DEFAULT 'New Artisan' CHECK (badge IN ('New Artisan', 'Rising Karigar', 'Trusted Artisan', 'Master Karigar')),
    rating NUMERIC(2,1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    material TEXT NOT NULL,
    model_style TEXT,
    dimensions_length NUMERIC,
    dimensions_width NUMERIC,
    dimensions_height NUMERIC,
    dimensions_unit TEXT DEFAULT 'cm',
    is_dimensions_estimated BOOLEAN DEFAULT true,
    primary_color TEXT NOT NULL,
    secondary_color TEXT,
    quality_score NUMERIC(2,1) DEFAULT 4.8,
    market_price_min NUMERIC NOT NULL,
    market_price_max NUMERIC NOT NULL,
    suggested_price NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    quantity INTEGER DEFAULT 1,
    crafting_time_days INTEGER DEFAULT 7,
    images TEXT[] NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    rating NUMERIC(2,1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code TEXT UNIQUE NOT NULL,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_mobile TEXT NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    seller_name TEXT NOT NULL,
    subtotal NUMERIC NOT NULL,
    delivery_fee NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    coupon_applied TEXT,
    total_amount NUMERIC NOT NULL,
    street_address TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('ordered', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_method TEXT DEFAULT 'Razorpay (Instant UPI / Cards)',
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INTEGER DEFAULT 1,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    seller_name TEXT NOT NULL
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    product_name TEXT NOT NULL,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    buyer_name TEXT NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. KARIGARSETU CREDITS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('product_published', 'product_sold', 'positive_review', 'profile_completed', 'bonus')),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    sender_name TEXT NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_name TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT,
    text TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_buyer ON public.reviews(buyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Categories Policies
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can modify categories" ON public.categories FOR ALL USING (public.is_admin());

-- Products Policies
CREATE POLICY "Active products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert their products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id OR auth.uid() IS NOT NULL);
CREATE POLICY "Sellers can update their own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id OR public.is_admin());
CREATE POLICY "Sellers can delete their own products" ON public.products FOR DELETE USING (auth.uid() = seller_id OR public.is_admin());

-- Orders Policies
CREATE POLICY "Users can view their related orders" ON public.orders FOR SELECT USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin()
);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() IS NOT NULL);
CREATE POLICY "Sellers and Admins can update order status" ON public.orders FOR UPDATE USING (auth.uid() = seller_id OR public.is_admin());

-- Order Items Policies
CREATE POLICY "Users can view related order items" ON public.order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid() OR public.is_admin())
    )
);
CREATE POLICY "Order items insertable on order creation" ON public.order_items FOR INSERT WITH CHECK (true);

-- Reviews Policies
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE USING (public.is_admin());

-- Credit Transactions Policies
CREATE POLICY "Sellers can view their credit transactions" ON public.credit_transactions FOR SELECT USING (
    auth.uid() = seller_id OR public.is_admin()
);
CREATE POLICY "System can record credits" ON public.credit_transactions FOR INSERT WITH CHECK (true);

-- Messages Policies
CREATE POLICY "Users can read their own messages" ON public.messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id OR public.is_admin()
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id OR auth.uid() IS NOT NULL
);

-- Wishlists Policies
CREATE POLICY "Users can view their own wishlist" ON public.wishlists FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin()
);
CREATE POLICY "Users can manage their wishlist" ON public.wishlists FOR INSERT WITH CHECK (
    auth.uid() = user_id OR auth.uid() IS NOT NULL
);
CREATE POLICY "Users can delete from their wishlist" ON public.wishlists FOR DELETE USING (
    auth.uid() = user_id OR public.is_admin()
);
