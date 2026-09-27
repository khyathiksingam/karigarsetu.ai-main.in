import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { RoleGuard } from './components/common/RoleGuard';

// Public & Common Pages
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { SettingsPage } from './pages/SettingsPage';

// Buyer Pages
import { MarketplacePage } from './pages/buyer/MarketplacePage';
import { ProductDetailsPage } from './pages/buyer/ProductDetailsPage';
import { ArtisanProfilePage } from './pages/buyer/ArtisanProfilePage';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { CartPage } from './pages/buyer/CartPage';
import { CheckoutPage } from './pages/buyer/CheckoutPage';
import { BuyerOrdersPage } from './pages/buyer/BuyerOrdersPage';
import { WishlistPage } from './pages/buyer/WishlistPage';
import { MessagesPage } from './pages/buyer/MessagesPage';
import { BuyerProfilePage } from './pages/buyer/BuyerProfilePage';

// Seller Pages
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { AIProductAnalyzerPage } from './pages/seller/AIProductAnalyzerPage';
import { SellerProductsPage } from './pages/seller/SellerProductsPage';
import { AddProductPage } from './pages/seller/AddProductPage';
import { SellerOrdersPage } from './pages/seller/SellerOrdersPage';
import { SellerCreditsPage } from './pages/seller/SellerCreditsPage';
import { SellerAnalyticsPage } from './pages/seller/SellerAnalyticsPage';
import { SellerProfilePage } from './pages/seller/SellerProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/how-it-works" element={<LandingPage />} />
              <Route path="/ai-analyzer" element={<AIProductAnalyzerPage />} />
              <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />
              <Route path="/buyer" element={<Navigate to="/buyer/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/select-role" element={<RoleSelectionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/artisan/:username" element={<ArtisanProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Seller Protected Routes */}
              <Route
                path="/seller/dashboard"
                element={
                  <RoleGuard allowedRole="seller">
                    <SellerDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/seller/ai-analyzer"
                element={
                  <RoleGuard allowedRole="seller">
                    <AIProductAnalyzerPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/seller/products"
                element={
                  <RoleGuard allowedRole="seller">
                    <SellerProductsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/seller/products/new"
                element={
                  <RoleGuard allowedRole="seller">
                    <AddProductPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/seller/products/:id"
                element={
                  <RoleGuard allowedRole="seller">
                    <AddProductPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/seller/orders"
                element={
                  <RoleGuard allowedRole="seller">
                    <SellerOrdersPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/seller/credits"
                element={
                  <RoleGuard allowedRole="seller">
                    <SellerCreditsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/seller/analytics"
                element={
                  <RoleGuard allowedRole="seller">
                    <SellerAnalyticsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/seller/profile"
                element={
                  <RoleGuard allowedRole="seller">
                    <SellerProfilePage />
                  </RoleGuard>
                }
              />

              {/* Buyer Protected Routes */}
              <Route
                path="/buyer/dashboard"
                element={
                  <RoleGuard allowedRole="buyer">
                    <BuyerDashboard />
                  </RoleGuard>
                }
              />
              <Route path="/buyer/marketplace" element={<MarketplacePage />} />
              <Route
                path="/buyer/cart"
                element={
                  <RoleGuard allowedRole="buyer">
                    <CartPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/buyer/checkout"
                element={
                  <RoleGuard allowedRole="buyer">
                    <CheckoutPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/buyer/orders"
                element={
                  <RoleGuard allowedRole="buyer">
                    <BuyerOrdersPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/buyer/wishlist"
                element={
                  <RoleGuard allowedRole="buyer">
                    <WishlistPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/buyer/messages"
                element={
                  <RoleGuard>
                    <MessagesPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/buyer/profile"
                element={
                  <RoleGuard allowedRole="buyer">
                    <BuyerProfilePage />
                  </RoleGuard>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <RoleGuard allowedRole="admin">
                    <AdminDashboard />
                  </RoleGuard>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};
