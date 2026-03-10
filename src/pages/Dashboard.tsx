import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useData } from '../context/DataContext';

const data = [
  { name: 'السبت', sales: 4000, profit: 2400 },
  { name: 'الأحد', sales: 3000, profit: 1398 },
  { name: 'الإثنين', sales: 2000, profit: 9800 },
  { name: 'الثلاثاء', sales: 2780, profit: 3908 },
  { name: 'الأربعاء', sales: 1890, profit: 4800 },
  { name: 'الخميس', sales: 2390, profit: 3800 },
  { name: 'الجمعة', sales: 3490, profit: 4300 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Dashboard = () => {
  const { products, sales } = useData();
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockAlert);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert('تم تحديث البيانات بنجاح');
    }, 1000);
  };

  const handleDownload = () => {
    alert('جاري تجهيز التقرير للتحميل...');
    setTimeout(() => {
      alert('تم تحميل التقرير بنجاح');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
          <p className="text-slate-500">نظرة عامة على أداء المتجر اليوم</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            تحميل التقرير
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            {isRefreshing ? 'جاري التحديث...' : 'تحديث البيانات'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي المبيعات" 
          value="12,450 ج.م" 
          icon={DollarSign} 
          trend="up" 
          trendValue="+12%" 
          color="bg-emerald-500"
        />
        <StatCard 
          title="إجمالي الأرباح" 
          value="4,200 ج.م" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="+8%" 
          color="bg-blue-500"
        />
        <StatCard 
          title="عدد الطلبات" 
          value="48" 
          icon={Package} 
          trend="down" 
          trendValue="-3%" 
          color="bg-violet-500"
        />
        <StatCard 
          title="العملاء الجدد" 
          value="12" 
          icon={Users} 
          trend="up" 
          trendValue="+15%" 
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">إحصائيات المبيعات والأرباح</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs outline-none">
              <option>آخر 7 أيام</option>
              <option>آخر 30 يوم</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-amber-500" size={20} />
            <h3 className="font-bold text-slate-800">تنبيه المخزون المنخفض</h3>
          </div>
          <div className="flex-1 space-y-4">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">{product.name}</p>
                      <span className="text-[10px] font-mono text-slate-400">{product.code}</span>
                    </div>
                    <p className="text-xs text-slate-500">{product.category}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-rose-600">{product.stock} قطع</p>
                  <p className="text-[10px] text-slate-400">تنبيه عند {product.lowStockAlert}</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Package size={48} className="mb-2 opacity-20" />
                <p>لا يوجد منتجات منخفضة المخزون</p>
              </div>
            )}
          </div>
          <button className="mt-6 w-full py-2 text-emerald-600 text-sm font-medium hover:bg-emerald-50 rounded-xl transition-colors">عرض كل المخزون</button>
        </div>
      </div>

      {/* Latest Invoices */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">آخر الفواتير</h3>
          <button className="text-emerald-600 text-sm font-medium hover:underline">عرض الكل</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">رقم الفاتورة</th>
                <th className="px-6 py-4 font-semibold">التاريخ</th>
                <th className="px-6 py-4 font-semibold">الكاشير</th>
                <th className="px-6 py-4 font-semibold">الإجمالي</th>
                <th className="px-6 py-4 font-semibold">الحالة</th>
                <th className="px-6 py-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{sale.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{sale.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{sale.cashier}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{sale.total} {sale.currency}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">مدفوع</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">عرض التفاصيل</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
