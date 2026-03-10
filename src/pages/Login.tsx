import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, User as UserIcon, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        setLoading(false);
      }
      // If success, the useEffect above will handle redirection
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-200 rotate-3">
                <LogIn className="text-white -rotate-3" size={40} />
              </div>
            </div>
            
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-slate-800 mb-2">تسجيل الدخول</h1>
              <p className="text-slate-500">مرحباً بك في نظام إدارة المبيعات</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm flex items-center gap-3 border border-rose-100"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 mr-2">اسم المستخدم</label>
                <div className="relative">
                  <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    required
                    type="text" 
                    placeholder="أدخل اسم المستخدم"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-12 pl-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 mr-2">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-12 pl-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري التحميل...' : 'دخول'}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm">
                بيانات تجريبية: <span className="font-mono font-bold text-slate-600">admin / manager / cashier</span>
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-sm">
          &copy; 2024 نظام إدارة المبيعات المتطور
        </p>
      </motion.div>
    </div>
  );
};
