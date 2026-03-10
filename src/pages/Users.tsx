import React, { useState } from 'react';
import { 
  Plus, 
  Shield, 
  User as UserIcon, 
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Mail,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { User, UserRole } from '../types';

export const Users = () => {
  const { users, addUser, deleteUser } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    username: '',
    role: 'cashier'
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name || '',
      username: newUser.username || '',
      role: newUser.role as UserRole,
      avatar: `https://i.pravatar.cc/150?u=${newUser.username}`
    };
    addUser(user);
    setIsModalOpen(false);
    setNewUser({ name: '', username: '', role: 'cashier' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      deleteUser(id);
    }
  };

  const roleLabels: Record<UserRole, string> = {
    admin: 'مدير النظام',
    manager: 'مدير الفرع',
    cashier: 'كاشير'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">المستخدمين والصلاحيات</h1>
          <p className="text-slate-500">إدارة حسابات الموظفين وتحديد أدوارهم</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة مستخدم جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {users.map(user => (
            <motion.div 
              layout
              key={user.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={24} className="text-slate-300" />
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => alert('تعديل المستخدم')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1">{user.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <UserCheck size={14} />
                <span>@{user.username}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded-full ${
                  user.role === 'admin' ? 'text-rose-600 bg-rose-50' : 
                  user.role === 'manager' ? 'text-blue-600 bg-blue-50' : 
                  'text-emerald-600 bg-emerald-50'
                }`}>
                  <Shield size={12} />
                  {roleLabels[user.role]}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 size={12} />
                  نشط
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add User Modal */}
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
                <h2 className="text-xl font-bold text-slate-800">إضافة مستخدم جديد</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">الاسم بالكامل</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">اسم المستخدم</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">الدور / الصلاحية</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                  >
                    <option value="admin">مدير النظام (Admin)</option>
                    <option value="manager">مدير الفرع (Manager)</option>
                    <option value="cashier">كاشير (Cashier)</option>
                  </select>
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
                    حفظ المستخدم
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
