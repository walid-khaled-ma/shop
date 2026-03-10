import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Scan, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  ChevronRight,
  ShoppingCart,
  X,
  User,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Product, CartItem, Customer } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Receipt } from '../components/Receipt';

export const POS = () => {
  const { products, categories, addSale, customers } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isTaxEnabled, setIsTaxEnabled] = useState(false);
  const [taxRate] = useState(0.15); // 15% VAT
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.barcode.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');

  const subtotal = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
  const taxAmount = isTaxEnabled ? subtotal * taxRate : 0;
  const total = subtotal + taxAmount - discount;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'credit' && !selectedCustomer) {
      alert('يرجى اختيار عميل لعملية البيع الآجل');
      return;
    }
    
    setIsCheckingOut(true);
    
    // Create sale object with sequential ID
    const nextId = (useData().sales.length + 1).toString();
    const saleData = {
      id: nextId,
      date: new Date().toISOString(),
      items: cart,
      subtotal,
      tax: taxAmount,
      discount,
      total,
      paymentMethod,
      customerName: selectedCustomer?.name
    };

    // Simulate API call
    setTimeout(() => {
      addSale(saleData);
      setShowReceipt(true);
      setIsCheckingOut(false);
    }, 1000);
  };

  const resetCart = () => {
    setCart([]);
    setDiscount(0);
    setSelectedCustomer(null);
    setPaymentMethod('cash');
    setShowReceipt(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 overflow-hidden" dir="rtl">
      {/* Products Section */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Search and Scanner */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن منتج بالاسم أو الباركود..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => alert('جاري تشغيل ماسح الباركود...')}
            className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Scan size={24} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory('الكل')}
            className={`px-6 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'الكل' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 shadow-sm'
            }`}
          >
            الكل
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.name 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 shadow-sm'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <motion.div 
                layout
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 cursor-pointer transition-all group"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-slate-50 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  {product.stock <= product.lowStockAlert && (
                    <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">مخزون منخفض</div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-1 truncate">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 font-bold">{product.salePrice} ر.س</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 font-mono">{product.code}</span>
                    <span className="text-[10px] text-slate-300">المخزون: {product.stock}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-emerald-600" size={20} />
            <h2 className="font-bold text-slate-800">سلة التسوق</h2>
          </div>
          <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full">{cart.length} أصناف</span>
        </div>

        {/* Customer Selection */}
        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 relative">
          <div 
            onClick={() => setShowCustomerList(!showCustomerList)}
            className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                <User size={18} />
              </div>
              <span className={`text-sm font-medium ${selectedCustomer ? 'text-slate-800' : 'text-slate-400'}`}>
                {selectedCustomer ? selectedCustomer.name : 'اختر العميل (اختياري)'}
              </span>
            </div>
            {selectedCustomer && <CheckCircle2 size={18} className="text-emerald-500" />}
          </div>

          <AnimatePresence>
            {showCustomerList && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-4 right-4 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto"
              >
                <div className="p-2">
                  <div className="relative mb-2">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="ابحث عن عميل..." 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pr-9 pl-3 text-xs outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {customers.map(customer => (
                    <div 
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowCustomerList(false);
                      }}
                      className="p-3 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors flex flex-col"
                    >
                      <span className="text-sm font-bold text-slate-800">{customer.name}</span>
                      <span className="text-[10px] text-slate-400">{customer.phone}</span>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      setSelectedCustomer(null);
                      setShowCustomerList(false);
                    }}
                    className="w-full p-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl mt-1 font-bold"
                  >
                    إلغاه الاختيار
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {cart.map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 group"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-emerald-600 font-medium">{item.salePrice} ر.س</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-emerald-600"><Minus size={14} /></button>
                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-emerald-600"><Plus size={14} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
              <ShoppingCart size={48} className="mb-2 opacity-20" />
              <p>السلة فارغة</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
          <div className="flex justify-between text-sm text-slate-500">
            <span>المجموع الفرعي</span>
            <span>{subtotal.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500 items-center">
            <div className="flex items-center gap-2">
              <span>الضريبة (15%)</span>
              <button 
                onClick={() => setIsTaxEnabled(!isTaxEnabled)}
                className={`w-8 h-4 rounded-full transition-all relative ${isTaxEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isTaxEnabled ? 'right-4.5' : 'right-0.5'}`} />
              </button>
            </div>
            <span>{taxAmount.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>الخصم</span>
            <input 
              type="number" 
              className="w-20 bg-white border border-slate-200 rounded px-2 text-left text-rose-600 font-medium outline-none"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-lg font-bold text-slate-800">الإجمالي</span>
            <span className="text-2xl font-black text-emerald-600">{total.toFixed(2)} ر.س</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center justify-center gap-2 border py-3 rounded-2xl font-bold transition-all ${
                paymentMethod === 'cash' 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Banknote size={20} />
              نقدي
            </button>
            <button 
              onClick={() => setPaymentMethod('credit')}
              className={`flex items-center justify-center gap-2 border py-3 rounded-2xl font-bold transition-all ${
                paymentMethod === 'credit' 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CreditCard size={20} />
              آجل
            </button>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:shadow-none mt-2 flex items-center justify-center gap-2"
          >
            {isCheckingOut ? 'جاري المعالجة...' : 'إتمام الدفع'}
            {!isCheckingOut && <ChevronRight size={20} />}
          </button>
        </div>
      </div>

      {/* Print Preview Modal */}
      <AnimatePresence>
        {showReceipt && (
          <Receipt 
            cart={cart}
            subtotal={subtotal}
            taxAmount={taxAmount}
            discount={discount}
            total={total}
            paymentMethod={paymentMethod}
            customer={selectedCustomer}
            onClose={resetCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
