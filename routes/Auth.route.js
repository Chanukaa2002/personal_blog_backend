import { Router } from "express";
import { createUser, loginUser, me,logout,init } from "../controller/Auth.controller.js";
import { protectRoute } from "../middleware/protect.js";
const router = Router();

router.post("/", init);
router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", protectRoute, me);
router.post("/logout", protectRoute, logout);


export default router;