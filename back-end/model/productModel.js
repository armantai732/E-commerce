import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    sku: {
        type: String,
        unique: String,
        required: true,
        trim: true
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: (images) =>
                images.every(
                    (image) =>
                        typeof image === "string" &&
                        image.trim().length > 0
                ),
            message: "Image URLs must be valid strings"
        }

    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    specifications: [
        {
            key: {
                type: String,
                required: true,
                trim: true
            },
            value: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    sizes: {
        type: [String],
        default: []
    },
    colors: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            code: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0,
        min: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                required: true,
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema)