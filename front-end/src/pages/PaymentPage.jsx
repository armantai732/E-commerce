import React, { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import OrderCompletePage from "./OrderCompletePage";
import { createOrder, verifyResponse } from "../api/api";
import { useNavigate } from "react-router-dom";


const PaymentPage = ({
  selectedAddress,
  orderItems = [],
  subtotal = 0,
  shipping = 0,
  total,
}) => {

  const [loading, setLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const navigate = useNavigate("")
  // Actual amount from CheckoutPage
  const totalAmount = Number(total ?? subtotal + shipping);

  const handlePayNow = async () => {
    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    if (totalAmount <= 0) {
      alert("Invalid payment amount.");
      return;
    }


    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      alert("Razorpay Key ID missing. Check frontend .env");
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // 1. Create order on backend
      const data = await createOrder(totalAmount);

      if (!data.success || !data.order?.id) {
        throw new Error(data.message || "Unable to create order.");
      }


      // 2. Open Razorpay Checkout
      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "ShopNest",
        description: "Shopping Order",
        order_id: data.order.id,

        prefill: {
          name: selectedAddress?.name || "",
          contact: selectedAddress?.phone || "",
        },

        theme: {
          color: "#081225",
        },

        // 3. Verify payment on backend

        handler: async (paymentResponse) => {
          try {
            const addressText = selectedAddress
              ? [
                selectedAddress.name,
                selectedAddress.street || selectedAddress.address,
                selectedAddress.city,
                selectedAddress.state,
                selectedAddress.pincode || selectedAddress.zipCode,
                selectedAddress.phone || selectedAddress.mobile,
              ]
                .filter(Boolean)
                .join(", ")
              : "";

            if (!addressText) {
              throw new Error("Please select a valid shipping address.");
            }

            // Backend payment verify + MongoDB order create + cart clear
            const result = await verifyResponse(
              paymentResponse,
              [
                selectedAddress?.name,
                selectedAddress?.street || selectedAddress?.address,
                selectedAddress?.city,
                selectedAddress?.state,
                selectedAddress?.pincode || selectedAddress?.zipCode,
                selectedAddress?.phone || selectedAddress?.mobile,
              ].filter(Boolean).join(", ")
            );

            if (!result.success || !result.order) {
              throw new Error(
                result.message || "Unable to save order in database."
              );
            }

            // No localStorage order saving here
            localStorage.setItem(
              "lastOrder",
              JSON.stringify(result.order)
            );

            navigate("/order-complete", {
              state: { order: result.order },
              replace: true,
            });
          } catch (error) {
            console.error("Order placement error:", error);
            alert(error.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },


        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        alert(
          response.error?.description || "Payment failed. Try again."
        );
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert(error.message || "Unable to start payment.");
      setLoading(false);
    }
  };

  // Successful payment screen
  if (isOrderPlaced) {
    return (
      <OrderCompletePage
        onGoHome={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md md:max-w-xl mx-auto space-y-8">

        {/* Progress Steps */}
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-4 left-8 right-8 h-[2px] bg-gray-200" />

          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              ✓
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Shipping
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-8 h-8 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <span className="text-xs font-bold text-gray-900">
              Payment
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-500 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <span className="text-xs font-medium text-gray-400">
              Complete
            </span>
          </div>
        </div>

        {/* Payment Gateway */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
          <h2 className="text-base font-extrabold text-gray-900">
            Select Payment Method
          </h2>

          <div className="border border-gray-900 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">
                Razorpay Secure Checkout
              </p>

              <p className="text-xs text-gray-500 mt-1">
                UPI, Google Pay, PhonePe, Cards and Net Banking
              </p>
            </div>

            <span className="text-xs font-bold text-emerald-600">
              Secure
            </span>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
          <h2 className="font-extrabold text-gray-900">
            Order Summary ({orderItems.length})
          </h2>

          {orderItems.map((item) => {
            const name =
              item.name || item.product?.name || "Product";

            const price = Number(
              item.price || item.product?.price || 0
            );

            const quantity = Number(item.quantity || 1);

            return (
              <div
                key={item.id || item._id}
                className="flex justify-between gap-3 text-sm"
              >
                <span className="text-gray-600">
                  {name} × {quantity}
                </span>

                <span className="font-semibold whitespace-nowrap">
                  ₹{(price * quantity).toLocaleString("en-IN")}
                </span>
              </div>
            );
          })}

          <div className="border-t pt-3 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>
              ₹{Number(subtotal).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>
              {shipping === 0
                ? "Free"
                : `₹${Number(shipping).toLocaleString("en-IN")}`}
            </span>
          </div>

          <div className="border-t pt-4 flex justify-between items-center font-extrabold text-gray-900">
            <span>Total Payable</span>
            <span className="text-lg">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Lock size={14} />
            <span>Secure payment through Razorpay</span>
          </div>
        </section>

        {/* Pay Button */}
        <button
          type="button"
          onClick={handlePayNow}
          disabled={loading}
          className="w-full bg-[#081225] hover:bg-black text-white font-bold py-4 rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-md disabled:opacity-60"
        >
          {loading
            ? "Processing..."
            : `Pay ₹${totalAmount.toLocaleString("en-IN")} with Razorpay`}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;