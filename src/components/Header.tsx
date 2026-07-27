import React, { useState } from 'react';
import { Menu, Search, X, ArrowLeft, ShoppingCart, LayoutDashboard, Store, Lock, LogOut, Heart } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  cartCount: number;
  favoritesCount?: number;
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
  isAdmin?: boolean;
  onLogoutAdmin?: () => void;
}

export default function Header({
  currentView,
  onNavigate,
  cartCount,
  favoritesCount = 0,
  onSearchChange,
  searchTerm = '',
  isAdmin = false,
  onLogoutAdmin
}: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(searchTerm !== '');

  React.useEffect(() => {
    if (searchTerm !== '') {
      setIsSearchBarOpen(true);
    }
  }, [searchTerm]);

  const viewTitles: Record<ViewType, string> = {
    catalog: 'Sacolão Pimp',
    cart: 'Sacolão Pimp',
    dashboard: 'Sacolão Pimp',
    form: 'Sacolão Pimp',
    favorites: 'Sacolão Pimp'
  };

  const handleSidebarNav = (view: ViewType) => {
    onNavigate(view);
    setIsSidebarOpen(false);
  };

  const renderLeftAction = () => {
    if (currentView === 'cart' || currentView === 'form') {
      return (
        <button
          onClick={() => onNavigate(currentView === 'form' ? 'dashboard' : 'catalog')}
          className="p-2 -ml-2 rounded-full hover:bg-[#6dbe7b]/10 transition-colors active:scale-95 text-[#176c33]"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      );
    }

    return (
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="p-2 -ml-2 rounded-full hover:bg-[#6dbe7b]/10 transition-colors active:scale-95 text-[#176c33]"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6" />
      </button>
    );
  };

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#f7fbf2] border-b border-[#bfc9bc]/30 py-4 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            {renderLeftAction()}
            <span 
              onClick={() => onNavigate('catalog')}
              className="font-display-lg text-2xl font-bold text-[#176c33] tracking-tight hover:opacity-90 cursor-pointer"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            >
              {viewTitles[currentView]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Bar Trigger for Catalog and Admin Dashboard */}
            {(currentView === 'catalog' || currentView === 'dashboard') && onSearchChange && (
              <div className="relative flex items-center">
                {isSearchBarOpen ? (
                  <div id="search-bar-wrapper" className="flex items-center bg-[#ebefe7] rounded-full px-3 py-1.5 transition-all">
                    <input
                      id="search-input"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder={currentView === 'dashboard' ? 'Buscar no inventário...' : 'O que você procura?'}
                      className="bg-transparent border-none outline-none text-sm text-[#181d18] w-40 md:w-60 px-1 placeholder-[#707a6e]"
                      autoFocus
                    />
                    <button 
                      id="close-search-btn"
                      onClick={() => {
                        setIsSearchBarOpen(false);
                        onSearchChange('');
                      }} 
                      className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-[#707a6e]" />
                    </button>
                  </div>
                ) : (
                  <button
                    id="open-search-btn"
                    onClick={() => setIsSearchBarOpen(true)}
                    className="p-2 rounded-full hover:bg-[#6dbe7b]/10 transition-colors text-[#176c33]"
                    aria-label="Buscar"
                  >
                    <Search className="w-6 h-6" />
                  </button>
                )}
              </div>
            )}

            {/* Favorites (Lista de Compras) Quick Access */}
            <button
              onClick={() => onNavigate('favorites')}
              className={`relative p-2 rounded-full transition-colors flex items-center justify-center ${
                currentView === 'favorites'
                  ? 'bg-red-50 text-[#99405c]'
                  : 'hover:bg-red-50 text-[#99405c]/80 hover:text-[#99405c]'
              }`}
              aria-label="Lista de Compras"
              title="Lista de Compras"
            >
              <Heart className={`w-6 h-6 ${currentView === 'favorites' ? 'fill-[#99405c]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-[#99405c] rounded-full text-[10px] text-white flex items-center justify-center font-bold px-1 ring-2 ring-[#f7fbf2]">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart Quick Access */}
            {currentView !== 'cart' && (
              <button
                onClick={() => onNavigate('cart')}
                className="relative p-2 rounded-full hover:bg-[#6dbe7b]/10 transition-colors text-[#176c33]"
                aria-label="Ver Carrinho"
                title="Meu Carrinho"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-[#99405c] rounded-full text-[10px] text-white flex items-center justify-center font-bold px-1 ring-2 ring-[#f7fbf2]">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Drawer Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-[#181d18]/40 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Drawer Body */}
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-[#f7fbf2] shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#bfc9bc]/30">
                <span className="text-2xl font-bold text-[#176c33]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  Sacolão Pimp
                </span>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-[#ebefe7] text-[#707a6e]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleSidebarNav('catalog')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-left font-semibold text-sm transition-all ${
                    currentView === 'catalog' 
                      ? 'bg-[#176c33] text-white shadow-md' 
                      : 'hover:bg-[#ebefe7] text-[#40493f]'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span>Catálogo de Produtos</span>
                </button>

                <button
                  onClick={() => handleSidebarNav('cart')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-left font-semibold text-sm transition-all ${
                    currentView === 'cart' 
                      ? 'bg-[#176c33] text-white shadow-md' 
                      : 'hover:bg-[#ebefe7] text-[#40493f]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Meu Carrinho</span>
                  </div>
                  {cartCount > 0 && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      currentView === 'cart' ? 'bg-[#99405c] text-white' : 'bg-[#c9ecc9] text-[#176c33]'
                    }`}>
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleSidebarNav('favorites')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-left font-semibold text-sm transition-all ${
                    currentView === 'favorites' 
                      ? 'bg-[#99405c] text-white shadow-md' 
                      : 'hover:bg-[#ebefe7] text-[#40493f]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Heart className={`w-5 h-5 ${currentView === 'favorites' ? 'fill-white' : 'text-[#99405c]'}`} />
                    <span>Lista de Compras</span>
                  </div>
                  {favoritesCount > 0 && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      currentView === 'favorites' ? 'bg-[#176c33] text-white' : 'bg-red-100 text-[#99405c]'
                    }`}>
                      {favoritesCount}
                    </span>
                  )}
                </button>

                {isAdmin && onLogoutAdmin && (
                  <button
                    onClick={() => {
                      onLogoutAdmin();
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-left font-bold text-xs text-[#99405c] bg-red-50 hover:bg-red-100 hover:text-red-900 transition-all border border-red-200/45 mt-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Administração</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#bfc9bc]/30 text-xs text-[#707a6e] text-center">
              <p className="font-semibold">Sacolão Pimp © 2026</p>
              <p className="mt-1">Frescor e saúde na sua mesa</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
