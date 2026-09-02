import React, { useState } from 'react';
import { Heart, ArrowLeft, Plus } from 'lucide-react';
import { Product } from '../types';

interface FavoritesProps {
  products: Product[];
  onToggleFavorite: (id: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onNavigateToCatalog: () => void;
}

export default function Favorites({
  products,
  onToggleFavorite,
  onAddToCart,
  onNavigateToCatalog
}: FavoritesProps) {
  const [selectedUnits, setSelectedUnits] = useState<Record<string, 'UNI' | 'KG'>>({});
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<Record<string, number>>({});

  const favoriteProducts = products.filter((p) => p.isFavorite && p.isActive !== false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Title block */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateToCatalog}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors text-[#176c33] shrink-0 active:scale-95 cursor-pointer"
          aria-label="Voltar para catálogo"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Lista de Compras
          </h2>
          <p className="text-xs text-[#707a6e]">
            Seus itens favoritos guardados para acesso rápido e compras fáceis.
          </p>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-[#bfc9bc]/15 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-[#99405c]">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#181d18] text-base md:text-lg" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Sua lista de compras está vazia
            </h3>
            <p className="text-xs text-[#707a6e] max-w-sm mx-auto">
              Explore nosso hortifrúti fresco e toque no coraçãozinho de qualquer produto para adicioná-lo aqui.
            </p>
          </div>
          <button
            onClick={onNavigateToCatalog}
            className="h-11 px-6 rounded-full bg-[#176c33] text-white text-xs font-bold shadow-md hover:bg-[#115326] transition-all cursor-pointer active:scale-95"
          >
            Voltar para o Hortifrúti
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-start">
          {favoriteProducts.map((product) => {
            const resolvedAllowedUnits = product.allowedUnits || 'BOTH';
            let currentUnit: 'KG' | 'UNI' | 'INTEIRO' | 'BANDA' | 'QUARTO' = product.saleType;
            if (resolvedAllowedUnits === 'KG') {
              currentUnit = 'KG';
            } else if (resolvedAllowedUnits === 'UNI') {
              currentUnit = 'UNI';
            } else {
              currentUnit = (selectedUnits[product.id] as 'KG' | 'UNI') || product.saleType;
            }

            let displayPrice = product.price;
            if (currentUnit === 'KG') {
              displayPrice = product.price;
            } else if (currentUnit === 'UNI') {
              if (product.priceUnit !== undefined && product.priceUnit !== null) {
                displayPrice = product.priceUnit;
              } else {
                displayPrice = product.saleType === 'KG' ? Math.round(product.price * 0.2) : product.price;
              }
            }

            const hasVariants = !!(product.variants && product.variants.length > 0);
            const currentVariantIndex = selectedVariantIndex[product.id] ?? 0;
            const currentVariant = hasVariants ? product.variants![currentVariantIndex] : undefined;
            if (currentVariant) {
              displayPrice = currentVariant.price;
            }

            const rawSuffix = currentVariant
              ? currentVariant.label
              : currentUnit === 'QUARTO' ? '1/4'
              : currentUnit === 'INTEIRO' ? 'inteiro'
              : currentUnit === 'BANDA' ? 'banda'
              : currentUnit.toLowerCase();
            const priceSuffix = (displayPrice >= 100 || rawSuffix.length > 4)
              ? rawSuffix.slice(0, 3)
              : rawSuffix;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl p-4 shadow-sm border border-[#bfc9bc]/10 hover:shadow-md transition-all duration-300 relative flex flex-col"
              >
                {/* Image and Remove Toggle */}
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-[#f1f5ed] border border-gray-100">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    src={product.imageUrl}
                  />
                  <button
                    onClick={() => onToggleFavorite(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#99405c] shadow-sm hover:bg-white transition-all cursor-pointer"
                    title="Remover dos Favoritos"
                    aria-label="Remover dos Favoritos"
                  >
                    <Heart className="w-[18px] h-[18px] fill-[#99405c]" />
                  </button>
                </div>

                <div>
                  <span className="text-[9px] font-bold tracking-wider uppercase text-[#707a6e]">
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
                    ) : null}
                  </div>

                  {/* Variant Selector (e.g. same product in 500g / 1kg, or Inteiro/Banda/1/4) */}
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
                <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] text-[#707a6e] font-semibold leading-none mb-0.5">
                      Preço
                    </span>
                    <span className="text-[#176c33] font-extrabold text-sm md:text-base whitespace-nowrap">
                      <span className="mr-0.5">R$</span>{displayPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-[10px] font-normal text-[#707a6e] ml-0.5">
                        /{priceSuffix}
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
                    className="w-7 h-7 rounded-full bg-[#176c33] hover:bg-[#115326] text-white flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm cursor-pointer shrink-0"
                    aria-label="Adicionar ao carrinho"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
