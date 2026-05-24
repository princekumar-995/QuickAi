import express from "express";
import { requireBlogAuth } from "../middlewares/blogAuth.js";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  bookmarkBlog,
  getBookmarkedBlogs,
  addComment,
  deleteComment,
  addRating,
  newsletterSubscribe,
  getAdminStats,
  createCategory,
  deleteCategory,
  getCategories,
  getMyBlogs,
  generateBlogAI
} from "../controllers/blogController.js";

const blogRouter = express.Router();

// Public routes
blogRouter.get("/", getAllBlogs);
blogRouter.get("/categories", getCategories);
blogRouter.post("/newsletter", newsletterSubscribe);
blogRouter.get("/:id", getBlogById);

// Authenticated user routes
blogRouter.get("/author/list", requireBlogAuth, getMyBlogs);
blogRouter.get("/bookmarked", requireBlogAuth, getBookmarkedBlogs);
blogRouter.post("/", requireBlogAuth, createBlog);
blogRouter.put("/:id", requireBlogAuth, updateBlog);
blogRouter.delete("/:id", requireBlogAuth, deleteBlog);

// Interactions
blogRouter.post("/:id/like", requireBlogAuth, likeBlog);
blogRouter.post("/:id/bookmark", requireBlogAuth, bookmarkBlog);
blogRouter.post("/:id/comments", requireBlogAuth, addComment);
blogRouter.delete("/comments/:commentId", requireBlogAuth, deleteComment);
blogRouter.post("/:id/rate", requireBlogAuth, addRating);

// AI features
blogRouter.post("/ai/generate", requireBlogAuth, generateBlogAI);

// Admin routes
blogRouter.get("/admin/stats", requireBlogAuth, getAdminStats);
blogRouter.post("/categories", requireBlogAuth, createCategory);
blogRouter.delete("/categories/:id", requireBlogAuth, deleteCategory);

export default blogRouter;
