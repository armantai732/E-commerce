import { Category } from "../model/categoryModel.js";

// CREATE CATEGORY
export const createCategory = async (req, res) => {
    try {
        const { name, image, parentCategory } = req.body;

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const category = await Category.create({
            name,
            slug,
            image,
            parentCategory: parentCategory || null
        });

        return res.status(201).json({
            status: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// GET ALL CATEGORIES — Parent + Child
export const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();

        return res.status(200).json({
            status: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// GET ONLY PARENT CATEGORIES
export const GetParentCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            $or: [
                { parentCategory: null },
                { parentCategory: { $exists: false } }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};