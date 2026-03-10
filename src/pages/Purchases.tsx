import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Truck, 
  Calendar, 
  ArrowRight,
  FileText,
  X,
  Trash2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';

export const Purchases = () => {
  const { suppliers, products } = useData();
  const [purchases, setPurchases] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceCounter, setInvoiceCounter] = useState(1);

  const [newPurchase, setNewPurchase] = useState({
    supplier: suppliers[0]?.name || '',
    total: 0,
    itemsCount: 1
  });

  const [newInvoice, setNewInvoice] = useState({
    supplier: suppliers[0]?.name || '',
    invoiceNumber: '1',
    date: new Date().toISOString().split('T')[0],
    items: [{ name: '', quantity: 1, price: 0 }],
    isTaxEnabled: false
  });

  const openInvoiceModal = () => {
    setNewInvoice({
      ...newInvoice,
      invoiceNumber: (purchases.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
      items: [{ name: '', quantity: 1, price: 0 }],
      isTaxEnabled: false
    });
    setIsInvoiceModalOpen(true);
  };

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const purchase = {
      ...newPurchase,
      id: (purchases.length + 1).toString(),
      date: new Date().toLocaleString('ar-EG'),
      status: 'مكتمل'
    };
    setPurchases([purchase, ...purchases]);
    setIsModalOpen(false);
  };

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = newInvoice.isTaxEnabled ? subtotal * 0.15 : 0;
    const total = subtotal + tax;
    const purchase = {
      id: newInvoice.invoiceNumber || `INV-${Math.floor(Math.random() * 1000)}`,
      date: newInvoice.date,
      supplier: newInvoice.supplier,
      itemsCount: newInvoice.items.length,
      total: total,
      status: 'مكتمل'
    };
    setPurchases([purchase, ...purchases]);
    setInvoiceCounter(prev => prev + 1);
    setIsInvoiceModalOpen(false);
    alert('تم حفظ فاتورة الشراء بنجاح');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المشتريات</h1>
          <p className="text-slate-500">تسجيل ومتابعة طلبات الشراء من الموردين</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={openInvoiceModal}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <FileText size={18} className="text-emerald-600" />
            فاتورة شراء جديدة
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
          >
            <Plus size={18} />
            طلب شراء جديد
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ابحث برقم الطلب أو اسم المورد..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-12 pl-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">رقم الطلب</th>
                <th className="px-6 py-4 font-semibold">التاريخ</th>
                <th className="px-6 py-4 font-semibold">المورد</th>
                <th className="px-6 py-4 font-semibold">عدد الأصناف</th>
                <th className="px-6 py-4 font-semibold">الإجمالي</th>
                <th className="px-6 py-4 font-semibold">الحالة</th>
                <th className="px-6 py-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {purchases.map(purchase => (
                  <motion.tr 
                    layout
                    key={purchase.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{purchase.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{purchase.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{purchase.supplier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{purchase.itemsCount} أصناف</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{purchase.total} ج.م</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">{purchase.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => alert(`عرض تفاصيل الطلب ${purchase.id}`)} className="text-emerald-600 text-sm font-medium hover:underline">عرض التفاصيل</button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">طلب شراء جديد</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddPurchase} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">المورد</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newPurchase.supplier}
                    onChange={(e) => setNewPurchase({...newPurchase, supplier: e.target.value})}
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">عدد الأصناف</label>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newPurchase.itemsCount}
                    onChange={(e) => setNewPurchase({...newPurchase, itemsCount: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">الإجمالي التقديري</label>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newPurchase.total}
                    onChange={(e) => setNewPurchase({...newPurchase, total: Number(e.target.value)})}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit"
                    className="bg-emerald-600 text-white px-8 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                  >
                    حفظ الطلب
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Purchase Invoice Modal */}
      <AnimatePresence>
        {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInvoiceModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">فاتورة شراء جديدة</h2>
                <button onClick={() => setIsInvoiceModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddInvoice} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">المورد</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={newInvoice.supplier}
                      onChange={(e) => setNewInvoice({...newInvoice, supplier: e.target.value})}
                    >
                      {suppliers.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">رقم الفاتورة (تلقائي)</label>
                    <input 
                      readOnly
                      type="text" 
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 outline-none text-slate-500 cursor-not-allowed"
                      value={newInvoice.invoiceNumber}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">التاريخ</label>
                    <input 
                      required
                      type="date" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={newInvoice.date}
                      onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="text-lg font-bold text-slate-800">أصناف الفاتورة</h3>
                    <button 
                      type="button"
                      onClick={() => setNewInvoice({...newInvoice, items: [...newInvoice.items, { name: '', quantity: 1, price: 0 }]})}
                      className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
                    >
                      <Plus size={16} />
                      إضافة صنف جديد
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto px-2 pb-4 scrollbar-hide">
                    <datalist id="products-list">
                      {products.map(p => (
                        <option key={p.id} value={p.name} />
                      ))}
                    </datalist>
                    {newInvoice.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 items-end bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <div className="col-span-6 space-y-2">
                          <label className="text-xs font-bold text-slate-500 mr-1">ابحث عن الصنف أو ادخل اسمه</label>
                          <input 
                            required
                            list="products-list"
                            type="text" 
                            placeholder="اكتب اسم المنتج..."
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...newInvoice.items];
                              const name = e.target.value;
                              newItems[index].name = name;
                              
                              // Auto-fill price if product exists
                              const product = products.find(p => p.name === name);
                              if (product) {
                                newItems[index].price = product.purchasePrice;
                              }
                              
                              setNewInvoice({...newInvoice, items: newItems});
                            }}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-500 mr-1">الكمية</label>
                          <input 
                            required
                            type="number" 
                            min="1"
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...newInvoice.items];
                              newItems[index].quantity = Number(e.target.value);
                              setNewInvoice({...newInvoice, items: newItems});
                            }}
                          />
                        </div>
                        <div className="col-span-3 space-y-2">
                          <label className="text-xs font-bold text-slate-500 mr-1">سعر الوحدة</label>
                          <div className="relative">
                            <input 
                              required
                              type="number" 
                              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                              value={item.price}
                              onChange={(e) => {
                                const newItems = [...newInvoice.items];
                                newItems[index].price = Number(e.target.value);
                                setNewInvoice({...newInvoice, items: newItems});
                              }}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">ج.م</span>
                          </div>
                        </div>
                        <div className="col-span-1 pb-1">
                          <button 
                            type="button"
                            onClick={() => {
                              if (newInvoice.items.length > 1) {
                                const newItems = newInvoice.items.filter((_, i) => i !== index);
                                setNewInvoice({...newInvoice, items: newItems});
                              }
                            }}
                            className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-600">تفعيل الضريبة (15%)</span>
                      <button 
                        type="button"
                        onClick={() => setNewInvoice({...newInvoice, isTaxEnabled: !newInvoice.isTaxEnabled})}
                        className={`w-10 h-5 rounded-full transition-all relative ${newInvoice.isTaxEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${newInvoice.isTaxEnabled ? 'right-6' : 'right-1'}`} />
                      </button>
                    </div>
                    <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                      <span className="text-emerald-700 font-bold ml-2">الإجمالي الكلي للفاتورة:</span>
                      <span className="text-2xl font-black text-emerald-600">
                        {(newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (newInvoice.isTaxEnabled ? 1.15 : 1)).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      type="button"
                      onClick={() => setIsInvoiceModalOpen(false)}
                      className="flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 md:flex-none bg-emerald-600 text-white px-12 py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                    >
                      حفظ الفاتورة
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
