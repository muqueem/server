import express from "express";
import { getProducts, getProductBySlug, seedProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/seed", seedProducts);

export default router;
