/**
 * Types representing the products, cart, and app state of Sacolão.
 */

export type CategoryType = string;

export interface ProductVariant {
  label: string; // e.g. "500g", "1kg", "Caixa com 6"
  price: number;
}

export interface Product {
  id: string; // e.g. "HT-001"
  name: string;
  category: CategoryType;
  saleType: 'KG' | 'UNI' | 'INTEIRO' | 'BANDA' | 'QUARTO';
  allowedUnits?: 'KG' | 'UNI' | 'BOTH' | 'FRAC';
  price: number; // Price per unit or per KG in R$
  priceUnit?: number; // Distinct Price per unit if sale format is BOTH/mixed
  weightInteiro?: number; // Peso estimado (kg) do produto Inteiro, usado quando allowedUnits = FRAC
  weightBanda?: number; // Peso estimado (kg) da Banda (metade)
  weightQuarto?: number; // Peso estimado (kg) do Quarto (1/4)
  variants?: ProductVariant[]; // Opções de venda do mesmo produto (ex: 500g e 1kg), cada uma com seu próprio preço
  variantLabel?: string; // Preenchido apenas no carrinho, identifica qual variação foi escolhida
  description: string;
  imageUrl: string;
  stock?: number; // stock count
  isActive?: boolean; // false = produto esgotado/desativado, some do catálogo pro cliente comprar
  isFavorite?: boolean;
  isOwnProduction?: boolean; // True if self-produced in-house product
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  address: string;
  neighborhood?: string;
  paymentMethod?: string;
  cashChange?: string;
}

export type ViewType = 'catalog' | 'cart' | 'dashboard' | 'form' | 'favorites';
export type FormMode = 'create' | 'edit';

export interface DailyOffer {
  id?: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface FooterInfo {
  aboutText: string;
  badgeText: string;
  weekdayHours: string;
  sundayHours: string;
  holidayNote: string;
  address: string;
  email: string;
  cnpj: string;
  copyrightText: string;
}

