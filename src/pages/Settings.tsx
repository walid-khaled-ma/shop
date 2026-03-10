import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings as SettingsIcon,
  Coins,
  Check,
  Edit2,
  X,
  RefreshCw
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Currency } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const Settings = () => {
  const { currencies, addCurrency, updateCurrency, deleteCurrency, setDefaultCurrency } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  
  const [formData, setFormData] = useState<Partial<Currency>>({
    name: '',
    symbol: '',
    exchangeRate: 1,
    isDefault: false
  });

  const handleOpenModal = (currency?: Currency) => {
    if (currency) {
      setEditingCurrency(currency);
      setFormData(currency);
    } else {
      setEditingCurrency(null);
      setFormData({
        name: '',
        symbol: '',
        exchangeRate: 1,
        isDefault: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCurrency) {
      updateCurrency(formData as Currency);
    } else {
      addCurrency({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Currency);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <SettingsIcon className="text-emerald-600" />
            الإعدادات
          </h1>
          <p className="text-slate-500">تهيئة إعدادات النظام والعملات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar (Optional for future expansion) */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-100">
            <Coins size={20} />
            إدارة العملات
          </button>
          {/* Add more setting categories here if needed */}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">العملات المتاحة</h2>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                إضافة عملة
              </button>
            </div>
            
            <div className="divide-y divide-slate-50">
              {currencies.map((currency) => (
                <div key={currency.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${currency.isDefault ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                      {currency.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800">{currency.name}</h3>
                        {currency.isDefault && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">الافتراضية</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        تعادل الصرف: <span className="font-mono font-bold text-slate-700">{currency.exchangeRate}</span> {currencies.find(c => c.isDefault)?.symbol}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!currency.isDefault && (
                      <button 
                        onClick={() => setDefaultCurrency(currency.id)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="تعيين كافتراضية"
                      >
                        <Check size={20} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleOpenModal(currency)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    {!currency.isDefault && (
                      <button 
                        onClick={() => deleteCurrency(currency.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <RefreshCw className="text-amber-600 shrink-0" size={20} />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>ملاحظة:</strong> يتم استخدام تعادل الصرف لتحويل المبالغ بين العملات المختلفة في النظام. العملة الافتراضية دائماً ما يكون تعادل صرفها هو 1.
            </p>
          </div>
        </div>
      </div>

      {/* Currency Modal */}
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
                <h2 className="text-xl font-bold text-slate-800">
                  {editingCurrency ? 'تعديل عملة' : 'إضافة عملة جديدة'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">اسم العملة</label>
                  <input 
                    required
                    type="text" 
                    placeholder="مثال: ريال يمني"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">الرمز</label>
                    <input 
                      required
                      type="text" 
                      placeholder="مثال: ر.ي"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={formData.symbol}
                      onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">تعادل الصرف</label>
                    <input 
                      required
                      type="number" 
                      step="0.0001"
                      disabled={formData.isDefault}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
                      value={formData.exchangeRate}
                      onChange={(e) => setFormData({...formData, exchangeRate: Number(e.target.value)})}
                    />
                  </div>
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
                    حفظ
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
