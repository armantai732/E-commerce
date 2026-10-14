import { Product } from "../model/productModel.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            brand,
            price,
            originalPrice,
            category,
            description,
            specifications = [],
            sizes = [],
            colors = [],
            stock,
            sku,
            images = []
        } = req.body;

        const discount = Number(originalPrice) > 0
            ? Math.round(
                ((Number(originalPrice) - Number(price)) /
                    Number(originalPrice)) * 100
            )
            : 0;

        const product = await Product.create({
            name,
            brand,
            price,
            originalPrice,
            discount,
            category,
            description,
            specifications,
            sizes,
            colors,
            stock,
            sku,
            images
        });

        res.status(201).json({
            status: true,
            message: "Product added successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


// GET ALL PRODUCTS
export const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .populate("category", "name")

        res.status(200).json({
            status: true,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        const {
            name,
            brand,
            price,
            originalPrice,
            category,
            description,
            specifications,
            sizes,
            colors,
            stock,
            sku,
            images
        } = req.body;

        if (name !== undefined) product.name = name;
        if (brand !== undefined) product.brand = brand;
        if (price !== undefined) product.price = price;
        if (originalPrice !== undefined) {
            product.originalPrice = originalPrice;
        }
        if (category !== undefined) product.category = category;
        if (description !== undefined) {
            product.description = description;
        }
        if (stock !== undefined) product.stock = stock;
        if (sku !== undefined) product.sku = sku;

        if (specifications !== undefined) {
            product.specifications = specifications;
        }

        if (sizes !== undefined) {
            product.sizes = sizes;
        }

        if (colors !== undefined) {
            product.colors = colors;
        }

        // Images: accept any number of image URLs
        if (images !== undefined) {
            product.images = images;
        }

        product.discount = Number(product.originalPrice) > 0
            ? Math.round(
                ((Number(product.originalPrice) -
                    Number(product.price)) /
                    Number(product.originalPrice)) * 100
            )
            : 0;

        await product.save();

        res.status(200).json({
            status: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


// ADD PRODUCT REVIEW
export const addProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "Please login first"
            });
        }

        if (
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                status: false,
                message: "Rating must be between 1 and 5"
            });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({
                status: false,
                message: "Please enter your review"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        const alreadyReviewed = product.reviews.some(
            (review) => review.user.toString() === userId.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                status: false,
                message: "You have already reviewed this product"
            });
        }

        product.reviews.push({
            user: userId,
            rating: Number(rating),
            comment: comment.trim()
        });

        product.totalReviews = product.reviews.length;

        product.rating = Number(
            (
                product.reviews.reduce(
                    (total, review) => total + review.rating,
                    0
                ) / product.totalReviews
            ).toFixed(1)
        );

        await product.save();

        res.status(201).json({
            status: true,
            message: "Review added successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


// GET PRODUCT REVIEWS
export const getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .select("reviews rating totalReviews")
            .populate("reviews.user", "name");

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: true,
            rating: product.rating,
            totalReviews: product.totalReviews,
            data: product.reviews
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};