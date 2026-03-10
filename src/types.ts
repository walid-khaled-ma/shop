import { Type } from "@google/genai";

export type UserRole = 'admin' | 'manager' | 'cashier';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  barcode: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  lowStockAlert: number;
  image?: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  productCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string;
  cashier?: string;
  total: number;
  currency?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'credit';
  customerName?: string;
}

export interface Purchase {
  id: string;
  date: string;
  supplier: string;
  total: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    purchasePrice: number;
  }[];
}

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  exchangeRate: number; // Rate relative to the default currency
  isDefault: boolean;
}
