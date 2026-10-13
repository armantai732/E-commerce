import { Router } from "express";
import {
    createCategory,
    getCategory,
    GetParentCategories
} from "../controler/categoryControler.js";

const categoryRouter = Router();

categoryRouter.post("/create", createCategory);

// Parent aur child dono categories
categoryRouter.get("/get", getCategory);

// Sirf parent categories
categoryRouter.get("/get/parents", GetParentCategories);

export default categoryRouter;