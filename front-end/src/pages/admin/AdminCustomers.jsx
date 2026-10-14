import React from 'react';
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

const customersList = [
  { id: 1, name: 'Arman Tai', email: 'arman@example.com', phone: '+91 98765 43210', orders: 12, spent: '₹ 45,800', joined: 'Jan 2026' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98123 45678', orders: 5, spent: '₹ 18,200', joined: 'Mar 2026' },
  { id: 3, name: 'Rahul Mehta', email: 'rahul@example.com', phone: '+91 97890 12345', orders: 3, spent: '₹ 9,400', joined: 'Jun 2026' },
];

const AdminCustomers = () => {
  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Registered Customers
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 font-medium mt-0.5">
          View customer accounts, purchase frequency, and lifetime spent.
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider bg-[#FAF9F6]">
                <th className="p-4 sm:p-5 font-bold">Customer</th>
                <th className="p-4 sm:p-5 font-bold">Contact</th>
                <th className="p-4 sm:p-5 font-bold">Orders</th>
                <th className="p-4 sm:p-5 font-bold">Total Spent</th>
                <th className="p-4 sm:p-5 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {customersList.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-stone-900 text-amber-200 flex items-center justify-center font-black text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-extrabold text-stone-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 space-y-0.5 text-stone-600">
                    <div className="flex items-center gap-1.5"><Mail size={13} /> {c.email}</div>
                    <div className="flex items-center gap-1.5 text-stone-400"><Phone size={13} /> {c.phone}</div>
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-stone-900">{c.orders} orders</td>
                  <td className="p-4 sm:p-5 font-black text-[#966F33]">{c.spent}</td>
                  <td className="p-4 sm:p-5 text-stone-400">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminCustomers;