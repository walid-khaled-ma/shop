import { Product, Category, Supplier, Sale, User, Customer, Currency } from "./types";

export const MOCK_USERS: User[] = [
  { id: "1", name: "أدمن النظام", username: "admin", role: "admin", avatar: "https://i.pravatar.cc/150?u=admin" },
  { id: "2", name: "مدير الفرع", username: "manager", role: "manager", avatar: "https://i.pravatar.cc/150?u=manager" },
  { id: "3", name: "كاشير 1", username: "cashier", role: "cashier", avatar: "https://i.pravatar.cc/150?u=cashier" },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "أحمد علي", phone: "0501234567", email: "ahmed@example.com", address: "الرياض، حي الملز", balance: 150.50 },
  { id: "2", name: "سارة خالد", phone: "0559876543", email: "sara@example.com", address: "جدة، حي الروضة", balance: 0.00 },
  { id: "3", name: "محمد العتيبي", phone: "0561122334", email: "mohammed@example.com", address: "الدمام، حي الفيصلية", balance: 420.00 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    code: "C01-000001",
    name: "قهوة اسبريسو",
    barcode: "123456789",
    category: "مشروبات",
    purchasePrice: 50,
    salePrice: 85,
    stock: 45,
    lowStockAlert: 10,
    image: "https://picsum.photos/seed/coffee/200/200",
  },
  {
    id: "2",
    code: "C01-000002",
    name: "كابتشينو",
    barcode: "987654321",
    category: "مشروبات",
    purchasePrice: 60,
    salePrice: 95,
    stock: 5,
    lowStockAlert: 10,
    image: "https://picsum.photos/seed/cappuccino/200/200",
  },
  {
    id: "3",
    code: "C02-000001",
    name: "كرواسون سادة",
    barcode: "456123789",
    category: "مخبوزات",
    purchasePrice: 20,
    salePrice: 35,
    stock: 20,
    lowStockAlert: 5,
    image: "https://picsum.photos/seed/croissant/200/200",
  },
  {
    id: "4",
    code: "C03-000001",
    name: "كيك شوكولاتة",
    barcode: "789456123",
    category: "حلويات",
    purchasePrice: 40,
    salePrice: 70,
    stock: 12,
    lowStockAlert: 5,
    image: "https://picsum.photos/seed/cake/200/200",
  },
  {
    id: "5",
    code: "C01-000003",
    name: "عصير برتقال طازج",
    barcode: "321654987",
    category: "مشروبات",
    purchasePrice: 15,
    salePrice: 30,
    stock: 30,
    lowStockAlert: 10,
    image: "https://picsum.photos/seed/orange/200/200",
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "1", code: "C01", name: "مشروبات", productCount: 15 },
  { id: "2", code: "C02", name: "مخبوزات", productCount: 8 },
  { id: "3", code: "C03", name: "حلويات", productCount: 12 },
  { id: "4", code: "C04", name: "سندوتشات", productCount: 6 },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: "1", name: "شركة النيل للمواد الغذائية", phone: "0123456789", email: "nile@example.com", address: "القاهرة، مصر" },
  { id: "2", name: "مخبز المدينة المنورة", phone: "0987654321", email: "madina@example.com", address: "الرياض، السعودية" },
];

export const MOCK_SALES: Sale[] = [];

export const MOCK_CURRENCIES: Currency[] = [
  { id: "1", name: "ريال يمني", symbol: "ر.ي", exchangeRate: 1, isDefault: true },
  { id: "2", name: "ريال سعودي", symbol: "ر.س", exchangeRate: 425, isDefault: false },
  { id: "3", name: "دولار أمريكي", symbol: "$", exchangeRate: 1600, isDefault: false },
];
