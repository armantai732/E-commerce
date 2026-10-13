import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  MapPin,
  Truck,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/api";

const MyOrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Order status
  const getStatus = (status) => {
    if (status?.toLowerCase() === "delivered") return "Delivered";

    if (["cancelled", "canceled"].includes(status?.toLowerCase())) {
      return "Canceled";
    }

    return "Processing";
  };

  // Backend order data ko simple format mein convert karna
  const formatOrder = (order) => ({
    id: order.orderNumber || order.orderId || order._id,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN")
      : "Date unavailable",

    status: getStatus(order.status),
    totalAmount: Number(order.totalAmount || order.amount || 0),

    shippingAddress:
      typeof order.shippingAddress === "string"
        ? order.shippingAddress
        : [
          order.shippingAddress?.name,
          order.shippingAddress?.phone,
          order.shippingAddress?.street,
          order.shippingAddress?.city,
          order.shippingAddress?.state,
          order.shippingAddress?.pincode,
        ]
          .filter(Boolean)
          .join(", ") || "Address unavailable",

    paymentMethod:
      order.paymentMethod || (order.paymentId ? "Razorpay" : "Not available"),

    items: (order.items || []).map((item) => {
      const product =
        typeof item.product === "object" ? item.product : null;

      return {
        productId: product?._id || item.productId || item.product,
        name: item.name || product?.name || "Product",
        image:
          item.image ||
          item.productImage ||
          product?.images?.[0] ||
          product?.image ||
          "",
        price: Number(item.price || product?.price || 0),
        quantity: Number(item.quantity || 1),
        variant: item.variant || item.size || item.color || "Standard",
      };
    }),
  });

  // Orders fetch karna
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      const data = Array.isArray(response)
        ? response
        : response?.orders || response?.data?.orders || [];

      setOrders(data.map(formatOrder));
    } catch (err) {
      console.error(err);
      setError("Orders load nahi ho sake. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Product detail page open karna
  const openProduct = (productId) => {
    if (!productId || typeof productId === "object") {
      alert("Product ID available nahi hai.");
      return;
    }

    navigate("/product", {
      state: { productId: String(productId) },
    });
  };

  // Status badge
  const StatusBadge = ({ status }) => {
    const styles = {
      Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Processing: "bg-amber-50 text-amber-700 border-amber-200",
      Canceled: "bg-rose-50 text-rose-700 border-rose-200",
    };

    const Icon =
      status === "Delivered"
        ? CheckCircle2
        : status === "Processing"
          ? Clock
          : XCircle;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]
          }`}
      >
        <Icon size={13} />
        {status}
      </span>
    );
  };

  const filteredOrders = orders.filter(
    (order) =>
      activeTab === "All" || order.status === activeTab
  );

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#EEDFCD] border-t-[#966F33] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-stone-600">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // Selected order details
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border text-sm font-bold"
          >
            <ChevronLeft size={16} />
            Back to My Orders
          </button>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-5">
              <div>
                <p className="text-xs text-stone-400">Order Reference</p>
                <h1 className="text-2xl font-black">{selectedOrder.id}</h1>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF9F6] p-4 rounded-xl">
                <p className="text-xs text-stone-400 flex gap-2 items-center">
                  <Calendar size={14} /> Order Date
                </p>
                <p className="font-bold mt-2">{selectedOrder.date}</p>
              </div>

              <div className="bg-[#FAF9F6] p-4 rounded-xl">
                <p className="text-xs text-stone-400 flex gap-2 items-center">
                  <Truck size={14} /> Payment Mode
                </p>
                <p className="font-bold mt-2">
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-xl">
              <p className="text-xs text-stone-400 flex gap-2 items-center mb-2">
                <MapPin size={14} /> Shipping Address
              </p>
              <p className="text-sm font-bold">
                {selectedOrder.shippingAddress}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border space-y-5">
            <h2 className="text-sm font-bold text-stone-500 border-b pb-3">
              Items Purchased ({selectedOrder.items.length})
            </h2>

            {selectedOrder.items.map((item, index) => (
              <div
                key={`${item.productId || item.name}-${index}`}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => openProduct(item.productId)}
                    className="w-20 h-20 rounded-xl bg-[#FAF9F6] border p-2 shrink-0"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Package className="mx-auto text-stone-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <button
                      onClick={() => openProduct(item.productId)}
                      className="text-left text-sm font-bold hover:text-[#966F33]"
                    >
                      {item.name}
                    </button>
                    <p className="text-xs text-stone-400">
                      {item.variant}
                    </p>
                    <p className="text-xs text-stone-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-black shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}

            <div className="flex justify-between border-t pt-5">
              <span className="font-bold">Total Amount Paid</span>
              <span className="font-black text-[#966F33] text-lg">
                ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Orders list
  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-black text-stone-900">
              My Orders
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Check your recent orders and their status.
            </p>
          </div>

          <span className="flex items-center gap-2 bg-[#FAF3EA] border border-[#EEDFCD] text-[#966F33] text-xs font-bold px-4 py-2 rounded-full">
            <Sparkles size={14} />
            {filteredOrders.length} Orders
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Delivered", "Processing", "Canceled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${activeTab === tab
                  ? "bg-stone-900 text-amber-100"
                  : "bg-white text-stone-600 border"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-4 rounded-xl">
            <p className="font-bold">{error}</p>
            <button onClick={fetchOrders} className="underline mt-2">
              Try Again
            </button>
          </div>
        )}

        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => openProduct(order.items[0]?.productId)}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#FAF9F6] border p-2 shrink-0"
                  >
                    {order.items[0]?.image ? (
                      <img
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Package className="mx-auto text-stone-400" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-2">
                    <p className="text-xs font-mono font-bold">
                      {order.id}
                    </p>

                    <StatusBadge status={order.status} />

                    <button
                      onClick={() => openProduct(order.items[0]?.productId)}
                      className="block text-left text-sm font-extrabold hover:text-[#966F33]"
                    >
                      {order.items[0]?.name || "Order items"}
                      {order.items.length > 1
                        ? ` + ${order.items.length - 1} more item(s)`
                        : ""}
                    </button>

                    <p className="text-xs text-stone-400">
                      Order placed on {order.date}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                  <p className="text-lg font-black">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 text-sm font-bold text-[#966F33]"
                  >
                    View Details <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border">
            <Package size={32} className="mx-auto text-stone-400 mb-3" />
            <h3 className="font-bold text-stone-900">
              {error ? "Unable to Load Orders" : "No Orders Found"}
            </h3>
            <p className="text-sm text-stone-400 mt-2">
              {error
                ? "Please check your connection and try again."
                : `No orders found under ${activeTab}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;