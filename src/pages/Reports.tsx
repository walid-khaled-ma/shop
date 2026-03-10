import React from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Package, 
  ArrowUpRight,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const salesData = [
  { name: 'يناير', sales: 4000 },
  { name: 'فبراير', sales: 3000 },
  { name: 'مارس', sales: 2000 },
  { name: 'أبريل', sales: 2780 },
  { name: 'مايو', sales: 1890 },
  { name: 'يونيو', sales: 2390 },
];

const categoryData = [
  { name: 'مشروبات', value: 400 },
  { name: 'مخبوزات', value: 300 },
  { name: 'حلويات', value: 300 },
  { name: 'سندوتشات', value: 200 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export const Reports = () => {
  const handleExport = () => {
    alert('جاري توليد التقارير التحليلية...');
    setTimeout(() => alert('تم تحميل التقارير بنجاح'), 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">التقارير والتحليلات</h1>
          <p className="text-slate-500">تحليل أداء المبيعات والمخزون</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <Download size={18} />
          تصدير التقارير
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-600" />
            اتجاه المبيعات الشهري
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-blue-600" />
            توزيع المبيعات حسب التصنيف
          </h3>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Package size={20} className="text-amber-600" />
            المنتجات الأكثر مبيعاً
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-slate-400">#{i}</div>
                  <div>
                    <p className="font-bold text-slate-800">منتج تجريبي رقم {i}</p>
                    <p className="text-xs text-slate-500">تم بيع {150 - i * 20} قطعة هذا الشهر</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-emerald-600">{(5000 / i).toFixed(0)} ج.م</p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                    <ArrowUpRight size={12} />
                    12% نمو
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
