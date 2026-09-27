import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Menu,
  X,
  LogOut,
  Layers,
  Scan,
  LayoutDashboard,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { getLanguageConfig, getTranslation, LANGUAGE_OPTIONS } from '../../i18n/translations';

export const Navbar = () => {
  const { currentUser, currentRole, switchRole, logout, cartCount, wishlist, language, setLanguage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const activeRole = currentRole || currentUser?.role || null;
  const userRoles = Array.isArray(currentUser?.roles) ? currentUser.roles : currentUser?.role ? [currentUser.role] : [];
  const canShowSellerPortal = userRoles.includes('seller');
  const canShowBuyerPortal = userRoles.includes('buyer');
  const currentLanguageConfig = getLanguageConfig(language);
  const t = (key) => getTranslation(language, key);
  const visibleLanguages = LANGUAGE_OPTIONS.filter((lang) => {
    const query = languageSearch.trim().toLowerCase();
    if (!query) return true;
    return `${lang.native} ${lang.english}`.toLowerCase().includes(query) || lang.code.toLowerCase().includes(query);
  });

  return (
    <header className="sticky top-0 z-50 border-b border-[#1A3A5C]/10 bg-[#FEFAF5]/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(26,58,92,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group shrink-0">
          <img
            src="/assets/karigarsetu-ai-logo.png"
            alt="KARIGARSETU.AI Official Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-contain border border-[#C8702A]/25 bg-white/80 shadow-[0_10px_25px_rgba(200,112,42,0.16)] group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300 shrink-0"
          />
          <div className="flex flex-col text-left">
            <span className="font-display font-black text-lg sm:text-xl tracking-wider text-[#1A3A5C] leading-tight">
              KARIGARSETU.AI
            </span>
            <p className="text-[9.5px] sm:text-[10px] tracking-wider text-[#1A3A5C]/75 font-medium -mt-0.5 hidden xs:block">
              From Artisan to Market — Powered by AI
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-2 text-sm font-semibold text-[#1A3A5C]">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageMenuOpen((open) => !open)}
              className="border border-[#1A3A5C]/10 rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-[#1A3A5C] outline-none min-w-[76px]"
              aria-label="Select language"
            >
              {currentLanguageConfig.code.toUpperCase()}
            </button>
            {languageMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-[#1A3A5C]/10 bg-white shadow-2xl z-50 p-2">
                <input
                  value={languageSearch}
                  onChange={(event) => setLanguageSearch(event.target.value)}
                  placeholder="Search language"
                  className="w-full rounded-xl border border-[#1A3A5C]/10 bg-[#F7F2EA] px-2.5 py-1.5 text-xs outline-none mb-2"
                />
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {visibleLanguages.length > 0 ? (
                    visibleLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setLanguageMenuOpen(false);
                          setLanguageSearch('');
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs font-semibold ${
                          language === lang.code ? 'bg-[#1A3A5C] text-white' : 'hover:bg-[#F7F2EA] text-[#1A3A5C]'
                        }`}
                      >
                        <span>{lang.native}</span>
                        <span className="opacity-70">{lang.code.toUpperCase()}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-2 py-2 text-xs text-[#1A3A5C]/60">No matching languages</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <Link
            to="/"
            className={`px-3 py-2 rounded-full transition-all duration-300 ${
              location.pathname === '/'
                ? 'bg-[#1A3A5C] text-white shadow-[0_12px_18px_rgba(26,58,92,0.18)]'
                : 'hover:bg-white/70 hover:text-[#C8702A]'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/marketplace"
            className={`px-3 py-2 rounded-full transition-all duration-300 ${
              location.pathname.includes('/marketplace')
                ? 'bg-[#1A3A5C] text-white shadow-[0_12px_18px_rgba(26,58,92,0.18)]'
                : 'hover:bg-white/70 hover:text-[#C8702A]'
            }`}
          >
            {t('nav.marketplace')}
          </Link>
          {activeRole !== 'buyer' && (
            <>
              <a
                href="/#how-it-works"
                className="px-3 py-2 rounded-full transition-all duration-300 hover:bg-white/70 hover:text-[#C8702A]"
              >
                {t('nav.howItWorks')}
              </a>
              <Link
                to="/seller/ai-analyzer"
                className="premium-button flex items-center space-x-1.5 bg-gradient-to-r from-[#C8702A]/15 to-[#D7B36A]/15 text-[#C8702A] px-4 py-2 rounded-full border border-[#C8702A]/20 hover:border-[#C8702A]/40 hover:shadow-[0_16px_24px_rgba(200,112,42,0.12)] transition-all duration-300 group"
              >
                <Scan className="w-4 h-4 text-[#C8702A] group-hover:rotate-12 transition-transform" />
                <span>{t('nav.aiAnalyzer')}</span>
              </Link>
            </>
          )}

          {currentUser?.role === 'admin' ? (
            <Link
              to="/admin/dashboard"
              className={`hover:text-heritage-terracotta transition flex items-center space-x-1 ${
                location.pathname.startsWith('/admin') ? 'text-heritage-terracotta font-bold' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          ) : activeRole === 'seller' ? (
            <Link
              to="/seller/dashboard"
              className={`hover:text-heritage-terracotta transition flex items-center space-x-1 ${
                location.pathname.startsWith('/seller') && !location.pathname.includes('ai-analyzer')
                  ? 'text-heritage-terracotta font-bold'
                  : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Artisan Portal</span>
            </Link>
          ) : activeRole === 'buyer' ? (
            <Link
              to="/buyer/orders"
              className={`hover:text-heritage-terracotta transition flex items-center space-x-1 ${
                location.pathname.startsWith('/buyer') ? 'text-heritage-terracotta font-bold' : ''
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('myOrders')}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              state={{ from: { pathname: '/seller/dashboard' } }}
              className="hover:text-heritage-terracotta transition flex items-center space-x-1 text-heritage-brown"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Artisan Portal</span>
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center space-x-3">
          {/* Wishlist Icon */}
          <Link
            to="/buyer/wishlist"
            className="p-2 text-heritage-brown hover:text-heritage-terracotta transition relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-heritage-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/buyer/cart"
            className="p-2 text-heritage-brown hover:text-heritage-terracotta transition relative"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-heritage-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-full border border-heritage-terracotta/20 hover:border-heritage-terracotta bg-white/80 transition"
              >
                <Avatar
                  src={currentUser.profile_image}
                  name={currentUser.full_name}
                  size="sm"
                  role={currentUser.role}
                />
                <div className="hidden lg:block text-left pr-2">
                  <p className="text-xs font-bold text-heritage-brown leading-none">
                    {currentUser.full_name}
                  </p>
                  <p className="text-[10px] text-heritage-terracotta font-medium capitalize mt-0.5">
                    {activeRole}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-3d-lg border border-heritage-terracotta/15 py-2 z-50"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-heritage-sand bg-heritage-ivory/50">
                    <p className="text-xs font-semibold text-heritage-charcoal">Logged in as</p>
                    <p className="text-sm font-bold text-heritage-brown truncate">{currentUser.full_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-heritage-gold/20 text-heritage-brown border border-heritage-gold/30 uppercase">
                        {activeRole}
                      </span>
                      {activeRole === 'seller' && (
                        <span className="text-[11px] font-semibold text-heritage-terracotta flex items-center">
                          <Award className="w-3.5 h-3.5 mr-0.5" />
                          {currentUser.credits || 0} Credits
                        </span>
                      )}
                    </div>
                  </div>

                  {userRoles.length > 1 && (
                    <div className="px-4 py-2 border-b border-heritage-sand/70">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-heritage-charcoal/70 mb-2">Role Mode</p>
                      <div className="flex gap-2">
                        {canShowBuyerPortal && (
                          <button
                            type="button"
                            onClick={() => {
                              switchRole('buyer');
                              setProfileDropdownOpen(false);
                            }}
                            className={`flex-1 px-2 py-1.5 rounded-xl text-[11px] font-bold transition ${
                              activeRole === 'buyer'
                                ? 'bg-heritage-brown text-heritage-gold-light'
                                : 'bg-heritage-sand text-heritage-brown'
                            }`}
                          >
                            Buyer
                          </button>
                        )}
                        {canShowSellerPortal && (
                          <button
                            type="button"
                            onClick={() => {
                              switchRole('seller');
                              setProfileDropdownOpen(false);
                            }}
                            className={`flex-1 px-2 py-1.5 rounded-xl text-[11px] font-bold transition ${
                              activeRole === 'seller'
                                ? 'bg-heritage-terracotta text-white'
                                : 'bg-heritage-sand text-heritage-brown'
                            }`}
                          >
                            Seller
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="py-1">
                    {activeRole === 'admin' ? (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2.5 text-heritage-terracotta" />
                        Admin Dashboard
                      </Link>
                    ) : activeRole === 'seller' ? (
                      <>
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2.5 text-heritage-brown" />
                          Artisan Dashboard
                        </Link>
                        <Link
                          to="/seller/ai-analyzer"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta"
                        >
                          <Scan className="w-4 h-4 mr-2.5 text-heritage-terracotta" />
                          AI Product Analyzer
                        </Link>
                        <Link
                          to="/seller/products"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta"
                        >
                          <Layers className="w-4 h-4 mr-2.5 text-heritage-brown" />
                          My Products
                        </Link>
                        <Link
                          to="/seller/credits"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta"
                        >
                          <Award className="w-4 h-4 mr-2.5 text-heritage-gold" />
                          Karigar Credits
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/buyer/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2.5 text-heritage-brown" />
                          My Orders
                        </Link>
                        <Link
                          to="/buyer/marketplace"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-heritage-charcoal hover:bg-heritage-sand/40 hover:text-heritage-terracotta"
                        >
                          <Sparkles className="w-4 h-4 mr-2.5 text-heritage-brown" />
                          Explore Crafts
                        </Link>
                      </>
                    )}

                    <div className="border-t border-heritage-sand my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-1.5 text-xs font-bold text-heritage-brown hover:text-heritage-terracotta border border-heritage-terracotta/30 hover:border-heritage-terracotta bg-white/90 rounded-full shadow-xs transition"
              >
                Login
              </Link>
              <Link
                to="/select-role"
                className="px-4 py-1.5 text-xs font-bold bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white rounded-full shadow-3d-sm hover:shadow-3d transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-heritage-brown hover:text-heritage-terracotta"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-heritage-ivory border-b border-heritage-terracotta/20 px-4 pt-3 pb-6 space-y-3">
          {currentUser && (
            <div className="flex items-center space-x-3 p-3 bg-white rounded-2xl border border-heritage-sand/80 shadow-xs mb-2">
              <Avatar
                src={currentUser.profile_image}
                name={currentUser.full_name}
                size="md"
                role={currentUser.role}
              />
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-bold text-heritage-brown truncate">{currentUser.full_name}</p>
                <p className="text-[11px] text-heritage-terracotta font-medium capitalize">
                  {currentUser.role}
                </p>
              </div>
            </div>
          )}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta"
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta"
          >
            Marketplace
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta"
          >
            How It Works
          </a>
          <Link
            to="/seller/ai-analyzer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-sm font-semibold text-heritage-terracotta"
          >
            <Scan className="w-4 h-4" />
            <span>AI Product Analyzer</span>
          </Link>
          {activeRole === 'admin' ? (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta"
            >
              Admin Dashboard
            </Link>
          ) : activeRole === 'seller' ? (
            <Link
              to="/seller/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta"
            >
              Artisan Dashboard
            </Link>
          ) : activeRole === 'buyer' ? (
            <Link
              to="/buyer/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta"
            >
              My Orders
            </Link>
          ) : (
            <Link
              to="/login"
              state={{ from: { pathname: '/seller/dashboard' } }}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-heritage-brown hover:text-heritage-terracotta"
            >
              Artisan Portal
            </Link>
          )}
          {currentUser ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                navigate('/');
              }}
              className="w-full text-left py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-2 border-t border-heritage-sand/60 pt-3"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('signOut')}</span>
            </button>
          ) : (
            <div className="pt-3 border-t border-heritage-sand/60 flex space-x-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold text-heritage-brown bg-heritage-sand/40 hover:bg-heritage-sand/70 rounded-xl transition"
              >
                Login
              </Link>
              <Link
                to="/select-role"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold text-white bg-heritage-terracotta hover:bg-heritage-terracotta-dark rounded-xl transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
