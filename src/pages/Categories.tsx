import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FolderOpen,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../types';

export const Categories = () => {
  const { categories, addCategory, deleteCategory } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const category: Category = {
      id: Math.random().toString(36).substr(2, 9),
      code: '',
      name: newCategoryName,
      productCount: 0
    };
    addCategory(category);
    setIsModalOpen(false);
    setNewCategoryName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">تصنيفات المنتجات</h1>
          <p className="text-slate-500">تنظيم المنتجات في مجموعات</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة تصنيف جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {categories.map(category => (
            <motion.div 
              layout
              key={category.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <FolderOpen size={24} />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg font-mono">{category.code}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => alert('تعديل التصنيف')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(category.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{category.name}</h3>
              <p className="text-sm text-slate-500">{category.productCount} منتج مرتبطة بهذا التصنيف</p>
              <button onClick={() => alert(`عرض منتجات ${category.name}`)} className="mt-4 w-full py-2 text-slate-600 text-xs font-medium bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">عرض المنتجات</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Category Modal */}
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
                <h2 className="text-xl font-bold text-slate-800">إضافة تصنيف جديد</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">اسم التصنيف</label>
                  <input 
                    required
                    autoFocus
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
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
                    حفظ التصنيف
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
