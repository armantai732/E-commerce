import React from "react";
import { CheckCircle2, Package, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderCompletePage = ({ order: orderProp, onGoHome }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Actual order data: props or React Router state
  const order =
    orderProp ||
    location.state?.order ||
    JSON.parse(localStorage.getItem("lastOrder") || "null");

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate("/");
    }
  };

  // No dummy products: show only the products actually ordered
  const rawItems =
    order?.items ||
    order?.products ||
    order?.cartItems ||
    order?.orderItems ||
    [];

  const items = rawItems.map((item, index) => {
    const product = item.product || item.productId || item;

    const price = Number(
      item.price ?? product.price ?? item.unitPrice ?? 0
    );

    const quantity = Number(item.quantity ?? item.qty ?? 1);

    const image =
      item.image ||
      item.images?.[0] ||
      product.image ||
      product.images?.[0] ||
      "";

    const attributes = [
      item.size && `Size: ${item.size}`,
      item.color && `Color: ${item.color}`,
      item.selectedSize && `Size: ${item.selectedSize}`,
      item.selectedColor && `Color: ${item.selectedColor}`,
    ].filter(Boolean);

    return {
      id: item._id || item.id || product._id || index,
      name: item.name || product.name || "Product",
      image,
      variant: attributes.join(" | "),
      price,
      quantity,
      subtotal: Number(item.subtotal ?? price * quantity),
    };
  });

  const totalAmount = Number(
    order?.totalAmount ??
    order?.amount ??
    items.reduce((total, item) => total + item.subtotal, 0)
  );

  const orderId = order?.orderId || order?._id || order?.id;
  const paymentId = order?.paymentId;

  // Don't show a success page without a confirmed order.
  if (!order || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-md">
          <Package size={40} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-xl font-bold text-gray-900">
            Order details not found
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Please return to your cart and try again. Your order details
            haven't been passed to this page.
          </p>
          <button
            onClick={handleGoHome}
            className="mt-6 bg-[#081225] text-white px-6 py-3 rounded-xl font-bold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md md:max-w-xl mx-auto space-y-8">

        {/* Progress */}
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-4 left-8 right-8 h-[2px] bg-emerald-500" />

          {["Shipping", "Payment", "Complete"].map((step, index) => (
            <div
              key={step}
              className="flex flex-col items-center gap-1.5 z-10"
            >
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shadow-sm ${
                  index < 2
                    ? "bg-emerald-600 text-white"
                    : "bg-black text-white"
                }`}
              >
                {index < 2 ? "✓" : "3"}
              </div>
              <span
                className={`text-xs ${
                  index === 2
                    ? "font-bold text-gray-900"
                    : "font-semibold text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Confirmation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Order Placed Successfully!
            </h1>

            {orderId && (
              <p className="text-xs font-medium text-gray-500 mt-2">
                Order ID:{" "}
                <span className="font-bold text-gray-900">{orderId}</span>
              </p>
            )}
          </div>

          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-gray-100 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <Package size={16} className="text-amber-800" />
              <span>
                {order?.estimatedDelivery || "Estimated Delivery: 3 - 5 Business Days"}
              </span>
            </div>

            {paymentId && (
              <p className="text-xs text-gray-500 break-all">
                Payment ID: {paymentId}
              </p>
            )}

            {order?.paymentStatus && (
              <p className="text-xs text-gray-500">
                Payment Status: {order.paymentStatus}
              </p>
            )}
          </div>
        </div>

        {/* Actual ordered products */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
            Order Items Summary
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <Package size={22} className="text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                    {item.name}
                  </h4>

                  {item.variant && (
                    <p className="text-[11px] text-gray-400 font-medium">
                      {item.variant}
                    </p>
                  )}

                  <p className="text-[11px] text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <span className="text-xs sm:text-sm font-extrabold text-gray-900 whitespace-nowrap">
                  ₹ {item.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-black text-gray-900">
            <span>Total Paid</span>
            <span>₹ {totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Back to Home */}
        <button
          onClick={handleGoHome}
          className="w-full bg-[#081225] hover:bg-black text-white font-bold py-4 rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <Home size={18} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderCompletePage;