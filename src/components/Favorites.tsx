import React, { useState } from 'react';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Plus } from 'lucide-react';
import { Product, CartItem } from '../types';

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
  const [selectedUnits, setSelectedUnits] = useState<Record<string, 'UNI' | 'KG' | 'INTEIRO' | 'BANDA' | 'QUARTO'>>({});

  const favoriteProducts = products.filter((p) => p.isFavorite && p.isActive !== false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteProducts.map((product) => {
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
              displayPrice = product.price;
            } else if (currentUnit === 'BANDA') {
              displayPrice = product.price * 0.5;
            } else if (currentUnit === 'QUARTO') {
              displayPrice = product.price * 0.25;
            }

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-[#bfc9bc]/10 hover:shadow-md transition-all duration-200 flex gap-4 relative justify-between items-center"
              >
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-[#f1f5ed] border border-gray-100 shrink-0">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      src={product.imageUrl}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-[#707a6e]">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-[#181d18] text-sm md:text-base truncate leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-[#176c33] font-bold text-sm">
                      R$ {displayPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-[10px] font-normal text-[#707a6e] ml-0.5">
                        /{currentUnit === 'QUARTO' ? '1/4' : currentUnit.toLowerCase()}
                      </span>
                    </p>

                    {/* Unit Switcher */}
                    {resolvedAllowedUnits === 'BOTH' ? (
                      <div className="flex gap-1 pt-1 max-w-[140px]">
                        <button
                          onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'UNI' }))}
                          className={`flex-1 text-center py-0.5 rounded text-[8px] uppercase tracking-wider font-bold border transition-all ${
                            currentUnit === 'UNI'
                              ? 'bg-[#176c33] text-white border-[#176c33]'
                              : 'bg-white text-[#707a6e] border-[#bfc9bc]/30'
                          }`}
                        >
                          Unidade
                        </button>
                        <button
                          onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'KG' }))}
                          className={`flex-1 text-center py-0.5 rounded text-[8px] uppercase tracking-wider font-bold border transition-all ${
                            currentUnit === 'KG'
                              ? 'bg-[#176c33] text-white border-[#176c33]'
                              : 'bg-white text-[#707a6e] border-[#bfc9bc]/30'
                          }`}
                        >
                          Quilo
                        </button>
                      </div>
                    ) : resolvedAllowedUnits === 'FRAC' ? (
                      <div className="flex gap-1 pt-1 max-w-[210px]">
                        <button
                          onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'INTEIRO' }))}
                          className={`flex-1 text-center py-0.5 px-1.5 rounded text-[8px] uppercase tracking-wider font-bold border transition-all ${
                            currentUnit === 'INTEIRO'
                              ? 'bg-[#176c33] text-white border-[#176c33]'
                              : 'bg-white text-[#707a6e] border-[#bfc9bc]/30'
                          }`}
                        >
                          Inteiro
                        </button>
                        <button
                          onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'BANDA' }))}
                          className={`flex-1 text-center py-0.5 px-1.5 rounded text-[8px] uppercase tracking-wider font-bold border transition-all ${
                            currentUnit === 'BANDA'
                              ? 'bg-[#176c33] text-white border-[#176c33]'
                              : 'bg-white text-[#707a6e] border-[#bfc9bc]/30'
                          }`}
                        >
                          Banda
                        </button>
                        <button
                          onClick={() => setSelectedUnits(prev => ({ ...prev, [product.id]: 'QUARTO' }))}
                          className={`flex-1 text-center py-0.5 px-1.5 rounded text-[8px] uppercase tracking-wider font-bold border transition-all ${
                            currentUnit === 'QUARTO'
                              ? 'bg-[#176c33] text-white border-[#176c33]'
                              : 'bg-white text-[#707a6e] border-[#bfc9bc]/30'
                          }`}
                        >
                          1/4
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 items-end shrink-0">
                  <button
                    onClick={() => onToggleFavorite(product.id)}
                    className="p-1.5 rounded-full hover:bg-red-50 text-[#99405c] transition-colors cursor-pointer"
                    title="Remover dos Favoritos"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onAddToCart({
                      ...product,
                      saleType: currentUnit,
                      price: displayPrice
                    })}
                    className="h-9 px-3.5 rounded-full bg-[#176c33] hover:bg-[#115326] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
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
