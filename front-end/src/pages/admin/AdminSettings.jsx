import React, { useState } from 'react';
import { Settings, Save, Store, Lock, ShieldCheck, Bell } from 'lucide-react';

const AdminSettings = () => {
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'ShopNest Boutique',
    email: 'support@shopnest.com',
    phone: '+91 98765 43210',
    currency: 'INR (₹)',
  });

  return (
    <div className="max-w-4xl space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Admin Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 font-medium mt-0.5">
          Configure store preferences, contact information, and security.
        </p>
      </div>

      {/* General Store Details Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-6">
        <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
          <Store size={18} className="text-[#966F33]" /> Store Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Store Name</label>
            <input
              type="text"
              value={storeInfo.storeName}
              onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
              className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Support Email</label>
            <input
              type="email"
              value={storeInfo.email}
              onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
              className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Phone Number</label>
            <input
              type="text"
              value={storeInfo.phone}
              onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
              className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Currency</label>
            <input
              type="text"
              value={storeInfo.currency}
              disabled
              className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-stone-200 bg-[#FAF9F6] text-stone-500 cursor-not-allowed"
            />
          </div>
        </div>

        <button 
          onClick={() => alert("Settings saved successfully!")}
          className="bg-stone-900 hover:bg-black text-amber-200 text-xs font-extrabold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-md uppercase tracking-wider transition-all"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

    </div>
  );
};

export default AdminSettings;