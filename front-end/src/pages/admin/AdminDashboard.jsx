import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package
} from 'lucide-react';

const AdminDashboard = () => {
  const metrics = [
    {
      title: 'Total Sales Revenue',
      value: '₹ 2,45,890',
      change: '+14.2%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'Total Orders',
      value: '1,280',
      change: '+8.1%',
      isPositive: true,
      icon: CreditCard,
    },
    {
      title: 'Active Products',
      value: '342',
      change: '+12 added',
      isPositive: true,
      icon: ShoppingBag,
    },
    {
      title: 'Total Customers',
      value: '8,920',
      change: '-2.4%',
      isPositive: false,
      icon: Users,
    },
  ];

  const recentOrders = [
    { id: '#ORD-984321', customer: 'Arman Tai', date: '14 Oct 2026', amount: '₹ 12,999', status: 'Delivered' },
    { id: '#ORD-984320', customer: 'Priya Sharma', date: '14 Oct 2026', amount: '₹ 6,999', status: 'Processing' },
    { id: '#ORD-984319', customer: 'Rahul Mehta', date: '13 Oct 2026', amount: '₹ 4,499', status: 'Pending' },
    { id: '#ORD-984318', customer: 'Sneha Patel', date: '13 Oct 2026', amount: '₹ 8,499', status: 'Canceled' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} /> Processing
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={12} /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={12} /> Canceled
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-medium mt-0.5">
            Welcome back! Here is what is happening with your boutique today.
          </p>
        </div>

        <button className="bg-stone-900 hover:bg-black text-amber-200 text-xs font-extrabold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md uppercase tracking-wider transition-all self-start sm:self-auto">
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF3EA] border border-[#EEDFCD] flex items-center justify-center text-[#966F33]">
                  <Icon size={18} />
                </div>
                <span className={`inline-flex items-center text-[11px] font-black px-2.5 py-1 rounded-full ${
                  m.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {m.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {m.change}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-400 block">{m.title}</span>
                <span className="text-xl sm:text-2xl font-black text-stone-900">{m.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table & Inventory Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Orders */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h2 className="text-base font-extrabold text-stone-900">Recent Orders</h2>
            <button className="text-xs font-bold text-[#966F33] hover:text-black transition-colors">
              View All Orders →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 font-mono font-bold text-stone-900">{ord.id}</td>
                    <td className="py-3.5 text-stone-800">{ord.customer}</td>
                    <td className="py-3.5 font-bold text-stone-900">{ord.amount}</td>
                    <td className="py-3.5">{getStatusBadge(ord.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Status Widget */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-5">
          <h2 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-4">
            Inventory Health
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-stone-100">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-[#966F33]" />
                <span className="text-xs font-bold text-stone-800">In Stock Products</span>
              </div>
              <span className="text-xs font-black text-stone-900">310</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-amber-700" />
                <span className="text-xs font-bold text-amber-900">Low Stock Alert</span>
              </div>
              <span className="text-xs font-black text-amber-900">18</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-rose-700" />
                <span className="text-xs font-bold text-rose-900">Out of Stock</span>
              </div>
              <span className="text-xs font-black text-rose-900">14</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;