import crypto from 'crypto'
import razorpay from '../config/razorpay.js';
import Payment from '../model/paymentModel.js';
import Cart from "../model/cartModel.js";
import Order from "../model/orderModel.js";

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required"
            })
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        }

        const order = await razorpay.orders.create(options);

        const payment = await Payment.create({
            user: req.user._id,
            orderId: order.id,
            amount: Number(amount),
            currency: "INR",
            status: "created"
        });

        res.status(200).json({
            success: true,
            message: "Order created succesfully!",
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            paymentId: payment._id
        })
    } catch (error) {
        console.log("Create order Error: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        })
    }
}



export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddress,
        } = req.body;

        // 1. Verify payment
        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        // 2. Update payment
        const payment = await Payment.findOneAndUpdate(
            {
                orderId: razorpay_order_id,
                user: req.user._id,
            },
            {
                paymentId: razorpay_payment_id,
                status: "success",
            },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found",
            });
        }

        // 3. Get cart
        const cart = await Cart.findOne({
            user: req.user._id,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        // Prevent duplicate order
        const existingOrder = await Order.findOne({
            user: req.user._id,
            razorpayOrderId: razorpay_order_id,
        });

        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Order already exists",
                order: existingOrder,
            });
        }

        // 4. Prepare order items
        const items = cart.items
            .filter((item) => item.product)
            .map((item) => ({
                product: item.product._id,
                name: item.product.name,
                image: item.product.images?.[0] || item.product.image || "",
                price: Number(item.product.price || 0),
                quantity: item.quantity,
                size: item.size || "",
                color: item.color || "",
                variant: [item.size, item.color].filter(Boolean).join(" / "),
            }));

        if (!items.length) {
            return res.status(400).json({
                success: false,
                message: "No products found in cart",
            });
        }

        const totalAmount = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const addressText =
            typeof shippingAddress === "string"
                ? shippingAddress
                : [
                    shippingAddress?.name || shippingAddress?.fullName,
                    shippingAddress?.street || shippingAddress?.address,
                    shippingAddress?.city,
                    shippingAddress?.state,
                    shippingAddress?.pincode || shippingAddress?.zipCode,
                    shippingAddress?.phone || shippingAddress?.mobile,
                ].filter(Boolean).join(", ");

        if (!addressText) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required",
            });
        }

        // 5. Save order in MongoDB
        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress: addressText,
            paymentMethod: "Razorpay",
            paymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            status: "Processing",
            paymentStatus: "Paid",
        });

        // 6. Clear cart
        cart.items = [];
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified and order saved",
            order,
        });
    } catch (error) {
        console.log("Verify Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};