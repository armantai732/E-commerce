import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  Eye,
  RefreshCw,
  X,
  ShoppingBag,
  CheckCircle2,
  DollarSign,
  PackageCheck,
  AlertCircle,
  MapPin,
  Calendar,
  User
} from "lucide-react";
import { getAdminOrders } from "../../api/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminOrders();
      setOrders(response.orders || []);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError(err.message || "Unable to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      activeFilter === "All" || order.status === activeFilter;

    const query = searchQuery.toLowerCase();

    const matchesSearch =
      (order.orderId || "").toLowerCase().includes(query) ||
      (order.customer || "").toLowerCase().includes(query) ||
      (order.email || "").toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const formatCurrency = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-sm",
      Processing: "bg-amber-50 text-amber-700 border-amber-200/80 shadow-sm",
      Pending: "bg-sky-50 text-sky-700 border-sky-200/80 shadow-sm",
      Canceled: "bg-rose-50 text-rose-700 border-rose-200/80 shadow-sm",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${
          styles[status] || "bg-stone-100 text-stone-600 border-stone-200"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {status || "Processing"}
      </span>
    );
  };

  const filters = ["All", "Delivered", "Processing", "Canceled"];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
            Customer Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-medium mt-1">
            Track customer purchases, fulfillment status, and order revenue.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-amber-200 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh Orders
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 group-hover:scale-110 transition-transform">
              <ShoppingBag size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-stone-900 mt-3">
            {orders.length}
          </h2>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Paid Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-emerald-700 mt-3">
            {orders.filter((o) => o.paymentStatus === "Paid").length}
          </h2>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-stone-900 mt-3">
            {formatCurrency(
              orders
                .filter((o) => o.paymentStatus === "Paid")
                .reduce((sum, o) => sum + Number(o.total || 0), 0)
            )}
          </h2>
        </div>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-2xl outline-none focus:border-stone-900 transition-colors text-xs font-semibold text-stone-800 placeholder-stone-400 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? "bg-stone-900 text-amber-200 shadow-md"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80 shadow-sm"
              }`}
            >
              {tab}
              {tab === "All" && ` (${orders.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-all text-xs font-extrabold uppercase tracking-wider self-start sm:self-auto"
          >
            Try again
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider bg-[#FAF9F6]">
                <th className="p-4 sm:p-5 font-bold">Order ID</th>
                <th className="p-4 sm:p-5 font-bold">Customer</th>
                <th className="p-4 sm:p-5 font-bold">Items</th>
                <th className="p-4 sm:p-5 font-bold">Date</th>
                <th className="p-4 sm:p-5 font-bold">Total</th>
                <th className="p-4 sm:p-5 font-bold">Payment</th>
                <th className="p-4 sm:p-5 font-bold">Status</th>
                <th className="p-4 sm:p-5 font-bold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-stone-400 font-bold">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-stone-400" />
                    Fetching latest orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-stone-400 font-bold">
                    {error ? "Orders could not be loaded." : "No matching orders found."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id || order.orderId}
                    className="hover:bg-[#FAF9F6] transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-mono font-bold text-stone-900">
                      {order.orderId}
                    </td>

                    <td className="p-4 sm:p-5">
                      <p className="text-stone-900 font-extrabold">{order.customer}</p>
                      <p className="text-stone-400 font-medium text-[11px]">{order.email}</p>
                    </td>

                    <td className="p-4 sm:p-5 text-stone-600 font-bold">
                      {order.items} {order.items === 1 ? "item" : "items"}
                    </td>

                    <td className="p-4 sm:p-5 text-stone-500 whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>

                    <td className="p-4 sm:p-5 font-black text-stone-900 whitespace-nowrap">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="p-4 sm:p-5">
                      <span
                        className={`inline-flex items-center gap-1.5 font-bold text-[11px] ${
                          order.paymentStatus === "Paid"
                            ? "text-emerald-700"
                            : order.paymentStatus === "Failed"
                            ? "text-rose-600"
                            : "text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            order.paymentStatus === "Paid"
                              ? "bg-emerald-600"
                              : order.paymentStatus === "Failed"
                              ? "bg-rose-600"
                              : "bg-amber-600"
                          }`}
                        ></span>
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4 sm:p-5">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="p-4 sm:p-5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3.5 py-2 hover:bg-stone-900 hover:text-white rounded-xl transition-all font-extrabold inline-flex items-center gap-1.5 text-stone-700 bg-stone-100 border border-stone-200/60 shadow-sm"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-stone-200">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-stone-100 p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Order Details
                </span>
                <h2 className="text-xl font-black text-stone-900 font-mono mt-1">
                  {selectedOrder.orderId}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Customer & Date Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200/60">
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 shrink-0 mt-0.5">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Customer</p>
                    <p className="font-extrabold text-stone-900 text-sm mt-0.5">
                      {selectedOrder.customer}
                    </p>
                    <p className="text-xs text-stone-500 font-medium">
                      {selectedOrder.email}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 shrink-0 mt-0.5">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Order Date & Status</p>
                    <p className="font-extrabold text-stone-900 text-sm mt-0.5">
                      {formatDate(selectedOrder.date)}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchased Products */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
                  <PackageCheck size={16} /> Products ({selectedOrder.products?.length || 0})
                </h3>

                <div className="space-y-3">
                  {selectedOrder.products?.map((item, index) => (
                    <div
                      key={item._id || `${item.name}-${index}`}
                      className="flex items-center gap-4 border border-stone-200/80 rounded-2xl p-3.5 bg-white hover:border-stone-300 transition-colors shadow-sm"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-contain bg-[#FAF9F6] border border-stone-100 p-1 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                          <CreditCard size={20} className="text-stone-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-stone-900 text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-500 font-semibold mt-1">
                          Qty: <span className="text-stone-900 font-bold">{item.quantity}</span>
                          {item.size ? ` • Size: ${item.size}` : ""}
                          {item.color ? ` • Color: ${item.color}` : ""}
                        </p>
                      </div>

                      <p className="font-black text-stone-900 text-sm whitespace-nowrap">
                        {formatCurrency(
                          Number(item.price || 0) * Number(item.quantity || 0)
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-stone-200/60 space-y-3">
                <div className="flex justify-between gap-3 text-xs">
                  <span className="text-stone-500 font-bold">Payment Method</span>
                  <span className="font-extrabold text-stone-900">
                    {selectedOrder.paymentMethod || "COD"}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-xs">
                  <span className="text-stone-500 font-bold">Payment Status</span>
                  <span className="font-extrabold text-stone-900">
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                {selectedOrder.paymentId && (
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="text-stone-500 font-bold">Payment Transaction ID</span>
                    <span className="font-mono text-stone-800 break-all text-right font-bold">
                      {selectedOrder.paymentId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between gap-3 border-t border-stone-200 pt-3 text-sm">
                  <span className="font-black text-stone-900">Total Amount Paid</span>
                  <span className="font-black text-stone-900 text-base">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                  <MapPin size={15} /> Shipping Address
                </h3>
                <p className="text-xs font-semibold text-stone-700 leading-relaxed">
                  {selectedOrder.shippingAddress || "No shipping address provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;