import express from "express";
import {
  upload,
  createBlog,
  getBlogs,
  deleteBlog,
  getTrandingBlogs,
  getBlogWithId,
  getUserBlogs,
  getBlogWithIdAndUpdate,
  likeBlog,       // 🔁 Add this
  markBlogAsRead,
  DeleteUserBlogs// 🔁 Add this
} from "../controllers/blog.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Upload banner
router.post("/upload/banner", protectRoute, upload);

// Create / Delete / Fetch blogs
router.post("/createNew", protectRoute, createBlog);
router.post("/delete", protectRoute, deleteBlog);
router.get("/get", protectRoute, getBlogs);
router.get("/getTrandingBlogs", protectRoute, getTrandingBlogs);

// Custom blog actions
router.post("/like/:id/:user", protectRoute, likeBlog);           // 👍 Like a blog
router.post("/read/:id/:user", protectRoute, markBlogAsRead);     // 📖 Mark as read
router.get("/all/:id", protectRoute, getUserBlogs);         // 📄 All blogs by a user
router.delete("/delete/:id", protectRoute, DeleteUserBlogs);       

// Get or update a single blog
router.get("/:id", protectRoute, getBlogWithId);
router.post("/update/:id", protectRoute, getBlogWithIdAndUpdate);

export default router;
