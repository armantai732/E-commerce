import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  Eye,
  RefreshCw,
  X,
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
      Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Processing: "bg-amber-50 text-amber-700 border-amber-200",
      Pending: "bg-blue-50 text-blue-700 border-blue-200",
      Canceled: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold border ${
          styles[status] ||
          "bg-stone-100 text-stone-600 border-stone-200"
        }`}
      >
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
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Customer Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-medium mt-1">
            View customer purchases, payment information and order details.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-bold hover:bg-stone-700 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <p className="text-sm text-stone-500 font-medium">Total Orders</p>
          <h2 className="text-2xl font-black text-stone-900 mt-2">
            {orders.length}
          </h2>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <p className="text-sm text-stone-500 font-medium">Paid Orders</p>
          <h2 className="text-2xl font-black text-emerald-700 mt-2">
            {orders.filter((o) => o.paymentStatus === "Paid").length}
          </h2>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <p className="text-sm text-stone-500 font-medium">Total Revenue</p>
          <h2 className="text-2xl font-black text-stone-900 mt-2">
            {formatCurrency(
              orders
                .filter((o) => o.paymentStatus === "Paid")
                .reduce((sum, o) => sum + Number(o.total || 0), 0)
            )}
          </h2>
        </div>
      </div>

      {/* Search */}
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
          className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl outline-none focus:border-stone-500 text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200/80 pb-3">
        {filters.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeFilter === tab
                ? "bg-stone-900 text-amber-200 shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            {tab}
            {tab === "All" && ` (${orders.length})`}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={fetchOrders}
            className="font-bold underline self-start"
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
                <th className="p-4 sm:p-5 font-bold">Total Amount</th>
                <th className="p-4 sm:p-5 font-bold">Payment</th>
                <th className="p-4 sm:p-5 font-bold">Status</th>
                <th className="p-4 sm:p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-stone-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-stone-500">
                    {error
                      ? "Orders could not be loaded."
                      : "No orders found."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FAF9F6] transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-mono font-bold text-stone-900">
                      {order.orderId}
                    </td>

                    <td className="p-4 sm:p-5">
                      <p className="text-stone-800 font-bold">
                        {order.customer}
                      </p>
                      <p className="text-stone-400 font-normal mt-1">
                        {order.email}
                      </p>
                    </td>

                    <td className="p-4 sm:p-5 text-stone-600">
                      {order.items}
                    </td>

                    <td className="p-4 sm:p-5 text-stone-500 whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>

                    <td className="p-4 sm:p-5 font-black text-stone-900 whitespace-nowrap">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="p-4 sm:p-5">
                      <span
                        className={`font-bold ${
                          order.paymentStatus === "Paid"
                            ? "text-emerald-700"
                            : order.paymentStatus === "Failed"
                              ? "text-rose-600"
                              : "text-amber-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4 sm:p-5">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="p-4 sm:p-5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:text-[#966F33] hover:bg-[#FAF3EA] rounded-xl transition-all font-bold inline-flex items-center gap-1 text-stone-600"
                      >
                        <Eye size={15} />
                        Details
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-stone-200 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-stone-900">
                  Order Details
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  {selectedOrder.orderId}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl hover:bg-stone-100"
                aria-label="Close order details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-stone-400">Customer</p>
                  <p className="font-bold text-stone-800 mt-1">
                    {selectedOrder.customer}
                  </p>
                  <p className="text-sm text-stone-500 mt-1">
                    {selectedOrder.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-stone-400">Order Date</p>
                  <p className="font-bold text-stone-800 mt-1">
                    {formatDate(selectedOrder.date)}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-black text-stone-900 mb-3">
                  Products
                </h3>

                <div className="space-y-3">
                  {selectedOrder.products.map((item, index) => (
                    <div
                      key={item._id || `${item.name}-${index}`}
                      className="flex items-center gap-3 border border-stone-100 rounded-2xl p-3"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover bg-stone-50"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center">
                          <CreditCard size={20} className="text-stone-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-500 mt-1">
                          Qty: {item.quantity}
                          {item.size ? ` • Size: ${item.size}` : ""}
                          {item.color ? ` • Color: ${item.color}` : ""}
                        </p>
                      </div>

                      <p className="font-black text-stone-900 whitespace-nowrap">
                        {formatCurrency(
                          Number(item.price || 0) *
                            Number(item.quantity || 0)
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FAF9F6] rounded-2xl p-4 space-y-3">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-stone-500">Payment Method</span>
                  <span className="font-bold text-stone-800">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-stone-500">Payment Status</span>
                  <span className="font-bold text-stone-800">
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                {selectedOrder.paymentId && (
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-stone-500">Payment ID</span>
                    <span className="font-medium text-stone-800 break-all text-right">
                      {selectedOrder.paymentId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between gap-3 border-t border-stone-200 pt-3">
                  <span className="font-black text-stone-900">Total</span>
                  <span className="font-black text-stone-900">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-black text-stone-900 mb-2">
                  Shipping Address
                </h3>
                <p className="text-sm text-stone-600">
                  {selectedOrder.shippingAddress || "No address available"}
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