import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tags, 
  Users, 
  Truck, 
  BarChart3, 
  Settings, 
  LogOut,
  UserCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ to, icon: Icon, label, hidden }: { to: string; icon: any; label: string; hidden?: boolean }) => {
  if (hidden) return null;
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        isActive 
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
          : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
      )}
    >
      <Icon size={20} className={cn("transition-transform duration-200 group-hover:scale-110")} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export const Layout = () => {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabels: Record<string, string> = {
    admin: 'مدير النظام',
    manager: 'مدير الفرع',
    cashier: 'كاشير'
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 flex flex-col h-full shadow-sm z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">نظام المبيعات</h1>
            <p className="text-xs text-slate-400">الإصدار 2.0</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarItem to="/" icon={LayoutDashboard} label="لوحة التحكم" hidden={!isManager} />
          <SidebarItem to="/pos" icon={ShoppingCart} label="نقطة البيع (POS)" />
          
          {isManager && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">إدارة المخزون</div>
              <SidebarItem to="/products" icon={Package} label="المنتجات" />
              <SidebarItem to="/categories" icon={Tags} label="التصنيفات" />
              <SidebarItem to="/suppliers" icon={Truck} label="الموردين" />
              <SidebarItem to="/purchases" icon={Truck} label="المشتريات" />
            </>
          )}

          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">التقارير والمبيعات</div>
          <SidebarItem to="/sales" icon={BarChart3} label="المبيعات" />
          <SidebarItem to="/customers" icon={Users} label="العملاء" />
          <SidebarItem to="/reports" icon={BarChart3} label="التقارير" hidden={!isManager} />
          <SidebarItem to="/users" icon={Users} label="المستخدمين" hidden={!isAdmin} />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <SidebarItem to="/settings" icon={Settings} label="الإعدادات" hidden={!isAdmin} />
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-slate-800">مرحباً بك، {user?.name}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">{roleLabels[user?.role || ''] || user?.role}</span>
              <span className="text-xs text-slate-400">متصل الآن</span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={24} className="text-slate-600 m-2" />
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
