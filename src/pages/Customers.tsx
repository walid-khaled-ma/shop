import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Wallet,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Customer } from '../types';

export const Customers = () => {
  const { customers, addCustomer, deleteCustomer, sales } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [selectedCustomerForStatement, setSelectedCustomerForStatement] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    balance: 0
  });

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const customerSales = selectedCustomerForStatement 
    ? sales.filter(sale => sale.customerName === selectedCustomerForStatement.name)
    : [];

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCustomer.name || '',
      phone: newCustomer.phone || '',
      email: newCustomer.email || '',
      address: newCustomer.address || '',
      balance: Number(newCustomer.balance) || 0
    };
    addCustomer(customer);
    setIsModalOpen(false);
    setNewCustomer({ name: '', phone: '', email: '', address: '', balance: 0 });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      deleteCustomer(id);
    }
  };

  const openStatement = (customer: Customer) => {
    setSelectedCustomerForStatement(customer);
    setIsStatementOpen(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة العملاء</h1>
          <p className="text-slate-500">إضافة وتعديل بيانات العملاء ومتابعة الحسابات</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة عميل جديد
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ابحث باسم العميل أو رقم الهاتف..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-12 pl-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCustomers.map(customer => (
            <motion.div 
              layout
              key={customer.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <User size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => alert('تعديل العميل')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(customer.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-4">{customer.name}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span>{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    <span>{customer.address}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">الرصيد الحالي</span>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <Wallet size={14} />
                    <span>{customer.balance.toFixed(2)} ر.س</span>
                  </div>
                </div>
                <button 
                  onClick={() => openStatement(customer)}
                  className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  كشف حساب
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Statement Modal */}
      <AnimatePresence>
        {isStatementOpen && selectedCustomerForStatement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStatementOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">كشف حساب: {selectedCustomerForStatement.name}</h2>
                  <p className="text-xs text-slate-500">سجل المعاملات والمبيعات الآجلة</p>
                </div>
                <button onClick={() => setIsStatementOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">إجمالي المشتريات</span>
                    <p className="text-xl font-black text-emerald-700">{customerSales.reduce((sum, s) => sum + s.total, 0).toFixed(2)} ر.س</p>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">الرصيد المستحق</span>
                    <p className="text-xl font-black text-rose-700">{selectedCustomerForStatement.balance.toFixed(2)} ر.س</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">عدد الفواتير</span>
                    <p className="text-xl font-black text-slate-700">{customerSales.length}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                        <th className="pb-3 font-bold">التاريخ</th>
                        <th className="pb-3 font-bold">رقم الفاتورة</th>
                        <th className="pb-3 font-bold">طريقة الدفع</th>
                        <th className="pb-3 font-bold">المبلغ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {customerSales.map((sale) => (
                        <tr key={sale.id} className="text-sm text-slate-700">
                          <td className="py-3">{new Date(sale.date).toLocaleDateString('ar-SA')}</td>
                          <td className="py-3 font-mono text-xs">#{sale.id.toUpperCase()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                              sale.paymentMethod === 'cash' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {sale.paymentMethod === 'cash' ? 'نقدي' : 'آجل'}
                            </span>
                          </td>
                          <td className="py-3 font-bold">{sale.total.toFixed(2)} ر.س</td>
                        </tr>
                      ))}
                      {customerSales.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400">لا توجد معاملات مسجلة لهذا العميل</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Printer size={18} />
                  طباعة الكشف
                </button>
                <button 
                  onClick={() => setIsStatementOpen(false)}
                  className="px-8 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
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
                <h2 className="text-xl font-bold text-slate-800">إضافة عميل جديد</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">اسم العميل</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">رقم الهاتف</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">البريد الإلكتروني (اختياري)</label>
                  <input 
                    type="email" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">العنوان</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
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
                    حفظ العميل
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
