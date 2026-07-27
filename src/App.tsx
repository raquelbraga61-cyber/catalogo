import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DEFAULT_PRODUCTS, DEFAULT_DAILY_OFFER } from './data';
import { Product, CartItem, CustomerInfo, ViewType, FormMode, DailyOffer } from './types';
import Header from './components/Header';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard';
import ProductForm from './components/ProductForm';
import AdminGate from './components/AdminGate';
import Favorites from './components/Favorites';

export default function App() {
  // 1. Core State with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('sacolao_products');
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts);
      } catch (e) {
        console.error('Erro ao restaurar catálogo de produtos:', e);
      }
    }
    return DEFAULT_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('sacolao_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          return parsed.map((item: CartItem) => ({
            ...item,
            quantity: Math.round(item.quantity) || 1
          }));
        }
      } catch (e) {
        console.error('Erro ao restaurar carrinho:', e);
      }
    }
    return [];
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    const savedInfo = localStorage.getItem('sacolao_customer_info');
    if (savedInfo) {
      try {
        return JSON.parse(savedInfo);
      } catch (e) {
        console.error('Erro ao restaurar dados do cliente:', e);
      }
    }
    return { name: '', address: '', neighborhood: '', paymentMethod: 'PIX', cashChange: '' };
  });

  const [dailyOffers, setDailyOffers] = useState<DailyOffer[]>(() => {
    const savedOffers = localStorage.getItem('sacolao_daily_offers');
    if (savedOffers) {
      try {
        const parsed = JSON.parse(savedOffers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Erro ao restaurar ofertas:', e);
      }
    }

    // Migração de oferta única se houver
    const savedSingleOffer = localStorage.getItem('sacolao_daily_offer');
    if (savedSingleOffer) {
      try {
        const parsed = JSON.parse(savedSingleOffer);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return [{ id: '1', ...parsed }];
        }
      } catch (e) {}
    }

    return [
      {
        id: '1',
        badge: 'Oferta do Dia',
        title: 'Frescor Direto da Horta na sua Mesa',
        description: 'Aproveite até 30% OFF em itens selecionados hoje mesmo.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2TteofSMBjMB6hWFlPuT7ehrMQkljYM65cqPUJIsr91DvVPNDelcJpOpfAtQb58vsAZw2mZAvWKLGTEo_K-jTBXrY-iYJAWK6Bdfy2-V3cK6Tb7GGk66GCkqrbk60_WTM9FOxFLR3mTCYqJuYDC9iJmnBcY9xf1MO7xX9bnKtK05Cm8aevshqp7uf-3rc12cvvoO0zaDxdb0obnSB_RualhWmipmsI1GrV8JyvubQf4opYom5lsLYrjdWFs2RFWUZPV1a3gVPZko'
      },
      {
        id: '2',
        badge: 'Entrega Rápida',
        title: 'Frutas e Verduras Selecionadas',
        description: 'Qualidade garantida e entrega rápida no mesmo dia na sua casa.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR6jyxE_2OIOtdbUiqVpPX4Q2GE_gVoipZdJsoP1AOqUqHWgwTVudtbvfSvfCvF3Y4D1Thx6k7EVoM1rpTin8M3XL6dRcMdv1XuS-j0-1kVrX6yHp4etW_XgqH8ZTePRFiNh7IZSH-FyulUbpU3x7G-n9bGMXTKl9E8Z3aXqKX0OeZT226Hx1N5I3yeFS4aqdMKKFPdHPpf2FGvxtvJ-yA95cz_XLcINC3GZcibFpHcpgBf_RWzhhWbVC70yO8711XBSE-qqOw-uA'
      },
      {
        id: '3',
        badge: 'Orgânicos',
        title: 'Estilo de Vida Mais Saudável',
        description: 'Conheça nossa linha completa de produtos 100% orgânicos e certificados.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYyUpXxFCoTM1Vhoy3eDJnC9upba3Jfo0bB0E0b1YRVyVV1Vbcu2k2Nwi6W_vfAUZ3BuvZ-pmDL23jOOpcSlctIvcuRod3a7TvANYoZcjGX4Negv6T92HDtaaglzZk_uexHJEYmkY-rrUIllzHa-aTmwfLB-rW0ZXtrUoU64LUHoQWZYi24hWm443oqBDPyQEMojbEGHplKAr5pvbnY7p2gGT028_Pw1va3wDYNPacWGsYxoZZRJWNRjgcGLAY5uFrseJQuwPeXlA'
      }
    ];
  });

  const [categories, setCategories] = useState<{ name: string; icon: string }[]>(() => {
    const savedCategories = localStorage.getItem('sacolao_categories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed)) {
          return parsed.map((cat: any) => ({
            name: cat.name,
            icon: ''
          }));
        }
      } catch (e) {
        console.error('Erro ao restaurar categorias:', e);
      }
    }
    return [
      { name: 'Frutas', icon: '' },
      { name: 'Verduras', icon: '' },
      { name: 'Legumes', icon: '' },
      { name: 'Grãos', icon: '' }
    ];
  });

  const handleAddCategory = (name: string, icon: string) => {
    if (!name.trim()) return;
    const normalizedName = name.trim();
    setCategories((prev) => {
      if (prev.some((cat) => cat.name.toLowerCase() === normalizedName.toLowerCase())) {
        return prev;
      }
      return [...prev, { name: normalizedName, icon: icon.trim() || '' }];
    });
  };

  const handleDeleteCategory = (name: string) => {
    setCategories((prev) => prev.filter((cat) => cat.name !== name));
  };

  // 2. Navigation & Interface States
  const [currentView, setCurrentView] = useState<ViewType>('catalog');
  const [activeFooterModal, setActiveFooterModal] = useState<'terms' | 'privacy' | null>(null);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('sacolao_is_admin') === 'true';
  });

  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return localStorage.getItem('sacolao_is_offline') === 'true';
  });

  const handleToggleOffline = (val: boolean) => {
    setIsOffline(val);
    localStorage.setItem('sacolao_is_offline', String(val));
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('sacolao_is_admin');
    handleNavigate('catalog');
  };
  const [selectedEditingProduct, setSelectedEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Acesso direto ao painel admin via link secreto (#admin)
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setCurrentView('dashboard');
    }
  }, []);

  // 3. Sync to localStorage when states update
  useEffect(() => {
    localStorage.setItem('sacolao_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sacolao_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sacolao_customer_info', JSON.stringify(customerInfo));
  }, [customerInfo]);

  useEffect(() => {
    localStorage.setItem('sacolao_daily_offers', JSON.stringify(dailyOffers));
  }, [dailyOffers]);

  useEffect(() => {
    localStorage.setItem('sacolao_categories', JSON.stringify(categories));
  }, [categories]);

  // 4. Cart Logic Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.product.saleType === product.saleType
      );
      const isKg = product.saleType === 'KG';
      const addedQuantity = isKg ? parseFloat(quantity.toFixed(2)) : (Math.round(quantity) || 1);
      
      if (existingIndex > -1) {
        const nextQty = prevCart[existingIndex].quantity + addedQuantity;
        const updatedQty = isKg ? parseFloat(nextQty.toFixed(2)) : Math.round(nextQty);
        return prevCart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: updatedQty }
            : item
        );
      }
      return [...prevCart, { product, quantity: addedQuantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number, saleType?: 'UNI' | 'KG' | 'INTEIRO' | 'BANDA' | 'QUARTO') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === productId && (!saleType || item.product.saleType === saleType)
      );
      if (existingIndex === -1) return prevCart;

      const targetItem = prevCart[existingIndex];
      const isKg = targetItem.product.saleType === 'KG';
      const actualDelta = isKg && (delta === 1 || delta === -1) ? (delta > 0 ? 0.5 : -0.5) : delta;
      
      const nextQuantity = isKg
        ? parseFloat((targetItem.quantity + actualDelta).toFixed(2))
        : Math.round(targetItem.quantity + delta);

      if (nextQuantity <= 0) {
        const formatSaleTypeLabel = (st: string) => {
          if (st === 'UNI') return 'Unidade';
          if (st === 'KG') return 'Quilo';
          if (st === 'INTEIRO') return 'Inteiro';
          if (st === 'BANDA') return 'Banda';
          if (st === 'QUARTO') return '1/4';
          return st;
        };
        const confirmRemove = window.confirm(
          `Deseja realmente remover "${targetItem.product.name}" (${formatSaleTypeLabel(targetItem.product.saleType)}) do seu carrinho de compras?`
        );
        if (confirmRemove) {
          return prevCart.filter(
            (item) => !(item.product.id === productId && (!saleType || item.product.saleType === saleType))
          );
        }
        return prevCart;
      }

      return prevCart.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: nextQuantity }
          : item
      );
    });
  };

  const handleRemoveItem = (productId: string, saleType?: 'UNI' | 'KG' | 'INTEIRO' | 'BANDA' | 'QUARTO') => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && (!saleType || item.product.saleType === saleType))
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // 5. Product Catalog & Inventory Handlers
  const handleToggleFavorite = (id: string) => {
    setProducts((prevProducts) => {
      const updated = prevProducts.map((p) => {
        if (p.id === id) {
          const nextVal = !p.isFavorite;
          return { ...p, isFavorite: nextVal };
        }
        return p;
      });
      return updated;
    });
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    setProducts((prevProducts) => {
      if (productData.id) {
        // Edit flow
        return prevProducts.map((p) =>
          p.id === productData.id ? (productData as Product) : p
        );
      } else {
        // Create flow - Determine next incremental ID
        const lastIdNumber = prevProducts
          .map((p) => {
            const num = parseInt(p.id.replace('HT-', ''), 10);
            return isNaN(num) ? 0 : num;
          })
          .reduce((max, num) => Math.max(max, num), 0);

        const nextId = `HT-${String(lastIdNumber + 1).padStart(3, '0')}`;
        const newProduct: Product = {
          ...(productData as Product),
          id: nextId
        };
        return [newProduct, ...prevProducts];
      }
    });

    // Reset Form contexts
    setSelectedEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    // Delete product from inventory list
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
    // Also clear deleted item from current shopping bag if matches
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== id));
  };

  const handleAddProductTrigger = () => {
    setSelectedEditingProduct(null);
    setFormMode('create');
    setCurrentView('form');
  };

  const handleEditProductTrigger = (product: Product) => {
    setSelectedEditingProduct(product);
    setFormMode('edit');
    setCurrentView('form');
  };

  // 6. Navigation router
  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'catalog':
        return (
          <Catalog
            products={products}
            searchTerm={searchTerm}
            cartItems={cart}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToCart={() => handleNavigate('cart')}
            dailyOffers={dailyOffers}
            categories={categories}
          />
        );
      case 'cart':
        return (
          <Cart
            cartItems={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveItem}
            customerInfo={customerInfo}
            onUpdateCustomerInfo={setCustomerInfo}
            onClearCart={handleClearCart}
            onNavigateToCatalog={() => handleNavigate('catalog')}
          />
        );
      case 'dashboard':
        if (!isAdmin) {
          return (
            <AdminGate
              onSuccess={() => {
                setIsAdmin(true);
                sessionStorage.setItem('sacolao_is_admin', 'true');
              }}
              onCancel={() => handleNavigate('catalog')}
            />
          );
        }
        return (
          <Dashboard
            products={products}
            searchTerm={searchTerm}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            onAddProductTrigger={handleAddProductTrigger}
            onEditProduct={handleEditProductTrigger}
            onDeleteProduct={handleDeleteProduct}
            onNavigateToCart={() => handleNavigate('cart')}
            dailyOffers={dailyOffers}
            onUpdateDailyOffers={setDailyOffers}
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            isOffline={isOffline}
            onToggleOffline={handleToggleOffline}
          />
        );
      case 'form':
        if (!isAdmin) {
          return (
            <AdminGate
              onSuccess={() => {
                setIsAdmin(true);
                sessionStorage.setItem('sacolao_is_admin', 'true');
              }}
              onCancel={() => handleNavigate('catalog')}
            />
          );
        }
        return (
          <ProductForm
            mode={formMode}
            initialProduct={selectedEditingProduct}
            onSave={handleSaveProduct}
            onCancel={() => handleNavigate('dashboard')}
            categories={categories}
          />
        );
      case 'favorites':
        return (
          <Favorites
            products={products}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onNavigateToCatalog={() => handleNavigate('catalog')}
          />
        );

      default:
        return null;
    }
  };

  if (isOffline && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#f7fbf2] flex flex-col justify-between font-sans select-none antialiased">
        <header className="py-6 border-b border-[#bfc9bc]/20 bg-white shadow-xs">
          <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
            <span className="font-display-lg text-2xl font-bold text-[#176c33] tracking-tight hover:opacity-90 cursor-pointer" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Sacolão Pimp
            </span>
            <button
              onClick={() => handleNavigate('dashboard')}
              className="text-xs font-bold text-[#176c33] hover:underline flex items-center gap-1 cursor-pointer"
            >
              🔐 Área do Administrador
            </button>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-5">
          <div className="bg-white p-10 rounded-2xl border border-[#bfc9bc]/30 shadow-xl max-w-lg w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto border border-amber-200 shadow-xs">
              <span className="text-4xl">🛠️</span>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Estamos em Manutenção!
              </h1>
              <p className="text-sm text-[#707a6e] leading-relaxed">
                Estamos fazendo algumas melhorias e atualizando nosso catálogo com as frutas, legumes e verduras mais frescos da região para melhor lhe atender.
              </p>
              <div className="bg-[#f7fbf2] p-4 rounded-xl border border-[#bfc9bc]/20 text-xs text-[#176c33] font-bold">
                Voltamos em instantes! Agradecemos a sua compreensão. 🥬🍅
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col items-center gap-2 text-xs text-gray-400">
              <p className="font-semibold text-gray-500">Sacolão Pimp</p>
              <p>Higiene estrita, frescor imbatível e qualidade na sua mesa.</p>
            </div>
          </div>
        </main>

        <footer className="py-6 border-t border-[#bfc9bc]/10 bg-[#181d18] text-center text-xs text-gray-500">
          <p>© 2026 Sacolão Pimp. Todos os direitos reservados.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fbf2] flex flex-col font-sans select-none antialiased">
      {/* Dynamic Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={products.filter((p) => p.isFavorite).length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isAdmin={isAdmin}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Main Container viewports */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-5 py-6">
        {renderActiveView()}
      </main>

      {/* Persistent footer */}
      <footer className="bg-[#181d18] text-gray-300 border-t border-[#bfc9bc]/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <p className="font-black text-white text-xl tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Sacolão Pimp
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Selecionamos hortifrúti diariamente direto com produtores rurais. Higiene estrita, frescor imbatível e compromisso com o bem-estar da sua família na mesa.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#176c33]/30 text-emerald-400 border border-[#176c33]/50">
                Produção Sustentável
              </span>
            </div>
          </div>

          {/* Column 2: Schedule */}
          <div className="space-y-4">
            <p className="font-extrabold text-sm text-white uppercase tracking-wider" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Horários de Atendimento
            </p>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex justify-between border-b border-gray-800 pb-1.5">
                <span>Segunda á Sábado</span>
                <span className="text-emerald-400 font-semibold">6:00 às 19:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1.5">
                <span>Domingo</span>
                <span className="text-amber-400 font-semibold">7:00 às 10:00</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">
                *Pedidos feitos em feriados estão sujeitos à alteração de fila de entrega.
              </p>
            </div>
          </div>

          {/* Column 3: Contact & Identity */}
          <div className="space-y-4">
            <p className="font-extrabold text-sm text-white uppercase tracking-wider" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Identificação & Suporte
            </p>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-start gap-2">
                <span>Rua Euclides Barroso, N° 1453 - Santa Luzia, Canindé-CE</span>
              </p>
              <p className="flex items-center gap-2">
                <a href="mailto:sacolaocaninde@gmail.com" className="hover:underline text-[#6dbe7b] font-medium">sacolaocaninde@gmail.com</a>
              </p>
              <div className="pt-2 border-t border-gray-800 mt-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider leading-none mb-1">CNPJ do Estabelecimento</span>
                <span className="text-xs font-mono font-bold text-gray-300">24.318.866/0001-03</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar copyright lines */}
        <div className="max-w-7xl mx-auto px-5 pt-8 mt-12 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Sacolão Pimp. Todos os direitos reservados. Qualidade de colheita e respeito ao cliente.</p>
          <div className="flex gap-4 text-[10px]">
            <button
              onClick={() => setActiveFooterModal('terms')}
              className="hover:text-white transition-all cursor-pointer bg-transparent border-none p-0 text-gray-500 hover:underline outline-none"
              title="Clique para ler os Termos de Serviço"
            >
              Termos de Serviço
            </button>
            <button
              onClick={() => setActiveFooterModal('privacy')}
              className="hover:text-white transition-all cursor-pointer bg-transparent border-none p-0 text-gray-500 hover:underline outline-none"
              title="Clique para ler a Política de Privacidade"
            >
              Privacidade Garantida
            </button>
          </div>
        </div>
      </footer>

      {/* Footer Modals */}
      {activeFooterModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setActiveFooterModal(null)}
          ></div>
          
          {/* Modal Container */}
          <div className="bg-white rounded-3xl border border-[#bfc9bc]/30 shadow-2xl max-w-lg w-full p-6 md:p-8 relative z-10 max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveFooterModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#707a6e] hover:text-[#181d18] transition-all cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            
            {activeFooterModal === 'terms' ? (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#176c33] uppercase tracking-widest block">Sacolão Pimp</span>
                  <h3 className="text-xl font-extrabold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    Termos de Serviço
                  </h3>
                </div>
                
                <div className="text-xs text-[#40493f] leading-relaxed space-y-4 pt-2">
                  <p>
                    Bem-vindo ao <strong>Sacolão Pimp</strong>. Ao navegar em nossa plataforma e realizar pedidos, você concorda de maneira livre com as seguintes diretrizes comerciais:
                  </p>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">1. Qualidade e Frescor</p>
                    <p>
                      Todos os nossos produtos (frutas, legumes e verduras) são selecionados e higienizados rigorosamente. Comprometemo-nos com o mais alto padrão de frescor da colheita à sua mesa.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">2. Formatos de Venda e Pesagem</p>
                    <p>
                      Os preços mostrados correspondem ao formato de venda escolhido (por Quilo, Unidade, Inteiro, Banda ou Quarto). Para produtos faturados em frações ou peso dinâmico, pequenas variações naturais podem ocorrer. O valor real exato será validado e enviado no fechamento pelo WhatsApp.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">3. Entregas e Prazos</p>
                    <p>
                      As entregas acontecem no município de Canindé-CE durante os horários comerciais estabelecidos. Pedidos feitos próximos ao encerramento do expediente ou em feriados podem ser reagendados para o turno seguinte mediante aviso prévio.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">4. Cancelamento de Pedidos</p>
                    <p>
                      Você poderá alterar ou solicitar o cancelamento total do seu carrinho diretamente com o nosso time de atendimento via WhatsApp a qualquer momento antes do despacho da mercadoria pela equipe de entrega.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#bfc9bc]/20 text-[10px] text-gray-400 text-center">
                  Última atualização: Julho de 2026. CNPJ 24.318.866/0001-03
                </div>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#176c33] uppercase tracking-widest block">Sacolão Pimp</span>
                  <h3 className="text-xl font-extrabold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    Privacidade Garantida
                  </h3>
                </div>
                
                <div className="text-xs text-[#40493f] leading-relaxed space-y-4 pt-2">
                  <p>
                    A sua privacidade é nossa prioridade absoluta. O <strong>Sacolão Pimp</strong> segue políticas estritas para garantir que seus dados de navegação e compra estejam sempre seguros:
                  </p>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">1. Minimização de Coleta</p>
                    <p>
                      Solicitamos exclusivamente os dados indispensáveis para a realização das entregas do seu hortifrúti: seu Nome, Bairro, Rua/Número e a Forma de Pagamento preferida. Não coletamos dados desnecessários ou sensíveis.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">2. Armazenamento Local Seguro</p>
                    <p>
                      Para sua conveniência e agilidade no fechamento de futuros pedidos, os seus dados de entrega ficam guardados de forma segura localmente no seu próprio navegador (usando <code>localStorage</code>). Suas informações nunca são enviadas ou armazenadas em servidores externos da nossa parte.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">3. Integração com WhatsApp</p>
                    <p>
                      O processo de fechamento do carrinho redireciona as informações estruturadas do pedido diretamente para o WhatsApp oficial do Sacolão Pimp, gerando um canal direto, seguro e privado de atendimento ponto a ponto.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">4. Controle Total do Usuário</p>
                    <p>
                      Você possui controle integral sobre seus dados. Caso deseje limpar suas informações do nosso banco local temporário, basta limpar os dados do site ou histórico de cache do seu navegador ou atualizar os campos do carrinho de compras.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#bfc9bc]/20 text-[10px] text-gray-400 text-center">
                  Segurança em conformidade com as melhores práticas de privacidade.
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveFooterModal(null)}
                className="px-5 py-2.5 rounded-full bg-[#176c33] hover:bg-[#115326] text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-[#176c33]/10"
              >
                Entendi, Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
