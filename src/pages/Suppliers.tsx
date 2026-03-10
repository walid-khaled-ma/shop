import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Edit2,
  Trash2,
  ExternalLink,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Supplier } from '../types';

export const Suppliers = () => {
  const { suppliers, addSupplier, deleteSupplier } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier: Supplier = {
      ...newSupplier as Supplier,
      id: Math.random().toString(36).substr(2, 9),
    };
    addSupplier(supplier);
    setIsModalOpen(false);
    setNewSupplier({ name: '', phone: '', email: '', address: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المورد؟')) {
      deleteSupplier(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الموردين</h1>
          <p className="text-slate-500">قائمة الموردين المعتمدين وبيانات الاتصال</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة مورد جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {suppliers.map(supplier => (
            <motion.div 
              layout
              key={supplier.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl">
                    {supplier.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{supplier.name}</h3>
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">مورد نشط</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => alert('تعديل المورد')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(supplier.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg"><Phone size={16} /></div>
                  <span className="text-sm">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg"><Mail size={16} /></div>
                  <span className="text-sm">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 md:col-span-2">
                  <div className="p-2 bg-slate-50 rounded-lg"><MapPin size={16} /></div>
                  <span className="text-sm">{supplier.address}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button onClick={() => alert('عرض سجل المشتريات')} className="flex-1 py-2 bg-slate-50 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                  سجل المشتريات
                  <ExternalLink size={14} />
                </button>
                <button onClick={() => alert('طلب شراء جديد')} className="flex-1 py-2 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl hover:bg-emerald-100 transition-colors">
                  طلب شراء جديد
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Supplier Modal */}
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
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">إضافة مورد جديد</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddSupplier} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">اسم المورد</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">رقم الهاتف</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">العنوان</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
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
                    حفظ المورد
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
