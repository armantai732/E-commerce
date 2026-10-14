import React, { useState } from 'react';
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
  Package,
  AlertTriangle,
  Eye,
  Filter,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [filterPeriod, setFilterPeriod] = useState('This Month');

  // Top Metrics Summary Data
  const metrics = [
    {
      title: 'Total Sales Revenue',
      value: '₹ 2,45,890',
      change: '+14.2%',
      isPositive: true,
      icon: TrendingUp,
      subtitle: 'vs previous month'
    },
    {
      title: 'Total Orders',
      value: '1,280',
      change: '+8.1%',
      isPositive: true,
      icon: CreditCard,
      subtitle: 'vs previous month'
    },
    {
      title: 'Active Products',
      value: '342',
      change: '+12 added',
      isPositive: true,
      icon: ShoppingBag,
      subtitle: 'across 8 categories'
    },
    {
      title: 'Total Customers',
      value: '8,920',
      change: '-2.4%',
      isPositive: false,
      icon: Users,
      subtitle: 'vs previous month'
    },
  ];

  // Recent Orders Data
  const recentOrders = [
    { id: '#ORD-984321', customer: 'Arman Tai', items: 'Nike Air Force 1', date: '14 Oct 2026', amount: '₹ 12,999', status: 'Delivered' },
    { id: '#ORD-984320', customer: 'Priya Sharma', items: 'Sony Headphones', date: '14 Oct 2026', amount: '₹ 6,999', status: 'Processing' },
    { id: '#ORD-984319', customer: 'Rahul Mehta', items: 'Fossil Watch', date: '13 Oct 2026', amount: '₹ 4,499', status: 'Pending' },
    { id: '#ORD-984318', customer: 'Sneha Patel', items: 'Leather Handbag', date: '13 Oct 2026', amount: '₹ 8,499', status: 'Canceled' },
    { id: '#ORD-984317', customer: 'Vikram Singh', items: 'Urban Backpack', date: '12 Oct 2026', amount: '₹ 2,499', status: 'Delivered' },
  ];

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
            <CheckCircle2 size={12} className="text-emerald-600" /> Delivered
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-sm">
            <Clock size={12} className="text-amber-600" /> Processing
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm">
            <Clock size={12} className="text-blue-600" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-sm">
            <XCircle size={12} className="text-rose-600" /> Canceled
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans">

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-3 hover:border-[#EEDFCD] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF3EA] border border-[#EEDFCD] flex items-center justify-center text-[#966F33] shadow-sm">
                  <Icon size={20} />
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full ${
                  m.isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}>
                  {m.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {m.change}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-400 block uppercase tracking-wider">{m.title}</span>
                <span className="text-xl sm:text-2xl font-black text-stone-900">{m.value}</span>
                <p className="text-[10px] text-stone-400 font-medium mt-0.5">{m.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Grid: Recent Orders & Inventory Status Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Orders List Table */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-black text-stone-900">Recent Customer Orders</h2>
              <p className="text-xs text-stone-400 font-medium">Latest transactions processed</p>
            </div>
            
            <Link 
              to="/admin/orders" 
              className="text-xs font-extrabold text-[#966F33] hover:text-black transition-colors"
            >
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider bg-[#FAF9F6]">
                  <th className="p-3.5 font-bold rounded-l-xl">Order ID</th>
                  <th className="p-3.5 font-bold">Customer</th>
                  <th className="p-3.5 font-bold">Item</th>
                  <th className="p-3.5 font-bold">Amount</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-stone-900">{ord.id}</td>
                    <td className="p-3.5 font-extrabold text-stone-800">{ord.customer}</td>
                    <td className="p-3.5 text-stone-500 truncate max-w-[120px]">{ord.items}</td>
                    <td className="p-3.5 font-black text-stone-900">{ord.amount}</td>
                    <td className="p-3.5">{getStatusBadge(ord.status)}</td>
                    <td className="p-3.5 text-right">
                      <Link 
                        to="/admin/orders" 
                        className="p-1.5 inline-flex items-center justify-center text-stone-400 hover:text-[#966F33] hover:bg-[#FAF3EA] rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Status Widget */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-base font-black text-stone-900">Inventory Health</h2>
            <p className="text-xs text-stone-400 font-medium">Stock status summary</p>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Package size={16} />
                </div>
                <span className="text-xs font-extrabold text-stone-800">In Stock Products</span>
              </div>
              <span className="text-sm font-black text-stone-900">310</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle size={16} />
                </div>
                <span className="text-xs font-extrabold text-amber-900">Low Stock Alert</span>
              </div>
              <span className="text-sm font-black text-amber-900">18</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <XCircle size={16} />
                </div>
                <span className="text-xs font-extrabold text-rose-900">Out of Stock</span>
              </div>
              <span className="text-sm font-black text-rose-900">14</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/admin/products"
              className="w-full bg-[#FAF3EA] hover:bg-stone-900 text-[#966F33] hover:text-amber-200 border border-[#EEDFCD] hover:border-stone-900 font-extrabold py-3.5 rounded-2xl text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
            >
              Manage Inventory
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;