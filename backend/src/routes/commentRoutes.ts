import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as commentController from "../controllers/commentController";

const router = Router();

// post a comment to a product (must be logged in)
router.post("/:productId", requireAuth(), commentController.createComment);

// DELETE (must be logged in - owner only)
router.delete("/:commentId", requireAuth(), commentController.deleteComment);

export default router;



// API URLs (connect URL -> controller)