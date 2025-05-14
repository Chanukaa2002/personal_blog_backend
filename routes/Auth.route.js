import { Router } from "express";
import { createUser, loginUser, me,logout } from "../controller/Auth.controller.js";
import { protectRoute } from "../middleware/protect.js";
const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", protectRoute, me);
router.post("/logout", protectRoute, logout);


export default router;