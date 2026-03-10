import React, { useRef } from 'react';
import { CartItem, Customer } from '../types';
import { Printer, X, Download, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReceiptProps {
  cart: CartItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'credit';
  customer?: Customer | null;
  onClose: () => void;
}

export const Receipt = ({ 
  cart, 
  subtotal, 
  taxAmount, 
  discount, 
  total, 
  paymentMethod, 
  customer, 
  onClose 
}: ReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const date = new Date().toLocaleString('ar-SA');
  const invoiceNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  const handlePrint = () => {
    const content = document.getElementById('receipt-content');
    if (!content) return;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) return;

    frameDoc.write(`
      <html>
        <head>
          <title>فاتورة مبيعات</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              direction: rtl; 
              padding: 20px;
              color: #1e293b;
            }
            .text-center { text-align: center; }
            .mb-8 { margin-bottom: 2rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-1 { margin-bottom: 0.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-lg { font-size: 1.125rem; }
            .text-xs { font-size: 0.75rem; }
            .text-sm { font-size: 0.875rem; }
            .font-black { font-weight: 900; }
            .font-bold { font-weight: 700; }
            .text-slate-500 { color: #64748b; }
            .border-b-2 { border-bottom-width: 2px; }
            .border-dashed { border-style: dashed; }
            .border-slate-200 { border-color: #e2e8f0; }
            .my-4 { margin-top: 1rem; margin-bottom: 1rem; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .bg-slate-50 { background-color: #f8fafc; }
            .p-3 { padding: 0.75rem; }
            .rounded-xl { border-radius: 0.75rem; }
            .border { border: 1px solid #e2e8f0; }
            .w-full { width: 100%; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: right; border-bottom: 1px solid #e2e8f0; padding: 8px 0; }
            td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
            .text-left { text-align: left; }
            .text-center { text-align: center; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .pt-2 { padding-top: 0.5rem; }
            .border-t-2 { border-top-width: 2px; }
            .mt-10 { margin-top: 2.5rem; }
            .flex-center { display: flex; justify-content: center; }
            .qr-placeholder { 
              width: 100px; 
              height: 100px; 
              border: 2px solid #e2e8f0; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 8px; 
              color: #94a3b8;
              margin: 0 auto 10px;
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 100);
            };
          </script>
        </body>
      </html>
    `);
    frameDoc.close();
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // Custom size for receipt
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ أثناء تحميل الفاتورة');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `فاتورة مبيعات #${invoiceNumber}`,
          text: `تفاصيل الفاتورة بقيمة ${total.toFixed(2)} ر.س`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert('خاصية المشاركة غير مدعومة في هذا المتصفح');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Actions Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              title="طباعة"
              className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={handleDownload}
              title="تحميل PDF"
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={handleShare}
              title="مشاركة"
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
            >
              <Share2 size={20} />
            </button>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Receipt Content (The Printable Part) */}
        <div ref={receiptRef} id="receipt-content" className="p-8 bg-white font-mono text-slate-800 print:p-0">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black mb-1">نظام المبيعات المتطور</h1>
            <p className="text-xs text-slate-500">الرياض، المملكة العربية السعودية</p>
            <p className="text-xs text-slate-500">الرقم الضريبي: 300012345600003</p>
            <div className="my-4 border-b-2 border-dashed border-slate-200"></div>
            <h2 className="text-lg font-bold">فاتورة مبيعات</h2>
          </div>

          <div className="flex justify-between text-xs mb-2">
            <span>رقم الفاتورة:</span>
            <span className="font-bold">#{invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-xs mb-2">
            <span>التاريخ:</span>
            <span>{date}</span>
          </div>
          <div className="flex justify-between text-xs mb-4">
            <span>طريقة الدفع:</span>
            <span className="font-bold">{paymentMethod === 'cash' ? 'نقدي' : 'آجل'}</span>
          </div>

          {customer && (
            <div className="bg-slate-50 p-3 rounded-xl mb-4 text-xs border border-slate-100">
              <p className="font-bold mb-1">بيانات العميل:</p>
              <p>{customer.name}</p>
              <p>{customer.phone}</p>
            </div>
          )}

          <div className="border-b border-slate-200 mb-4"></div>

          <table className="w-full text-xs mb-6">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-right py-2">الصنف</th>
                <th className="text-center py-2">الكمية</th>
                <th className="text-left py-2">السعر</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} className="border-b border-slate-50">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-left">{(item.salePrice * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span>{subtotal.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الضريبة (15%):</span>
              <span>{taxAmount.toFixed(2)} ر.س</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>الخصم:</span>
                <span>-{discount.toFixed(2)} ر.س</span>
              </div>
            )}
            <div className="pt-2 border-t-2 border-dashed border-slate-200 flex justify-between text-lg font-black">
              <span>الإجمالي:</span>
              <span>{total.toFixed(2)} ر.س</span>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="flex justify-center mb-4">
              {/* Simple QR Code Placeholder */}
              <div className="w-24 h-24 border-2 border-slate-200 p-1 rounded-lg">
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 text-center">
                  QR CODE<br/>ZATCA COMPLIANT
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">شكراً لزيارتكم!</p>
            <p className="text-[10px] text-slate-400">الأسعار تشمل ضريبة القيمة المضافة</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all"
          >
            إغلاق ومعاودة البيع
          </button>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm; /* Standard receipt width */
          }
        }
      `}} />
    </div>
  );
};
