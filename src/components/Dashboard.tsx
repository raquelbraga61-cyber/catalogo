import React, { useState } from 'react';
import { PlusCircle, Plus, Search, Trash2, Edit, TrendingUp, ChevronLeft, ChevronRight, ShoppingCart, Tag, Image, Sparkles, RefreshCw, Eye, X } from 'lucide-react';
import { Product, CategoryType, DailyOffer } from '../types';

interface DashboardProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onEditProduct: (product: Product) => void;
  onAddProductTrigger: () => void;
  cartCount: number;
  onNavigateToCart: () => void;
  searchTerm: string;
  dailyOffers: DailyOffer[];
  onUpdateDailyOffers: (offers: DailyOffer[]) => void;
  categories?: { name: string; icon: string }[];
  onAddCategory?: (name: string, icon: string) => void;
  onDeleteCategory?: (name: string) => void;
  isOffline?: boolean;
  onToggleOffline?: (val: boolean) => void;
}

const BACKGROUND_PRESETS = [
  { name: 'Horta Orgânica', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2TteofSMBjMB6hWFlPuT7ehrMQkljYM65cqPUJIsr91DvVPNDelcJpOpfAtQb58vsAZw2mZAvWKLGTEo_K-jTBXrY-iYJAWK6Bdfy2-V3cK6Tb7GGk66GCkqrbk60_WTM9FOxFLR3mTCYqJuYDC9iJmnBcY9xf1MO7xX9bnKtK05Cm8aevshqp7uf-3rc12cvvoO0zaDxdb0obnSB_RualhWmipmsI1GrV8JyvubQf4opYom5lsLYrjdWFs2RFWUZPV1a3gVPZko' },
  { name: 'Cesta de Tomates', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrdDkmHMTpc4opGw5CNXrjir_h4OkyumlhQImTHMPekgegBjkU7eLjlb0gQHNMR4zFIb76mJXL9hHJ-agiziKWz701UydipI90auHpZaJTgijMprP9gI6guxBiffMl1G9FcDobKMrWxDxYMaYjCdTmnI3xfYk2qJAubTEvBsGcApJFhse-YYDgBrydk-zKbPrBWJjndKvL4VTelHVO_-f7bP5z3wRA-G-UJ4PKXo7zTbnwOXA1lJUGhm4opJfKJ_PmZvK_Pfz_h_o' },
  { name: 'Cesta de Maçãs Gala', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYyUpXxFCoTM1Vhoy3eDJnC9upba3Jfo0bB0E0b1YRVyVV1Vbcu2k2Nwi6W_vfAUZ3BuvZ-pmDL23jOOpcSlctIvcuRod3a7TvANYoZcjGX4Negv6T92HDtaaglzZk_uexHJEYmkY-rrUIllzHa-aTmwfLB-rW0ZXtrUoU64LUHoQWZYi24hWm443oqBDPyQEMojbEGHplKAr5pvbnY7p2gGT028_Pw1va3wDYNPacWGsYxoZZRJWNRjgcGLAY5uFrseJQuwPeXlA' },
  { name: 'Caixa de Alface e Feira', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR6jyxE_2OIOtdbUiqVpPX4Q2GE_gVoipZdJsoP1AOqUqHWgwTVudtbvfSvfCvF3Y4D1Thx6k7EVoM1rpTin8M3XL6dRcMdv1XuS-j0-1kVrX6yHp4etW_XgqH8ZTePRFiNh7IZSH-FyulUbpU3x7G-n9bGMXTKl9E8Z3aXqKX0OeZT226Hx1N5I3yeFS4aqdMKKFPdHPpf2FGvxtvJ-yA95cz_XLcINC3GZcibFpHcpgBf_RWzhhWbVC70yO8711XBSE-qqOw-uA' }
];

export default function Dashboard({
  products,
  onDeleteProduct,
  onEditProduct,
  onAddProductTrigger,
  cartCount,
  onNavigateToCart,
  searchTerm,
  dailyOffers = [],
  onUpdateDailyOffers,
  categories = [],
  onAddCategory,
  onDeleteCategory,
  isOffline = false,
  onToggleOffline
}: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Offer editor states
  const [isEditingOffer, setIsEditingOffer] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);

  const [offerBadge, setOfferBadge] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerImg, setOfferImg] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStartEditBanner = (offer: DailyOffer) => {
    setSelectedBannerId(offer.id || '1');
    setOfferBadge(offer.badge);
    setOfferTitle(offer.title);
    setOfferDesc(offer.description);
    setOfferImg(offer.imageUrl);
    setIsEditingOffer(true);
    setSaveSuccess(false);
  };

  const handleStartCreateBanner = () => {
    setSelectedBannerId(null);
    setOfferBadge('');
    setOfferTitle('');
    setOfferDesc('');
    setOfferImg(BACKGROUND_PRESETS[0].url);
    setIsEditingOffer(true);
    setSaveSuccess(false);
  };

  const handleSaveBanner = () => {
    if (!offerTitle.trim() || !offerImg.trim()) {
      alert('Por favor, preencha o título e a imagem do banner.');
      return;
    }

    if (selectedBannerId) {
      // Editing existing
      const updated = dailyOffers.map((offer, idx) => {
        const oId = offer.id || String(idx);
        if (oId === selectedBannerId) {
          return {
            ...offer,
            badge: offerBadge,
            title: offerTitle,
            description: offerDesc,
            imageUrl: offerImg
          };
        }
        return offer;
      });
      onUpdateDailyOffers(updated);
    } else {
      // Creating new
      const newOffer: DailyOffer = {
        id: String(Date.now()),
        badge: offerBadge,
        title: offerTitle,
        description: offerDesc,
        imageUrl: offerImg
      };
      onUpdateDailyOffers([...dailyOffers, newOffer]);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
    setIsEditingOffer(false);
    setSelectedBannerId(null);
    setOfferBadge('');
    setOfferTitle('');
    setOfferDesc('');
    setOfferImg('');
  };

  const handleDeleteBanner = (offerId?: string, index?: number) => {
    if (dailyOffers.length <= 1) {
      alert('Você precisa manter pelo menos 1 banner ativo no carrossel.');
      return;
    }
    const confirmDelete = window.confirm('Deseja realmente remover este banner do carrossel?');
    if (!confirmDelete) return;

    const filtered = dailyOffers.filter((offer, idx) => {
      if (offerId) {
        return offer.id !== offerId;
      }
      return idx !== index;
    });
    onUpdateDailyOffers(filtered);
  };

  // Dynamic Categories states
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🍎');
  const [catMsg, setCatMsg] = useState('');
  const [activeOrderPeriod, setActiveOrderPeriod] = useState<string | null>(null);
  const [showMonthHistory, setShowMonthHistory] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Statistics
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const categoriesCount = new Set(products.map(p => p.category)).size;

  // Retrieve and calculate order statistics for Day, Week, Month
  const [orders, setOrders] = useState<{ timestamp: number; totalValue: number; itemsCount: number }[]>(() => {
    const stored = localStorage.getItem('sacolao_orders');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // Continue to seed if error
      }
    }
    
    // Seed realistic order history for demonstration/admin convenience (up to 120 days ago)
    const seedOrders: { timestamp: number; totalValue: number; itemsCount: number }[] = [];
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Add 3 orders today (same calendar day)
    seedOrders.push({ timestamp: now - 0.1 * oneDay, totalValue: 42.50, itemsCount: 4 });
    seedOrders.push({ timestamp: now - 0.3 * oneDay, totalValue: 28.90, itemsCount: 3 });
    seedOrders.push({ timestamp: now - 0.6 * oneDay, totalValue: 65.20, itemsCount: 6 });
    
    // Add orders over the last 120 days to guarantee multi-month archives
    for (let i = 1; i < 120; i++) {
      // Different probabilities or number of orders depending on age
      const probability = i < 7 ? 0.9 : i < 30 ? 0.7 : 0.45;
      if (Math.random() < probability) {
        const numOrders = Math.floor(Math.random() * 2) + 1; // 1 to 2 orders
        for (let j = 0; j < numOrders; j++) {
          seedOrders.push({
            timestamp: now - i * oneDay - Math.random() * 0.5 * oneDay,
            totalValue: parseFloat((Math.random() * 45 + 15).toFixed(2)),
            itemsCount: Math.floor(Math.random() * 4) + 2
          });
        }
      }
    }
    
    localStorage.setItem('sacolao_orders', JSON.stringify(seedOrders));
    return seedOrders;
  });

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  // Today: Same calendar day
  const todayStr = new Date().toDateString();
  const ordersToday = orders.filter(o => new Date(o.timestamp).toDateString() === todayStr);
  const countToday = ordersToday.length;
  const valueToday = ordersToday.reduce((acc, o) => acc + o.totalValue, 0);
  
  // Week: last 7 days
  const ordersWeek = orders.filter(o => o.timestamp >= now - 7 * oneDay);
  const countWeek = ordersWeek.length;
  const valueWeek = ordersWeek.reduce((acc, o) => acc + o.totalValue, 0);
  
  // Month: last 30 days
  const ordersMonth = orders.filter(o => o.timestamp >= now - 30 * oneDay);
  const countMonth = ordersMonth.length;
  const valueMonth = ordersMonth.reduce((acc, o) => acc + o.totalValue, 0);

  // Group orders dynamically by calendar month (e.g., "Julho de 2026")
  const getOrdersByMonth = () => {
    const groups: { [key: string]: { label: string; yearMonthKey: string; list: { timestamp: number; totalValue: number; itemsCount: number }[]; totalValue: number } } = {};
    
    orders.forEach(order => {
      const date = new Date(order.timestamp);
      const year = date.getFullYear();
      const monthNum = date.getMonth(); // 0-11
      const key = `${year}-${String(monthNum + 1).padStart(2, '0')}`;
      
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      const label = `${monthNames[monthNum]} de ${year}`;
      
      if (!groups[key]) {
        groups[key] = { label, yearMonthKey: key, list: [], totalValue: 0 };
      }
      
      groups[key].list.push(order);
      groups[key].totalValue += order.totalValue;
    });
    
    return Object.values(groups).sort((a, b) => b.yearMonthKey.localeCompare(a.yearMonthKey));
  };

  const getPeriodOrders = () => {
    if (activeOrderPeriod === 'hoje') return { title: 'Compras de Hoje', list: ordersToday };
    if (activeOrderPeriod === 'semana') return { title: 'Compras da Semana (Últimos 7 dias)', list: ordersWeek };
    if (activeOrderPeriod === 'mes') return { title: 'Compras do Mês (Últimos 30 dias)', list: ordersMonth };
    
    if (activeOrderPeriod && activeOrderPeriod.includes('-')) {
      const monthsData = getOrdersByMonth();
      const match = monthsData.find(m => m.yearMonthKey === activeOrderPeriod);
      if (match) {
        return { title: `Compras de ${match.label}`, list: match.list };
      }
    }
    return { title: '', list: [] };
  };

  // Handles sorting togglet
  const handleSort = (field: 'name' | 'price' | 'stock') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Search Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let multiplier = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'name') {
      return multiplier * a.name.localeCompare(b.name);
    }
    if (sortField === 'price') {
      return multiplier * (a.price - b.price);
    }
    if (sortField === 'stock') {
      const stockA = a.stock || 0;
      const stockB = b.stock || 0;
      return multiplier * (stockA - stockB);
    }
    return 0;
  });

  // Pagination bounds
  const totalItemsCount = sortedProducts.length;
  const totalPagesCount = Math.ceil(totalItemsCount / itemsPerPage) || 1;
  const pagedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const confirmDeleteAction = () => {
    if (confirmDeleteId) {
      onDeleteProduct(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  // Predefined category badge colors
  const getCategoryThemeClass = (cat: CategoryType) => {
    switch (cat) {
      case 'Frutas':
        return 'bg-[#a2f6ad]/30 text-[#004b1e]';
      case 'Verduras':
        return 'bg-[#c9ecc9] text-[#176c33]';
      case 'Legumes':
        return 'bg-[#ffd9e1] text-[#7b2945]';
      case 'Grãos':
        return 'bg-amber-100 text-amber-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header and Add Action */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#bfc9bc]/30 pb-4">
        <div>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Painel de Gestão
          </h2>
          <p className="text-sm text-[#707a6e]">Controle o inventário, estoque, preços e cadastro das mercadorias frescas.</p>
        </div>

        <button
          onClick={onAddProductTrigger}
          className="flex items-center justify-center gap-2 bg-[#176c33] hover:bg-[#115326] text-white px-8 h-12 rounded-full transition-all duration-300 transform active:scale-95 shadow-lg shadow-[#176c33]/20 font-bold text-sm select-none cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="uppercase tracking-wider">Cadastrar Novo Produto</span>
        </button>
      </section>

{/* Stats row widgets */}
      <section className="grid grid-cols-1 gap-6">

         {/* Promotional details box */}
        <div className="bg-[#176c33] text-white p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="relative z-10 space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2 gap-2">
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Plus Jakarta Sans' }}>Resumo de Crescimento</h3>
              <div className="flex flex-wrap items-center gap-2">
                {confirmReset ? (
                  <div className="flex items-center gap-1.5 bg-red-950/50 border border-red-500/40 rounded-lg p-1">
                    <span className="text-[10px] text-red-200 font-extrabold px-1">Zerar vendas?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setOrders([]);
                        localStorage.setItem('sacolao_orders', JSON.stringify([]));
                        setConfirmReset(false);
                      }}
                      className="bg-red-600 hover:bg-red-700 active:scale-95 text-[9px] text-white px-2 py-1 rounded font-black cursor-pointer transition-all uppercase select-none"
                    >
                      Sim, Zerar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="bg-white/10 hover:bg-white/20 text-[9px] text-white px-2 py-1 rounded font-black cursor-pointer transition-all uppercase select-none"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="text-[10px] bg-red-600/30 hover:bg-red-600/50 hover:text-white text-red-200 border border-red-500/20 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer select-none"
                    title="Zerar todo o histórico de compras guardadas"
                  >
                    Zerar Vendas
                  </button>
                )}
                <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider select-none">Fluxo de Vendas</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActiveOrderPeriod('hoje')}
                className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex flex-col justify-between text-left cursor-pointer hover:bg-white/15 transition-all outline-none focus:ring-2 focus:ring-white/20 select-none active:scale-95"
              >
                <p className="text-[9px] text-emerald-200 uppercase font-black tracking-wider">Hoje</p>
                <p className="text-xl font-black mt-0.5">{countToday} {countToday === 1 ? 'venda' : 'vendas'}</p>
                <p className="text-[9px] text-emerald-100/70 mt-1">R$ {valueToday.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveOrderPeriod('semana')}
                className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex flex-col justify-between text-left cursor-pointer hover:bg-white/15 transition-all outline-none focus:ring-2 focus:ring-white/20 select-none active:scale-95"
              >
                <p className="text-[9px] text-emerald-200 uppercase font-black tracking-wider">Na Semana</p>
                <p className="text-xl font-black mt-0.5">{countWeek} {countWeek === 1 ? 'venda' : 'vendas'}</p>
                <p className="text-[9px] text-emerald-100/70 mt-1">R$ {valueWeek.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveOrderPeriod('mes')}
                className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex flex-col justify-between text-left cursor-pointer hover:bg-white/15 transition-all outline-none focus:ring-2 focus:ring-white/20 select-none active:scale-95"
              >
                <p className="text-[9px] text-emerald-200 uppercase font-black tracking-wider">No Mês</p>
                <p className="text-xl font-black mt-0.5">{countMonth} {countMonth === 1 ? 'venda' : 'vendas'}</p>
                <p className="text-[9px] text-emerald-100/70 mt-1">R$ {valueMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </button>
            </div>

            {/* Toggle button to show monthly history inside growth summary */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowMonthHistory(!showMonthHistory)}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 cursor-pointer transition-all outline-none select-none"
              >
                <span>{showMonthHistory ? 'Ocultar Histórico Mensal' : 'Ver Histórico Mensal'}</span>
                <span className="bg-white/20 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                  {getOrdersByMonth().length}
                </span>
              </button>
            </div>

            {/* Historical monthly summaries */}
            {showMonthHistory && (
              <div className="pt-3 border-t border-white/10 space-y-2 animate-in slide-in-from-top-1 duration-200">
                <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Histórico de Meses (Guardados automaticamente)</p>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-1">
                  {getOrdersByMonth().map((monthData) => (
                    <button
                      key={monthData.yearMonthKey}
                      type="button"
                      onClick={() => setActiveOrderPeriod(monthData.yearMonthKey)}
                      className="bg-white/10 hover:bg-white/20 active:scale-95 text-[11px] px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 cursor-pointer transition-all outline-none select-none"
                      title={`Ver vendas de ${monthData.label}`}
                    >
                      <span className="font-bold">{monthData.label.split(' de ')[0]}</span>
                      <span className="opacity-40">|</span>
                      <span className="font-extrabold text-emerald-200">R$ {monthData.totalValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-5">
            <TrendingUp className="w-48 h-48" />
          </div>
        </div>

      </section>

      {/* Website Status & Maintenance Mode Block */}
      <section className="bg-white rounded-2xl border border-[#bfc9bc]/30 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Controle de Funcionamento do Site
            </h3>
          
          <div className="flex-shrink-0 flex items-center gap-3">
            {isOffline ? (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3.5 py-2 rounded-full border border-red-200 text-xs font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span>FORA DO AR (MANUTENÇÃO)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-full border border-emerald-200 text-xs font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>SITE ONLINE (ATIVO)</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onToggleOffline?.(!isOffline)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer shadow-sm transition-all active:scale-95 border ${
                isOffline
                  ? 'bg-[#176c33] border-[#176c33] text-white hover:bg-[#115326]'
                  : 'bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-red-200'
              }`}
            >
              {isOffline ? 'Colocar Site no Ar' : 'Tirar Site do Ar'}
            </button>
          </div>
        </div>
      </section>

      {/* Managing Promotion Banner Block */}
      <section className="bg-white rounded-2xl border border-[#bfc9bc]/30 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#bfc9bc]/15 pb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#176c33]/10 rounded-full flex items-center justify-center text-[#176c33]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Editar Carrossel de Banners e Ofertas
              </h3>
              <p className="text-xs text-[#707a6e]">
                Adicione múltiplos banners promocionais que rotacionam automaticamente no catálogo dos clientes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStartCreateBanner}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#176c33] hover:bg-[#115326] text-white rounded-full transition-all text-xs font-bold cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Banner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Banners List (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#40493f]">Banners Ativos ({dailyOffers.length})</h4>
            
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {dailyOffers.map((offer, index) => {
                const offerId = offer.id || String(index);
                return (
                  <div
                    key={offerId}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      selectedBannerId === offerId && isEditingOffer
                        ? 'border-[#176c33] bg-[#f7fbf2]'
                        : 'border-[#bfc9bc]/25 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-10 rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-100 border border-black/5">
                        <img
                          src={offer.imageUrl}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        {offer.badge && (
                          <span className="inline-block text-[9px] bg-[#6dbe7b]/10 text-[#176c33] font-bold px-1.5 py-0.2 rounded uppercase mb-0.5">
                            {offer.badge}
                          </span>
                        )}
                        <h5 className="text-xs font-bold text-[#181d18] truncate">{offer.title}</h5>
                        <p className="text-[10px] text-[#707a6e] truncate">{offer.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditBanner(offer)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#176c33] hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Editar Banner"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(offer.id, index)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remover Banner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Editor and Preview (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {isEditingOffer ? (
              <div className="bg-white rounded-xl border border-[#bfc9bc]/30 p-5 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#176c33]">
                    {selectedBannerId ? 'Editar Banner Selecionado' : 'Criar Novo Banner'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingOffer(false);
                      setSelectedBannerId(null);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Badge */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#40493f]">Marcador / Badge</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#707a6e]" />
                        <input
                          type="text"
                          value={offerBadge}
                          onChange={(e) => {
                            setOfferBadge(e.target.value);
                            setSaveSuccess(false);
                          }}
                          placeholder="Ex: Oferta de Hoje"
                          className="w-full h-9 pl-9 pr-4 bg-[#f7fbf2] border border-[#bfc9bc]/40 rounded-full text-xs font-semibold text-[#181d18] focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#40493f]">Título Principal *</label>
                      <input
                        type="text"
                        required
                        value={offerTitle}
                        onChange={(e) => {
                          setOfferTitle(e.target.value);
                          setSaveSuccess(false);
                        }}
                        placeholder="Ex: Frutas Frescas de Época"
                        className="w-full h-9 px-4 bg-[#f7fbf2] border border-[#bfc9bc]/40 rounded-full text-xs font-semibold text-[#181d18] focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Subtitle / Desc */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#40493f]">Descrição / Detalhe</label>
                    <input
                      type="text"
                      value={offerDesc}
                      onChange={(e) => {
                        setOfferDesc(e.target.value);
                        setSaveSuccess(false);
                      }}
                      placeholder="Ex: Economize em toneladas de hortaliças!"
                      className="w-full h-9 px-4 bg-[#f7fbf2] border border-[#bfc9bc]/40 rounded-full text-xs font-semibold text-[#181d18] focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                    />
                  </div>

                  {/* Image URL with Preset Backgrounds */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#40493f]">
                      URL da Imagem de Fundo * (ou selecione um preset)
                    </label>
                    <div className="relative">
                      <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#707a6e]" />
                      <input
                        type="url"
                        required
                        value={offerImg}
                        onChange={(e) => {
                          setOfferImg(e.target.value);
                          setSaveSuccess(false);
                        }}
                        placeholder="https://exemplo.com/horta.jpg"
                        className="w-full h-9 pl-9 pr-4 bg-[#f7fbf2] border border-[#bfc9bc]/40 rounded-full text-xs font-semibold text-[#181d18] focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {BACKGROUND_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setOfferImg(p.url);
                            setSaveSuccess(false);
                          }}
                          className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            offerImg === p.url
                              ? 'bg-[#176c33] text-white border-[#176c33]'
                              : 'bg-white text-[#40493f] border-[#bfc9bc]/30 hover:bg-gray-50'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Preview */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-[#40493f] uppercase tracking-wider block">Pré-visualização do Banner:</span>
                    <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-xs border border-[#bfc9bc]/20 bg-gray-50">
                      {offerImg ? (
                        <img
                          alt={offerTitle || 'Visualização do Banner'}
                          className="absolute inset-0 w-full h-full object-cover brightness-75 select-none"
                          referrerPolicy="no-referrer"
                          src={offerImg}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">Insira uma URL de imagem válida</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent flex items-center px-6 text-white">
                        <div className="space-y-1 max-w-[85%]">
                          {offerBadge && (
                            <span className="inline-block text-[8px] bg-[#6dbe7b]/30 text-[#a2f6ad] font-extrabold tracking-wider px-2 py-0.5 rounded-full uppercase border border-[#6dbe7b]/20">
                              {offerBadge}
                            </span>
                          )}
                          <h4 className="text-xs md:text-sm font-extrabold leading-tight line-clamp-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                            {offerTitle || 'Título da Oferta'}
                          </h4>
                          <p className="text-[9px] text-gray-200 truncate">
                            {offerDesc || 'Frase complementar e cupom de destaque.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingOffer(false);
                      setSelectedBannerId(null);
                      setOfferBadge('');
                      setOfferTitle('');
                      setOfferDesc('');
                      setOfferImg('');
                    }}
                    className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#40493f] rounded-full text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveBanner}
                    className="px-5 py-2 bg-[#176c33] hover:bg-[#115326] text-white rounded-full text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#176c33]/15 cursor-pointer"
                  >
                    {selectedBannerId ? 'Salvar Banner' : 'Adicionar Banner'}
                  </button>
                </div>
              </div>
            ) : null}

            {saveSuccess && (
              <div className="bg-[#e8f5e9] text-[#1b5e20] px-4 py-2.5 rounded-xl border border-[#c8e6c9] text-xs font-bold flex items-center gap-1.5 animate-in slide-in-from-top-1.5 duration-200">
                <span>✓ Sucesso! O carrossel de banners foi atualizado instantaneamente.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Management Block */}
      <section className="bg-white rounded-2xl border border-[#bfc9bc]/30 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#bfc9bc]/15 pb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#176c33]/10 rounded-full flex items-center justify-center text-[#176c33]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Gerenciamento de Categorias de Produtos
              </h3>
              <p className="text-xs text-[#707a6e]">
                Cadastre novas categorias dinâmicas de hortifrúti ou remova as existentes.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* New Category Form (Left / Col-Span-5) */}
          <div className="lg:col-span-5 space-y-4">
          
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newCatName.trim()) return;
              if (onAddCategory) {
                onAddCategory(newCatName.trim(), "");
                setCatMsg(`✓ Categoria "${newCatName.trim()}" cadastrada com sucesso!`);
                setNewCatName('');
                setTimeout(() => setCatMsg(''), 3000);
              }
            }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Temperos, Mercearia, Orgânicos..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#f7fbf2] border border-[#bfc9bc]/35 text-xs focus:ring-2 focus:ring-[#176c33] focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#176c33] hover:bg-[#115326] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#176c33]/10 cursor-pointer"
              >
                Cadastrar Categoria
              </button>

              {catMsg && (
                <p className="text-xs text-[#176c33] font-bold mt-2 animate-pulse">{catMsg}</p>
              )}
            </form>
          </div>

          {/* Existing Categories List (Right / Col-Span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#40493f]">Categorias Cadastradas</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {categories.map((cat) => {
                const categoryProductsCount = products.filter(p => p.category === cat.name).length;
                
                return (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#bfc9bc]/25 bg-[#f7fbf2] hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      {cat.icon && (
                        <span className="text-xl bg-white p-1.5 shadow-2xs rounded-lg border border-black/5 flex items-center justify-center w-9 h-9">
                          {cat.icon}
                        </span>
                      )}
                      <div>
                        <p className="text-xs font-bold text-[#181d18]">{cat.name}</p>
                        <p className="text-[10px] text-[#707a6e]">
                          {categoryProductsCount} {categoryProductsCount === 1 ? 'produto' : 'produtos'}
                        </p>
                      </div>
                    </div>

                    {/* Allow deleting any category, showing a native confirmation */}
                    {onDeleteCategory && (
                      <button
                        type="button"
                        onClick={() => {
                          const hasProducts = categoryProductsCount > 0;
                          const msg = hasProducts
                            ? `Alerta: Existem ${categoryProductsCount} produtos usando a categoria "${cat.name}". Se você deletá-la, esses produtos continuarão gravados mas sem categoria correspondente. Deseja deletar mesmo assim?`
                            : `Tem certeza que deseja remover a categoria "${cat.name}"?`;
                          if (window.confirm(msg)) {
                            onDeleteCategory(cat.name);
                          }
                        }}
                        className="text-[#bfc9bc] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remover Categoria"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Inventory Search table */}
      <section className="bg-white rounded-2xl border border-[#bfc9bc]/30 shadow-sm overflow-hidden">
        
        {/* Table Filters header */}
        <div className="p-6 border-b border-[#bfc9bc]/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-lg text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Inventário de Produtos
          </h3>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Category selection filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as CategoryType | 'all');
                setCurrentPage(1);
              }}
              className="bg-[#f1f5ed] border-none text-[#181d18] text-xs font-semibold py-2.5 pl-4 pr-10 rounded-full focus:ring-2 focus:ring-[#176c33] focus:outline-none cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Quick sorting indicator */}
            <button
              onClick={() => handleSort('price')}
              className="px-3.5 py-2 hover:bg-[#f1f5ed] border border-[#bfc9bc]/30 rounded-full transition-all text-xs font-bold text-[#40493f] flex items-center gap-1 cursor-pointer"
              title="Alternar Ordenação por Preço"
            >
              <span>Preço: {sortField === 'price' ? (sortOrder === 'asc' ? 'Crescente' : 'Decrescente') : 'Padrão'}</span>
            </button>
          </div>
        </div>

        {/* Database table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f1f5ed] border-b border-[#bfc9bc]/15">
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 text-xs font-bold text-[#40493f] uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors"
                >
                  Produto {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#40493f] uppercase tracking-wider select-none">
                  Categoria
                </th>
                <th 
                  onClick={() => handleSort('stock')}
                  className="px-6 py-4 text-xs font-bold text-[#40493f] uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors"
                >
                  Estoque {sortField === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('price')}
                  className="px-6 py-4 text-xs font-bold text-[#40493f] uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors"
                >
                  Preço {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#40493f] uppercase tracking-wider text-right select-none">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc9bc]/10">
              {pagedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#707a6e] text-sm">
                    Nenhum produto cadastrado corresponde aos critérios de pesquisa atuais.
                  </td>
                </tr>
              ) : (
                pagedProducts.map((product) => {
                  const stockValue = product.stock || 0;
                  const isStockCritical = stockValue < 50;
                  
                  return (
                    <tr key={product.id} className="hover:bg-[#f1f5ed]/30 transition-all duration-150">
                      
                      {/* Product identity cell */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#f1f5ed] border border-gray-100 shadow-sm">
                            <img
                              alt={product.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              src={product.imageUrl}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#181d18]">{product.name}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-[#707a6e] font-semibold bg-gray-100 rounded-full px-2 py-0.5 border border-gray-200 shadow-xs">
                                ID: {product.id}
                              </span>

                              <span className="text-[9px] text-[#176c33] font-bold bg-[#176c33]/10 rounded-full px-2 py-0.5 border border-[#176c33]/20">
                                {product.allowedUnits === 'KG'
                                  ? 'Peso (KG) apenas'
                                  : product.allowedUnits === 'UNI'
                                  ? 'Unidade (UNI) apenas'
                                  : 'Ambos (KG & UNI)'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Product category tag */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryThemeClass(product.category)}`}>
                          {product.category}
                        </span>
                      </td>

                      {/* Stock count representation */}
                      <td className="px-6 py-4">
                        <div>
                          <p className={`text-xs font-bold ${isStockCritical ? 'text-[#99405c]' : 'text-[#181d18]'}`}>
                            {stockValue} {product.saleType === 'KG' ? 'kg' : 'un'}
                          </p>
                          {/* Rich visual level meter */}
                          <div className="w-24 h-1.5 bg-[#ebefe7] rounded-full mt-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isStockCritical ? 'bg-[#99405c]' : 'bg-[#176c33]'}`}
                              style={{ width: `${Math.min(100, (stockValue / 220) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Product pricing */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          {product.allowedUnits !== 'UNI' && (
                            <p className="text-xs font-bold text-[#176c33]">
                              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              <span className="text-[10px] font-normal text-[#707a6e] ml-0.5">/kg</span>
                            </p>
                          )}
                          {product.allowedUnits !== 'KG' && (
                            <p className="text-xs font-bold text-[#176c33]">
                              R$ {(product.priceUnit !== undefined && product.priceUnit !== null ? product.priceUnit : (product.allowedUnits === 'UNI' ? product.price : Math.round(product.price * 0.2))).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              <span className="text-[10px] font-normal text-[#707a6e] ml-0.5">/un</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions edit or remove */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="p-2 text-[#176c33] hover:bg-[#176c33]/10 rounded-full transition-all cursor-pointer"
                            title="Editar Dados do Produto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(product.id)}
                            className="p-2 text-[#99405c] hover:bg-red-50 rounded-full transition-all cursor-pointer"
                            title="Excluir Produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Database pagination controls */}
        <div className="p-6 border-t border-[#bfc9bc]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-[#707a6e]">
            Mostrando <span className="text-[#181d18] font-bold">{pagedProducts.length}</span> de{' '}
            <span className="text-[#181d18] font-bold">{totalItemsCount}</span> produtos no painel
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full border border-[#bfc9bc]/30 flex items-center justify-center hover:bg-[#f1f5ed] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer text-[#40493f]"
              aria-label="Página Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPagesCount }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNumber
                      ? 'bg-[#176c33] text-white shadow-md'
                      : 'border border-[#bfc9bc]/30 hover:bg-[#f1f5ed] text-[#40493f]'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPagesCount, prev + 1))}
              disabled={currentPage === totalPagesCount}
              className="w-8 h-8 rounded-full border border-[#bfc9bc]/30 flex items-center justify-center hover:bg-[#f1f5ed] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer text-[#40493f]"
              aria-label="Próxima Página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </section>

      {/* View shopping cart bottom navigator */}
      <nav 
        onClick={onNavigateToCart}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-30 sm:hidden rounded-full bg-[#176c33] shadow-xl p-4 cursor-pointer text-white flex items-center justify-center gap-2 border border-white/5 active:scale-95 transition-transform"
      >
        <span className="text-lg">🛒</span>
        <span className="font-bold text-xs uppercase tracking-wider">Ver sacola: {cartCount} itens</span>
      </nav>

      {/* Delete Confirmation Modal Overlay */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)}></div>
          <div className="relative bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#99405c]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Confirmar Exclusão
            </h3>
            <p className="text-xs text-[#707a6e] leading-relaxed">
              Deseja realmente remover permanentemente este produto do catálogo e do sistema de gestão? Esta ação é irreversível e removerá o item do catálogo imediatamente.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#40493f] rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-2 bg-[#99405c] hover:bg-[#7b2945] text-white rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchases list per selected period modal */}
      {activeOrderPeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#181d18]/60 backdrop-blur-xs" 
            onClick={() => setActiveOrderPeriod(null)} 
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-[#bfc9bc]/20 flex justify-between items-center bg-[#f7fbf2]">
              <div>
                <h3 className="font-bold text-lg text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {getPeriodOrders().title}
                </h3>
                <p className="text-xs text-[#707a6e]">
                  {getPeriodOrders().list.length} {getPeriodOrders().list.length === 1 ? 'compra registrada' : 'compras registradas'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrderPeriod(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-200/60 flex items-center justify-center text-[#40493f] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="p-5 overflow-y-auto space-y-3 divide-y divide-gray-100 flex-1">
              {getPeriodOrders().list.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-2">
                  <span className="text-4xl block">📭</span>
                  <p className="text-sm font-medium">Nenhuma compra registrada nesse período.</p>
                </div>
              ) : (
                [...getPeriodOrders().list]
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((order, idx) => {
                    const date = new Date(order.timestamp);
                    const formattedDate = date.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });
                    const formattedTime = date.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div key={idx} className={`${idx > 0 ? 'pt-3' : ''} flex items-center justify-between`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#181d18]">Compra #{getPeriodOrders().list.length - idx}</span>
                            <span className="text-[10px] bg-[#176c33]/10 text-[#176c33] font-extrabold px-1.5 py-0.5 rounded">CONCLUÍDO</span>
                          </div>
                          <p className="text-xs text-[#707a6e]">
                            {formattedDate} às {formattedTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-[#176c33]">
                            R$ {order.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[10px] text-[#707a6e]">
                            {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'itens'}
                          </p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#bfc9bc]/10 bg-gray-50 flex items-center justify-between text-xs text-[#40493f]">
              <span>Valor Total no Período:</span>
              <span className="font-extrabold text-[#176c33] text-sm">
                R$ {(getPeriodOrders().list.reduce((sum, o) => sum + o.totalValue, 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
