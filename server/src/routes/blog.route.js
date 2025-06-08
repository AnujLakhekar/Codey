import express from "express"
import {upload, createBlog, getBlogs, deleteBlog, getTrandingBlogs, getBlogWithId, getUserBlogs, getBlogWithIdAndUpdate} from "../controllers/blog.js"
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router();

router.post("/upload/banner", protectRoute , upload);

router.post("/createNew", protectRoute , createBlog);
router.post("/delete", protectRoute , deleteBlog);
router.get("/get", protectRoute , getBlogs);

router.get("/getTrandingBlogs", protectRoute , getTrandingBlogs);

// ✅ Put this one first
router.get("/all/:id", protectRoute , getUserBlogs);

// 👇 This must come after
router.get("/:id", protectRoute , getBlogWithId);

router.post("/update/:id", protectRoute , getBlogWithIdAndUpdate);




export default router