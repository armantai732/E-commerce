import React, { useState } from 'react';
import { CreditCard, Search, Eye, CheckCircle2, Clock, XCircle, Truck } from 'lucide-react';

const ordersData = [
  { id: '#ORD-984321', customer: 'Arman Tai', items: 2, total: 12999, date: '14 Oct 2026', status: 'Delivered' },
  { id: '#ORD-984320', customer: 'Priya Sharma', items: 1, total: 6999, date: '14 Oct 2026', status: 'Processing' },
  { id: '#ORD-984319', customer: 'Rahul Mehta', items: 3, total: 4499, date: '13 Oct 2026', status: 'Pending' },
  { id: '#ORD-984318', customer: 'Sneha Patel', items: 1, total: 8499, date: '13 Oct 2026', status: 'Canceled' },
];

const AdminOrders = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredOrders = ordersData.filter(o => {
    if (activeFilter === 'All') return true;
    return o.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'Processing':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Processing</span>;
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Pending</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Canceled</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Customer Orders
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 font-medium mt-0.5">
          Track customer purchases, update order delivery status, and view invoices.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200/80 pb-3">
        {['All', 'Delivered', 'Processing', 'Pending', 'Canceled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeFilter === tab
                ? 'bg-stone-900 text-amber-200 shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider bg-[#FAF9F6]">
                <th className="p-4 sm:p-5 font-bold">Order ID</th>
                <th className="p-4 sm:p-5 font-bold">Customer</th>
                <th className="p-4 sm:p-5 font-bold">Date</th>
                <th className="p-4 sm:p-5 font-bold">Total Amount</th>
                <th className="p-4 sm:p-5 font-bold">Status</th>
                <th className="p-4 sm:p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="p-4 sm:p-5 font-mono font-bold text-stone-900">{o.id}</td>
                  <td className="p-4 sm:p-5 text-stone-800 font-bold">{o.customer}</td>
                  <td className="p-4 sm:p-5 text-stone-500">{o.date}</td>
                  <td className="p-4 sm:p-5 font-black text-stone-900">₹ {o.total.toLocaleString('en-IN')}</td>
                  <td className="p-4 sm:p-5">{getStatusBadge(o.status)}</td>
                  <td className="p-4 sm:p-5 text-right">
                    <button className="p-2 hover:text-[#966F33] hover:bg-[#FAF3EA] rounded-xl transition-all font-bold flex items-center gap-1 ml-auto text-stone-600">
                      <Eye size={15} /> Details
                    </button>
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

export default AdminOrders;