import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Download,
  Package,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

export const Products = () => {
  const { products, categories, addProduct, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    barcode: '',
    category: categories[0]?.name || '',
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    lowStockAlert: 5,
    image: 'https://picsum.photos/seed/new/200/200'
  });

  // Update default category when categories change
  useEffect(() => {
    if (!newProduct.category && categories.length > 0) {
      setNewProduct(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      ...newProduct as Product,
      id: Math.random().toString(36).substr(2, 9),
      code: '',
    };
    addProduct(product);
    setIsModalOpen(false);
    setNewProduct({
      name: '',
      barcode: '',
      category: categories[0]?.name || '',
      purchasePrice: 0,
      salePrice: 0,
      stock: 0,
      lowStockAlert: 5,
      image: 'https://picsum.photos/seed/new/200/200'
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المنتجات</h1>
          <p className="text-slate-500">إضافة وتعديل ومراقبة المخزون</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            تصدير
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
          >
            <Plus size={18} />
            إضافة منتج جديد
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ابحث بالاسم، الباركود، أو التصنيف..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-12 pl-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2">
          <Filter size={18} />
          تصفية
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">الكود</th>
                <th className="px-6 py-4 font-semibold">المنتج</th>
                <th className="px-6 py-4 font-semibold">الباركود</th>
                <th className="px-6 py-4 font-semibold">التصنيف</th>
                <th className="px-6 py-4 font-semibold">سعر الشراء</th>
                <th className="px-6 py-4 font-semibold">سعر البيع</th>
                <th className="px-6 py-4 font-semibold">المخزون</th>
                <th className="px-6 py-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-xs font-bold text-slate-400 font-mono">{product.code}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{product.barcode}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.purchasePrice} ج.م</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{product.salePrice} ج.م</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${product.stock <= product.lowStockAlert ? 'text-rose-600' : 'text-slate-800'}`}>
                        {product.stock} قطعة
                      </span>
                      {product.stock <= product.lowStockAlert && (
                        <span className="text-[10px] text-rose-400 font-medium">مخزون منخفض!</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                      <button 
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
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
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">إضافة منتج جديد</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">اسم المنتج</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">الباركود</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">التصنيف</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">سعر الشراء</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={newProduct.purchasePrice}
                      onChange={(e) => setNewProduct({...newProduct, purchasePrice: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">سعر البيع</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={newProduct.salePrice}
                      onChange={(e) => setNewProduct({...newProduct, salePrice: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">المخزون الحالي</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
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
                    حفظ المنتج
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
