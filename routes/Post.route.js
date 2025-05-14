import { Router } from "express";
import {
  createPost,
  deletePost,
  updatePost,
  getPost,
  getAllPost,
  getByTagPost,
  getByTitlePost,
} from "../controller/Post.controller.js";
import { protectRoute } from "../middleware/protect.js";
const router = Router();

router.post("/", protectRoute, createPost);
router.get("/all", getAllPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/:id", protectRoute, updatePost);
router.get("/id/:id", getPost);

router.get("/tag/:tag", getByTagPost);
router.get("/title/:title", getByTitlePost);

export default router;
