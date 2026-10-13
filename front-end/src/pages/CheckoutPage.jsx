import React, { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaymentPage from "./PaymentPage";
import { getAddresses, getCart } from "../api/api";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Empty address form
const emptyAddress = {
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
};

const CheckoutPage = () => {
    const navigate = useNavigate();

    // States
    const [addresses, setAddresses] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [form, setForm] = useState(emptyAddress);
    const [showForm, setShowForm] = useState(false);
    const [payment, setPayment] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Token for API requests
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    // Load addresses and cart
    useEffect(() => {
        const loadData = async () => {
            if (!localStorage.getItem("token")) {
                navigate("/auth");
                return;
            }

            try {
                const addressData = await getAddresses();
                const cartData = await getCart();

                const savedAddresses = addressData.addresses || [];
                const savedCart = cartData.items || [];

                setAddresses(savedAddresses);
                setCartItems(savedCart);

                // Select default address, or first address
                const defaultAddress = savedAddresses.find(
                    (address) => address.isDefault
                );

                setSelectedAddress(
                    defaultAddress?._id || savedAddresses[0]?._id || ""
                );

                // Show form if no address exists
                if (savedAddresses.length === 0) {
                    setShowForm(true);
                }
            } catch (err) {
                setError(err.message || "Failed to load checkout data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    // Update address form
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    // Save new address
    const addAddress = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${API}/address`, {
                method: "POST",
                headers,
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Address save failed.");
            }

            let newAddress = data.address;

            // Refresh addresses if API does not return the saved address
            if (!newAddress?._id) {
                const refreshResponse = await fetch(`${API}/address`, {
                    headers,
                });

                const refreshData = await refreshResponse.json();

                if (!refreshResponse.ok) {
                    throw new Error("Failed to refresh addresses.");
                }

                const updatedAddresses = refreshData.addresses || [];

                setAddresses(updatedAddresses);
                newAddress = updatedAddresses[0];
            } else {
                setAddresses((oldAddresses) => [
                    newAddress,
                    ...oldAddresses,
                ]);
            }

            // Select the newly saved address
            if (newAddress?._id) {
                setSelectedAddress(newAddress._id);
            }

            setForm(emptyAddress);
            setShowForm(false);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    };

    // Get selected address
    const selected = addresses.find(
        (address) => address._id === selectedAddress
    );

    // Calculate total price
    const subtotal = cartItems.reduce((total, item) => {
        const price = Number(item.price || item.product?.price || 0);
        const quantity = Number(item.quantity || 1);

        return total + price * quantity;
    }, 0);

    // Format price in Indian number format
    const money = (amount) =>
        Number(amount || 0).toLocaleString("en-IN");

    // Loading screen
    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
                Loading checkout...
            </div>
        );
    }

    // Payment page
    if (payment) {
        return (
            <PaymentPage
                selectedAddress={selected}
                orderItems={cartItems}
                subtotal={subtotal}
                shipping={0}
                total={subtotal}
            />
        );
    }

    return (
        <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 font-sans">
            <div className="max-w-md md:max-w-xl mx-auto space-y-8">

                {/* Progress Steps */}
                <div className="flex justify-between px-2">
                    {["Shipping", "Payment", "Complete"].map(
                        (step, index) => (
                            <div key={step} className="text-center">
                                <div
                                    className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        index === 0
                                            ? "bg-black text-white"
                                            : "bg-white border text-gray-500"
                                    }`}
                                >
                                    {index + 1}
                                </div>

                                <p className="text-xs mt-2">{step}</p>
                            </div>
                        )
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">
                        {error}
                    </p>
                )}

                {/* Shipping Address */}
                <section className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-extrabold">
                            Shipping Address
                        </h2>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="text-xs underline flex items-center gap-1"
                        >
                            <Plus size={14} />
                            Add New Address
                        </button>
                    </div>

                    {/* Saved Addresses */}
                    {addresses.map((address) => (
                        <button
                            key={address._id}
                            onClick={() =>
                                setSelectedAddress(address._id)
                            }
                            className={`w-full text-left bg-white rounded-2xl p-5 border ${
                                selectedAddress === address._id
                                    ? "border-black ring-1 ring-black"
                                    : "border-gray-200"
                            }`}
                        >
                            <div className="flex gap-3">
                                <CheckCircle2
                                    size={19}
                                    className={
                                        selectedAddress === address._id
                                            ? "text-black"
                                            : "text-gray-300"
                                    }
                                />

                                <div className="text-sm space-y-1">
                                    <p className="font-bold">
                                        {address.name}
                                    </p>

                                    <p className="text-gray-600">
                                        {address.street}
                                    </p>

                                    <p className="text-gray-600">
                                        {address.city}, {address.state} -{" "}
                                        {address.pincode}
                                    </p>

                                    <p className="text-gray-600">
                                        <MapPin
                                            size={13}
                                            className="inline"
                                        />{" "}
                                        {address.phone}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}

                    {/* New Address Form */}
                    {showForm && (
                        <form
                            onSubmit={addAddress}
                            className="bg-white p-5 rounded-2xl border space-y-3"
                        >
                            <h3 className="font-bold">New Address</h3>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                required
                                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-black"
                            />

                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="10-digit Mobile"
                                type="tel"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                required
                                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-black"
                            />

                            <input
                                name="street"
                                value={form.street}
                                onChange={handleChange}
                                placeholder="House No. / Street / Area"
                                required
                                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-black"
                            />

                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-black"
                            />

                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                placeholder="State"
                                required
                                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-black"
                            />

                            <input
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                placeholder="6-digit PIN Code"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                required
                                className="w-full border rounded-xl p-3 text-sm outline-none focus:border-black"
                            />

                            <button
                                type="submit"
                                className="w-full bg-black text-white rounded-xl py-3 font-bold"
                            >
                                Save Address
                            </button>
                        </form>
                    )}
                </section>

                {/* Order Summary */}
                <section className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
                    <h2 className="font-extrabold">
                        Order Summary ({cartItems.length})
                    </h2>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-500">
                                Your cart is empty.
                            </p>

                            <button
                                onClick={() => navigate("/shop")}
                                className="underline mt-2 text-sm"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => {
                            const name =
                                item.name || item.product?.name || "Product";

                            const image =
                                item.image ||
                                item.product?.images?.[0] ||
                                "https://placehold.co/100";

                            const price = Number(
                                item.price || item.product?.price || 0
                            );

                            const quantity = Number(item.quantity || 1);

                            return (
                                <div
                                    key={item.id || item._id}
                                    className="flex items-center gap-3"
                                >
                                    <img
                                        src={image}
                                        alt={name}
                                        className="w-14 h-14 rounded-xl object-contain bg-gray-100 p-1"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold">
                                            {name}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            {item.size &&
                                                `Size: ${item.size}`}
                                            {item.size && item.color && " | "}
                                            {item.color &&
                                                `Color: ${item.color}`}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Qty: {quantity}
                                        </p>
                                    </div>

                                    <p className="text-sm font-bold whitespace-nowrap">
                                        ₹{money(price * quantity)}
                                    </p>
                                </div>
                            );
                        })
                    )}

                    {/* Total Price */}
                    <div className="border-t pt-4 flex justify-between font-black text-lg">
                        <span>Total</span>
                        <span>₹{money(subtotal)}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                        Shipping: Free
                    </p>
                </section>

                {/* Continue to Payment */}
                <button
                    disabled={!selected || cartItems.length === 0}
                    onClick={() => {
                        if (!selected) {
                            setError(
                                "Please add or select a shipping address."
                            );
                            setShowForm(true);
                            return;
                        }

                        if (cartItems.length === 0) {
                            setError("Your cart is empty.");
                            return;
                        }

                        setError("");
                        setPayment(true);
                    }}
                    className="w-full bg-[#081225] hover:bg-black text-white font-bold py-4 rounded-xl text-sm shadow-md disabled:opacity-50"
                >
                    {!selected
                        ? "Add / Select Address to Continue"
                        : "Continue to Payment"}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;