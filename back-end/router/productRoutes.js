import express from "express";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

import {
    addProductReview,
    createProduct,
    deleteProduct,
    getAllProduct,
    getProductReviews,
    getSingleProduct,
    updateProduct
} from "../controler/productController.js";

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", getAllProduct);

// GET SINGLE PRODUCT
router.get("/:id", getSingleProduct);

// CREATE PRODUCT (ADMIN ONLY)
router.post(
    "/",
    verifyToken,
    isAdmin,
    createProduct
);

// UPDATE PRODUCT (ADMIN ONLY)
router.put(
    "/:id",
    verifyToken,
    isAdmin,
    updateProduct
);

// DELETE PRODUCT (ADMIN ONLY)
router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteProduct
);

// ADD REVIEW (LOGIN REQUIRED)
router.post(
    "/:id/reviews",
    verifyToken,
    addProductReview
);

// GET PRODUCT REVIEWS
router.get(
    "/:id/reviews",
    getProductReviews
);

export default router;