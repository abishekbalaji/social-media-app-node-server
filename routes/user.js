import { Router } from "express";

import {
  getUser,
  getUserFriends,
  toggleFriend,
} from "../controllers/user.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/:id", verifyToken, getUser);

router.get("/:id/friends", verifyToken, getUserFriends);

router.patch("/:id/:friendId", verifyToken, toggleFriend);

export default router;
