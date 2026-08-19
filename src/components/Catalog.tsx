import React, { useState, useEffect } from 'react';
import { Heart, Plus, ArrowRight, Truck, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, CategoryType, CartItem, DailyOffer } from '../types';

interface CatalogProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleFavorite: (id: string) => void;
  cartItems: CartItem[];
  onNavigateToCart: () => void;
  searchTerm: string;
  dailyOffers: DailyOffer[];
  categories?: { name: string; icon: string }[];
}

export default function Catalog({
  products,
  onAddToCart,
  onToggleFavorite,
  cartItems,
  onNavigateToCart,
  searchTerm,
  dailyOffers = [],
  categories = []
}: CatalogProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Tudo');
  const [showRegionsModal, setShowRegionsModal] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState<Record<string, 'UNI' | 'KG'>>({});
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<Record<string, number>>({});
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto transition every 5 seconds
  useEffect(() => {
    if (!dailyOffers || dailyOffers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dailyOffers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [dailyOffers]);

  const handleNextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!dailyOffers || dailyOffers.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % dailyOffers.length);
  };

  const handlePrevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!dailyOffers || dailyOffers.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + dailyOffers.length) % dailyOffers.length);
  };

  // Filter products based on search term and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'Tudo' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products when "Tudo" tab is selected, according to the ordered list of categories
  if (activeCategory === 'Tudo') {
    filteredProducts.sort((a, b) => {
      const indexA = categories.findIndex(c => c.name === a.category);
      const indexB = categories.findIndex(c => c.name === b.category);
      
      const orderA = indexA === -1 ? Infinity : indexA;
      const orderB = indexB === -1 ? Infinity : indexB;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // Secondary sort: alphabetical sorting of product names
      return a.name.localeCompare(b.name, 'pt-BR');
    });
  }

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Predefined categories with emojis/icons representation
  const categoriesList = [
    { name: 'Tudo', icon: '' },
    ...categories
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Promotional Header Banner Carousel */}
      {dailyOffers && dailyOffers.length > 0 && (
        <section className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-md group">
          {dailyOffers.map((offer, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={offer.id || index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isActive ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-105 pointer-events-none'
                }`}
              >
                <img
                  alt={offer.title || "Frescor Direto da Horta"}
                  className="absolute inset-0 w-full h-full object-cover brightness-95"
                  referrerPolicy="no-referrer"
                  src={offer.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#181d18]/75 via-[#181d18]/45 to-transparent flex items-center px-6 md:px-12 text-white">
                  <div className="max-w-md space-y-3">
                    {offer.badge && (
                      <span className="text-xs bg-[#6dbe7b]/30 text-[#a2f6ad] font-bold tracking-wide px-3 py-1 rounded-full uppercase backdrop-blur-sm border border-[#6dbe7b]/20">
                        {offer.badge}
                      </span>
                    )}
                    <h2 
                      className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                      style={{ fontFamily: 'Plus Jakarta Sans' }}
                    >
                      {offer.title}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-200 font-medium">
                      {offer.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carousel Navigation Arrows */}
          {dailyOffers.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer select-none active:scale-95 z-20"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer select-none active:scale-95 z-20"
                aria-label="Próximo slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {dailyOffers.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentSlide ? 'bg-[#6dbe7b] w-5' : 'bg-white/55 hover:bg-white/85'
                    }`}
                    aria-label={`Ir para slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Category Scroll Filter */}
      <section className="overflow-x-auto py-2 -mx-5 px-5 scrollbar-thin">
        <div className="flex gap-3 min-w-max">
          {categoriesList.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm border ${
                activeCategory === cat.name
                  ? 'bg-[#176c33] text-white border-[#176c33] shadow-md'
                  : 'bg-white text-[#40493f] border-[#bfc9bc]/30 hover:bg-[#ebefe7]'
              }`}
            >
              {cat.icon && <span className="text-base">{cat.icon}</span>}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Product Catalog Grid divided by Categories */}
      <div className="space-y-12 pb-24">
        {filteredProducts.length === 0 ? (
          <section className="grid grid-cols-1 pb-16 text-center text-[#707a6e]">
            <div className="py-16">
              <p className="text-lg font-semibold">Nenhum produto encontrado neste filtro.</p>
              <p className="text-sm mt-1">Experimente buscar por outros termos ou categorias.</p>
            </div>
          </section>
        ) : (
          (() => {
            // Get unique category names present in filtered products
            const uniqueCategoriesInFiltered = Array.from(new Set(filteredProducts.map(p => p.category)));
            
            // Sort them based on the parent's categories list order
            uniqueCategoriesInFiltered.sort((a, b) => {
              const idxA = categories.findIndex(c => c.name === a);
              const idxB = categories.findIndex(c => c.name === b);
              const orderA = idxA === -1 ? Infinity : idxA;
              const orderB = idxB === -1 ? Infinity : idxB;
              return orderA - orderB;
            });

            return uniqueCategoriesInFiltered.map((categoryName) => {
              const categoryProducts = filteredProducts.filter(p => p.category === categoryName);
              const categoryInfo = categories.find(c => c.name === categoryName);
              const catIcon = categoryInfo ? categoryInfo.icon : '🥬';

              return (
                <div key={categoryName} className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                  {/* Category Section Header Divider */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-[#f1f5ed] px-4 py-2 rounded-full border border-[#bfc9bc]/30 shadow-xs">
                      {catIcon && <span className="text-base md:text-lg">{catIcon}</span>}
                      <h3 className="font-extrabold text-[#176c33] tracking-tight text-xs md:text-sm uppercase" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                        {categoryName}
                      </h3>
                    </div>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-[#bfc9bc]/30 via-[#bfc9bc]/10 to-transparent"></div>
                  </div>

                  {/* Grid for this specific category */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categoryProducts.map((product) => {
                      const resolvedAllowedUnits = product.allowedUnits || 'BOTH';
                      let currentUnit: 'KG' | 'UNI' | 'INTEIRO' | 'BANDA' | 'QUARTO' = product.saleType;
                      if (resolvedAllowedUnits === 'KG') {
                        currentUnit = 'KG';
                      } else if (resolvedAllowedUnits === 'UNI') {
                        currentUnit = 'UNI';
                      } else if (resolvedAllowedUnits === 'FRAC') {
                        currentUnit = (selectedUnits[product.id] as 'INTEIRO' | 'BANDA' | 'QUARTO') || 'INTEIRO';
                      } else {
                        currentUnit = (selectedUnits[product.id] as 'KG' | 'UNI') || product.saleType;
                      }

                     const isOriginal = currentUnit === product.saleType;
                      let displayPrice = product.price;

                      if (currentUnit === 'KG') {
                        displayPrice = product.price;
                      } else if (currentUnit === 'UNI') {
                        if (product.priceUnit !== undefined && product.priceUnit !== null) {
                          displayPrice = product.priceUnit;
                        } else {
                          displayPrice = product.saleType === 'KG' ? Math.round(product.price * 0.2) : product.price;
                        }
                      } else if (currentUnit === 'INTEIRO') {
                        displayPrice = product.price * (product.weightInteiro ?? 1);
                      } else if (currentUnit === 'BANDA') {
                        displayPrice = product.price * (product.weightBanda ?? 0.5);
                      } else if (currentUnit === 'QUARTO') {
                        displayPrice = product.price * (product.weightQuarto ?? 0.25);
                      }

                      const hasVariants = !!(product.variants && product.variants.length > 0);
                      const currentVariantIndex = selectedVariantIndex[product.id] ?? 0;
                      const currentVariant = hasVariants ? product.variants![currentVariantIndex] : undefined;
                      if (currentVariant) {
                        displayPrice = currentVariant.price;
                      }

                      return (
                        <div
                          key={product.id}
                          className="group bg-white rounded-xl p-4 shadow-sm border border-[#bfc9bc]/10 hover:shadow-md transition-all duration-300 relative flex flex-col justify-between"
                        >
                          <div>
                            {/* Image and Love Toggle */}
                            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-[#f1f5ed] border border-gray-100">
                              <img
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                                src={product.imageUrl}
                              />

                              {/* Favorite button */}
                              <button
                                onClick={() => onToggleFavorite(product.id)}
                                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#99405c] hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer border border-[#bfc9bc]/20"
                                aria-label="Favoritar"
                              >
                                <Heart
                                  className={`w-[18px] h-[18px] ${product.isFavorite ? 'fill-[#99405c]' : ''}`}
                                />
                              </button>
                            </div>

                            {/* Product Meta */}
                            <span className="text-[10px] font-bold tracking-wider uppercase text-[#707a6e]">
                              {product.category}
                            </span>
                            <h3 
                              className="font-bold text-[#181d18] text-sm md:text-base mt-0.5 line-clamp-2 leading-snug min-h-[2.5em]"
                              style={{ fontFamily: 'Plus Jakarta Sans' }}
                            >
                              {product.name}
                            </h3>
                            
                            {product.description && (
                              <p className="text-xs text-[#707a6e] line-clamp-2 mt-1 mb-3">
                                {product.description}
                              </p>
                            )}
                            
                            {/* Sale Type Pills */}
                            <div className="flex gap-1.5 mb-4">
                              {resolvedAllowedUnits === 'BOTH' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'UNI' }))}
                                    className={`flex-1 text-center py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wide border transition-all cursor-pointer ${
                                      currentUnit === 'UNI'
                                        ? 'bg-[#176c33] text-white border-[#176c33] font-extrabold shadow-sm'
                                        : 'bg-white text-[#707a6e] border-[#bfc9bc]/30 hover:bg-[#f1f5ed]'
                                    }`}
                                  >
                                    Unidade
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'KG' }))}
                                    className={`flex-1 text-center py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wide border transition-all cursor-pointer ${
                                      currentUnit === 'KG'
                                        ? 'bg-[#176c33] text-white border-[#176c33] font-extrabold shadow-sm'
                                        : 'bg-white text-[#707a6e] border-[#bfc9bc]/30 hover:bg-[#f1f5ed]'
                                    }`}
                                  >
                                    Quilo
                                  </button>
                                </>
                              ) : resolvedAllowedUnits === 'FRAC' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'INTEIRO' }))}
                                    className={`flex-1 text-center py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wide border transition-all cursor-pointer ${
                                      currentUnit === 'INTEIRO'
                                        ? 'bg-[#176c33] text-white border-[#176c33] font-extrabold shadow-sm'
                                        : 'bg-white text-[#707a6e] border-[#bfc9bc]/30 hover:bg-[#f1f5ed]'
                                    }`}
                                  >
                                    Inteiro
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'BANDA' }))}
                                    className={`flex-1 text-center py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wide border transition-all cursor-pointer ${
                                      currentUnit === 'BANDA'
                                        ? 'bg-[#176c33] text-white border-[#176c33] font-extrabold shadow-sm'
                                        : 'bg-white text-[#707a6e] border-[#bfc9bc]/30 hover:bg-[#f1f5ed]'
                                    }`}
                                  >
                                    Banda
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'QUARTO' }))}
                                    className={`flex-1 text-center py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wide border transition-all cursor-pointer ${
                                      currentUnit === 'QUARTO'
                                        ? 'bg-[#176c33] text-white border-[#176c33] font-extrabold shadow-sm'
                                        : 'bg-white text-[#707a6e] border-[#bfc9bc]/30 hover:bg-[#f1f5ed]'
                                    }`}
                                  >
                                    1/4
                                  </button>
                                </>
                              ) : (
                                <div className="flex-1 text-center py-1.5 rounded-full text-[10px] uppercase font-extrabold tracking-wide border bg-[#176c33]/15 text-[#176c33] border-[#176c33]/30 select-none">
                                  Venda: {resolvedAllowedUnits === 'KG' ? 'Apenas por Quilo' : 'Apenas por Unidade'}
                                </div>
                             )}
                            </div>

                            {/* Variant Selector (e.g. same product in 500g / 1kg) */}
                            {hasVariants && (
                              <div className="flex flex-nowrap gap-1.5 mb-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {product.variants!.map((variant, vIndex) => (
                                  <button
                                    key={variant.label + vIndex}
                                    type="button"
                                    onClick={() => setSelectedVariantIndex(prev => ({ ...prev, [product.id]: vIndex }))}
                                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wide border transition-all cursor-pointer ${
                                      currentVariantIndex === vIndex
                                        ? 'bg-[#176c33] text-white border-[#176c33] font-extrabold shadow-sm'
                                        : 'bg-white text-[#707a6e] border-[#bfc9bc]/30 hover:bg-[#f1f5ed]'
                                    }`}
                                  >
                                    {variant.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Price and Add button */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-[#707a6e] font-semibold leading-none flex items-center gap-0.5 mb-0.5">
                                Preço {!isOriginal && product.priceUnit === undefined && <span className="text-[#a5521b] text-[8px] font-bold">(Est.)</span>}
                              </span>
                              <span className="text-[#176c33] font-extrabold text-base md:text-lg whitespace-nowrap">
                                <span className="mr-0.5">R$</span>{displayPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span className="text-[10px] font-normal text-[#707a6e] ml-0.5">
                                  {currentVariant ? `/ ${currentVariant.label}` : `/${currentUnit === 'QUARTO' ? '1/4' : currentUnit.toLowerCase()}`}
                                </span>
                              </span>
                            </div>

                            <button
                              onClick={() => onAddToCart({
                                ...product,
                                saleType: currentUnit,
                                price: displayPrice,
                                variantLabel: currentVariant?.label
                              })}
                              className="w-8 h-8 rounded-full bg-[#176c33] hover:bg-[#115326] text-white flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm cursor-pointer shrink-0"
                              aria-label="Adicionar ao carrinho"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>

      {/* Floating Bottom Navigator for Shopping Cart */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-30">
          <nav
            onClick={onNavigateToCart}
            className="rounded-full bg-[#176c33] hover:bg-[#115326] active:scale-[0.98] cursor-pointer shadow-xl shadow-[#176c33]/30 transition-all duration-300 flex justify-between items-center px-6 py-4 border border-[#white]/10"
          >
            <div className="flex items-center gap-3 text-white">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-[#99405c] rounded-full text-[10px] text-white flex items-center justify-center font-bold px-1 ring-2 ring-[#176c33]">
                  {cartItemCount}
                </span>
              </div>
              <span className="font-bold text-sm md:text-base" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Ver Carrinho
              </span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <span className="text-xs font-medium bg-white/15 px-3 py-1 rounded-full">
                Total: R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </nav>
        </div>
      )}

      {/* Regions Modal */}
      {showRegionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRegionsModal(false)}></div>
          <div className="relative bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#176c33] flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              <Truck className="w-5 h-5" /> Regiões Atendidas
            </h3>
            <p className="text-sm text-[#40493f]">
              Atendemos de forma expressa (entrega com motoboy até 2h) todos os bairros da grande fortaleza e regiões próximas, incluindo:
            </p>
            <ul className="text-xs text-[#181d18] grid grid-cols-2 gap-2 list-disc list-inside">
              <li>Meireles</li>
              <li>Aldeota</li>
              <li>Cocó</li>
              <li>Guararapes</li>
              <li>Parquelândia</li>
              <li>Fátima</li>
              <li>Dionísio Torres</li>
              <li>Papicu</li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => setShowRegionsModal(false)}
                className="w-full bg-[#176c33] text-white font-bold text-sm py-3 rounded-full hover:bg-[#115326] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
