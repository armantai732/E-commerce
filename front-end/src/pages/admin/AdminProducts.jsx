import React, { useEffect, useState } from 'react';
import { ShoppingBag, Plus, Search, Edit3, Trash2, Eye, Star, Filter } from 'lucide-react';
import { getProductdata } from '../../api/api';


const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockBadge = (stock) => {
    if (stock > 10) {
      return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">In Stock</span>;
    } else if (stock > 0 && stock <= 10) {
      return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Low Stock</span>;
    } else {
      return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Out of Stock</span>;
    }
  };


  const fecthProduct = async () => {
    try {
      const res = await getProductdata();
      setProducts(res.data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fecthProduct()
  }, [])

  return (
    <div className="space-y-6 font-sans">

      {/* Top Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-medium mt-0.5">
            Manage product inventory, pricing, and active listings.
          </p>
        </div>

        <button className="bg-stone-900 hover:bg-black text-amber-200 text-xs font-extrabold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md uppercase tracking-wider transition-all self-start sm:self-auto">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F6] focus:outline-none focus:border-stone-900"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        </div>

        <span className="text-xs font-bold text-stone-400 self-end sm:self-auto">
          Total Products: {filteredProducts.length}
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider bg-[#FAF9F6]">
                <th className="p-4 sm:p-5 font-bold">Product</th>
                <th className="p-4 sm:p-5 font-bold">Category</th>
                <th className="p-4 sm:p-5 font-bold">Price</th>
                <th className="p-4 sm:p-5 font-bold">Stock</th>
                <th className="p-4 sm:p-5 font-bold">Status</th>
                <th className="p-4 sm:p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-stone-100 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                        <img src={p.images} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <span className="font-extrabold text-stone-900 text-xs sm:text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-stone-600">{p.category?.name || "No Category"}</td>
                  <td className="p-4 sm:p-5 font-extrabold text-stone-900">₹ {p.price.toLocaleString('en-IN')}</td>
                  <td className="p-4 sm:p-5 text-stone-800 font-bold">{p.stock} units</td>
                  <td className="p-4 sm:p-5">{getStockBadge(Number(p.stock) || 0)}</td>
                  <td className="p-4 sm:p-5 text-right">
                    <div className="flex items-center justify-end gap-2 text-stone-400">
                      <button className="p-2 hover:text-[#966F33] hover:bg-[#FAF3EA] rounded-xl transition-all" title="Edit">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
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

export default AdminProducts;