import express from "express";
import {getUser, login, logout, register, updatePassword, updateProfile,forgotPassword, resetPassword} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);

router.post("/forgot/password", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;