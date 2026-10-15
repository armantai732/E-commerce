
import React, { useState, useEffect, useCallback } from "react";
import { Trash2, X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [error, setError] = useState("");

    // Fetch cart
    const fetchCart = useCallback(async (showLoading = true) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setCartItems([]);
            setError("Please login to view your cart.");
            setLoading(false);
            return;
        }

        try {
            if (showLoading) setLoading(true);
            setError("");

            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load cart.");
            }

            setCartItems(Array.isArray(data.items) ? data.items : []);
        } catch (err) {
            console.error("Fetch cart error:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Update quantity: no fixed maximum of 5
    const handleQuantityChange = async (item, delta) => {
        const currentQuantity = Number(item.quantity) || 1;
        const newQuantity = currentQuantity + delta;

        if (newQuantity < 1) return;

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first.");
            return;
        }

        try {
            setUpdatingItem(item.id);

            const response = await fetch(
                `${API_BASE_URL}/cart/${item.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        quantity: newQuantity,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to update quantity."
                );
            }

            await fetchCart(false);
        } catch (err) {
            console.error("Quantity update error:", err);
            alert(err.message || "Unable to update quantity.");
        } finally {
            setUpdatingItem(null);
        }
    };

    // Remove item
    const handleRemoveItem = async (itemId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first.");
            return;
        }

        try {
            setUpdatingItem(itemId);

            const response = await fetch(
                `${API_BASE_URL}/cart/${itemId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to remove product."
                );
            }

            await fetchCart(false);
        } catch (err) {
            console.error("Remove cart item error:", err);
            alert(err.message || "Unable to remove product.");
        } finally {
            setUpdatingItem(null);
        }
    };

    // Price calculations
    const subtotal = cartItems.reduce(
        (acc, item) =>
            acc + Number(item.price || 0) * Number(item.quantity || 0),
        0
    );

    const shipping = 0;
    const total = subtotal + shipping;

    const formatPrice = (price) =>
        Number(price || 0).toLocaleString("en-IN");

    // Loading
    if (loading) {
        return (
            <div className="w-full bg-[#FAF9F6] min-h-screen py-20 px-4">
                <div className="max-w-md md:max-w-xl mx-auto text-center">
                    <ShoppingBag
                        size={32}
                        className="mx-auto mb-4 text-gray-400"
                    />
                    <p className="text-gray-500 font-medium">
                        Loading your cart...
                    </p>
                </div>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4">
                <div className="max-w-md md:max-w-xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm space-y-4">
                        <ShoppingBag
                            size={32}
                            className="mx-auto text-gray-400"
                        />

                        <p className="text-red-500 text-sm font-medium">
                            {error}
                        </p>

                        {!localStorage.getItem("token") ? (
                            <Link
                                to="/login"
                                className="inline-block bg-[#081225] text-white px-6 py-3 rounded-xl text-sm font-bold"
                            >
                                Login
                            </Link>
                        ) : (
                            <button
                                onClick={() => fetchCart()}
                                className="bg-[#081225] text-white px-6 py-3 rounded-xl text-sm font-bold"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md md:max-w-xl mx-auto space-y-6">

                {/* Cart Header */}
                <div className="flex items-center justify-between pb-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        Your Cart ({cartItems.length})
                    </h1>

                    <ShoppingBag size={20} className="text-gray-400" />
                </div>

                {/* Cart Items */}
                {cartItems.length > 0 ? (
                    <div className="space-y-4">
                        {cartItems.map((item) => {
                            const variant = [
                                item.size ? `Size: ${item.size}` : "",
                                item.color ? `Color: ${item.color}` : "",
                            ]
                                .filter(Boolean)
                                .join(" | ");

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-3 relative transition-all"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-2">
                                        <img
                                            src={
                                                item.image ||
                                                "https://placehold.co/300x300?text=Product"
                                            }
                                            alt={item.name || "Product"}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    </div>

                                    {/* Product Information */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                                                    {item.name}
                                                </h3>

                                                {variant && (
                                                    <p className="text-xs text-gray-400 font-medium mt-1">
                                                        {variant}
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                                disabled={
                                                    updatingItem === item.id
                                                }
                                                className="text-gray-300 hover:text-gray-600 transition-colors disabled:opacity-40"
                                                aria-label="Remove product"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Price and Quantity */}
                                        <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
                                            <span className="text-base font-extrabold text-gray-900">
                                                ₹ {formatPrice(item.price)}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item,
                                                                -1
                                                            )
                                                        }
                                                        disabled={
                                                            updatingItem === item.id ||
                                                            item.quantity <= 1
                                                        }
                                                        className="text-gray-500 font-bold hover:text-black text-sm disabled:opacity-30"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="text-xs font-bold text-gray-900 min-w-[24px] text-center tabular-nums">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item,
                                                                1
                                                            )
                                                        }
                                                        disabled={
                                                            updatingItem === item.id
                                                        }
                                                        className="text-gray-500 font-bold hover:text-black text-sm disabled:opacity-30"
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        handleRemoveItem(item.id)
                                                    }
                                                    disabled={
                                                        updatingItem === item.id
                                                    }
                                                    className="text-gray-400 hover:text-red-500 p-1 transition-colors disabled:opacity-40"
                                                    aria-label="Delete product"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500">
                                            Item total: ₹{" "}
                                            {formatPrice(
                                                Number(item.price || 0) *
                                                Number(item.quantity || 0)
                                            )}
                                        </p>

                                        {updatingItem === item.id && (
                                            <p className="text-xs text-gray-400">
                                                Updating...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Price Details */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3 mt-6">
                            <h2 className="text-base font-bold text-gray-900 mb-2">
                                Price Details
                            </h2>

                            <div className="flex justify-between text-sm text-gray-600 font-medium">
                                <span>Subtotal</span>
                                <span className="text-gray-900 font-bold">
                                    ₹ {formatPrice(subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600 font-medium">
                                <span>Shipping</span>
                                <span className="text-gray-900 font-bold">
                                    ₹ {formatPrice(shipping)}
                                </span>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-lg font-extrabold text-gray-900">
                                <span>Total</span>
                                <span>₹ {formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Checkout */}
                        <Link
                            to="/check-out"
                            className="block w-full bg-[#081225] hover:bg-black text-white text-center font-bold py-4 rounded-xl text-sm transition-all shadow-md active:scale-[0.99] mt-4"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                ) : (
                    /* Empty Cart */
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
                        <ShoppingBag
                            size={36}
                            className="mx-auto text-gray-300"
                        />

                        <p className="text-gray-500 font-medium text-sm">
                            Your cart is empty!
                        </p>

                        <Link
                            to="/product"
                            className="inline-block bg-[#081225] hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
