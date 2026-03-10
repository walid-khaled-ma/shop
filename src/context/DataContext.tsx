import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Category, Supplier, Sale, User, Customer, Currency } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SUPPLIERS, MOCK_SALES, MOCK_USERS, MOCK_CUSTOMERS, MOCK_CURRENCIES } from '../mockData';

interface DataContextType {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  sales: Sale[];
  users: User[];
  customers: Customer[];
  currencies: Currency[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  addSale: (sale: Sale) => void;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addCurrency: (currency: Currency) => void;
  updateCurrency: (currency: Currency) => void;
  deleteCurrency: (id: string) => void;
  setDefaultCurrency: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [currencies, setCurrencies] = useState<Currency[]>(MOCK_CURRENCIES);

  const addProduct = (product: Product) => {
    const categoryObj = categories.find(c => c.name === product.category);
    const catCode = categoryObj ? categoryObj.code : 'C00';
    const productsInCat = products.filter(p => p.category === product.category);
    const nextSeq = productsInCat.length + 1;
    const productCode = `${catCode}-${nextSeq.toString().padStart(6, '0')}`;
    setProducts([{ ...product, code: productCode }, ...products]);
  };
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const addCategory = (category: Category) => {
    const nextSeq = categories.length + 1;
    const catCode = `C${nextSeq.toString().padStart(2, '0')}`;
    setCategories([...categories, { ...category, code: catCode }]);
  };
  const deleteCategory = (id: string) => setCategories(categories.filter(c => c.id !== id));

  const addSupplier = (supplier: Supplier) => setSuppliers([...suppliers, supplier]);
  const deleteSupplier = (id: string) => setSuppliers(suppliers.filter(s => s.id !== id));

  const addSale = (sale: Sale) => {
    setSales([sale, ...sales]);
    
    // Update product stock
    setProducts(prevProducts => prevProducts.map(product => {
      const cartItem = sale.items.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    }));

    // Update customer balance if it's a credit sale
    if (sale.paymentMethod === 'credit' && sale.customerName) {
      setCustomers(prevCustomers => prevCustomers.map(customer => {
        if (customer.name === sale.customerName) {
          return { ...customer, balance: customer.balance + sale.total };
        }
        return customer;
      }));
    }
  };

  const addUser = (user: User) => setUsers([...users, user]);
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const addCustomer = (customer: Customer) => setCustomers([...customers, customer]);
  const deleteCustomer = (id: string) => setCustomers(customers.filter(c => c.id !== id));

  const addCurrency = (currency: Currency) => setCurrencies([...currencies, currency]);
  const updateCurrency = (currency: Currency) => {
    setCurrencies(prev => prev.map(c => c.id === currency.id ? currency : c));
  };
  const deleteCurrency = (id: string) => setCurrencies(prev => prev.filter(c => c.id !== id));
  const setDefaultCurrency = (id: string) => {
    setCurrencies(prev => prev.map(c => ({
      ...c,
      isDefault: c.id === id,
      exchangeRate: c.id === id ? 1 : c.exchangeRate
    })));
  };

  return (
    <DataContext.Provider value={{
      products,
      categories,
      suppliers,
      sales,
      users,
      customers,
      currencies,
      addProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      addSupplier,
      deleteSupplier,
      addSale,
      addUser,
      deleteUser,
      addCustomer,
      deleteCustomer,
      addCurrency,
      updateCurrency,
      deleteCurrency,
      setDefaultCurrency
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
