/**
 * Types representing the products, cart, and app state of Sacolão.
 */

export type CategoryType = string;

export interface Product {
  id: string; // e.g. "HT-001"
  name: string;
  category: CategoryType;
  saleType: 'KG' | 'UNI' | 'INTEIRO' | 'BANDA' | 'QUARTO';
  allowedUnits?: 'KG' | 'UNI' | 'BOTH' | 'FRAC';
  price: number; // Price per unit or per KG in R$
  priceUnit?: number; // Distinct Price per unit if sale format is BOTH/mixed
  description: string;
  imageUrl: string;
  stock?: number; // stock count
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

