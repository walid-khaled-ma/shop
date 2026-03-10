import React from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  DollarSign,
  FileText,
  X,
  Download
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const Sales = () => {
  const { sales } = useData();
  const handleExport = () => {
    alert('جاري تصدير سجل المبيعات بصيغة Excel...');
    setTimeout(() => alert('تم التصدير بنجاح'), 1000);
  };

  const handleViewInvoice = (id: string) => {
    alert(`عرض تفاصيل الفاتورة رقم: ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">سجل المبيعات</h1>
          <p className="text-slate-500">استعراض وإدارة جميع فواتير المبيعات</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            تصدير الكل
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">مبيعات اليوم</p>
          <p className="text-2xl font-bold text-emerald-600">2,450 ج.م</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">عدد الفواتير</p>
          <p className="text-2xl font-bold text-blue-600">18 فاتورة</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">متوسط قيمة الفاتورة</p>
          <p className="text-2xl font-bold text-amber-600">136 ج.م</p>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ابحث برقم الفاتورة أو اسم الكاشير..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-12 pl-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <button className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2">
            <Calendar size={18} />
            تاريخ محدد
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">رقم الفاتورة</th>
                <th className="px-6 py-4 font-semibold">التاريخ والوقت</th>
                <th className="px-6 py-4 font-semibold">الكاشير</th>
                <th className="px-6 py-4 font-semibold">طريقة الدفع</th>
                <th className="px-6 py-4 font-semibold">الإجمالي</th>
                <th className="px-6 py-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-800">{sale.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{sale.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">{sale.cashier}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">نقدي</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{sale.total} {sale.currency}</td>
                  <td className="px-6 py-4">
                    <button className="text-emerald-600 text-sm font-medium hover:underline">عرض الفاتورة</button>
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
