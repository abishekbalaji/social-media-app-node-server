import { Router } from "express";

import {
  getFeedPosts,
  getUserPosts,
  toggleLike,
} from "../controllers/posts.js";

import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/getFeed", verifyToken, getFeedPosts);

router.get("/:userId", verifyToken, getUserPosts);

router.patch("/:id/like", verifyToken, toggleLike);

export default router;
