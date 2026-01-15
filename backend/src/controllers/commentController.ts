import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

// Create comment (must be logged in)
export const createComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);        // do authentication
    if (!userId) return res.status(401).json({ error: "Unauthorized" });    // if no existing user, return error

    const { productId } = req.params;       // check which product to comment on
    const { content } = req.body;           // get comment content

    if (!content) return res.status(400).json({ error: "Comment content is required" });        // if no inputs return error

    // verify product exists
    const product = await queries.getProductById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const comment = await queries.createComment({       // comment logic (store content, userID, productID)
      content,
      userId,
      productId,
    });

    res.status(201).json(comment);
  } catch (error) {         // error handling for server side issues
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// Delete comment (must be logged in - owner only)
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);     
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { commentId } = req.params;   // check which comment to delete

    // check if comment exists and belongs to user
    const existingComment = await queries.getCommentById(commentId);
    if (!existingComment) return res.status(404).json({ error: "Comment not found" });

    if (existingComment.userId !== userId) {
      return res.status(403).json({ error: "You can only delete your own comments" });
    }

    await queries.deleteComment(commentId);     // delete comment logic
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);        // error handling for server side issues
    res.status(500).json({ error: "Failed to delete comment" });
  }
};


// controllers = what happens when API is called

// commentController = comment logics