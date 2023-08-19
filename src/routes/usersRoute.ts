import express from "express";
import { Router } from "express";
import * as userController from "../controllers/userController";
import verifyToken from "../middleware/verifyToken";

const router: Router = express.Router();

router.post("/user", userController.createUser);
router.post("/login", userController.loginUser);

// Protected routes
router.get("/users", verifyToken, userController.getAllUsers);
router.get("/users/:id", verifyToken, userController.getUserById);
router.put("/users/:id", verifyToken, userController.updateUser);
router.delete("/users/:id", verifyToken, userController.deleteUser);

export default router;
