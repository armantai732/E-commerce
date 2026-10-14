import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getCategory,
    GetParentCategories,
    updateCategory
} from "../controler/categoryControler.js";
import upload from "../middleware/upload.js";

const categoryRouter = Router();

categoryRouter.post("/create", upload.single("image"), createCategory);
// Parent aur child dono categories
categoryRouter.get("/get", getCategory);

// Sirf parent categories
categoryRouter.get("/get/parents", GetParentCategories);
categoryRouter.delete("/delete/:id", deleteCategory);
categoryRouter.put("/update/:id", upload.single("image"), updateCategory);
export default categoryRouter;