import { Router } from "express";
import * as productController from "../controllers/productController";
import { requireAuth } from "@clerk/express";

const router = Router();

// GET all products (no login required)
router.get("/", productController.getAllProducts);      // find productController file, then getAllProducts route

// GET my products only (must be logged in)
router.get("/my", requireAuth(), productController.getMyProducts);

// GET 1 product by ID (no login required)
router.get("/:id", productController.getProductById);

// create a product (must be logged in)
router.post("/", requireAuth(), productController.createProduct);

// update a product (must be logged in, owner only)
router.put("/:id", requireAuth(), productController.updateProduct);

// delete a product (must be logged in, owner only)
router.delete("/:id", requireAuth(), productController.deleteProduct);

export default router;
