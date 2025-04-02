import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "../User/user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { authValidation } from "./auth.validation";

const router = express.Router();

// user login route
router.post(
  "/login",
  validateRequest(UserValidation.UserLoginValidationSchema),
  AuthController.loginUser
);

// user logout route
router.post("/logout", AuthController.logoutUser);

// get logged in user's profile route
router.get("/user", auth(), AuthController.getMyProfile);

// change user password logged in user's profile
router.put(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(authValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

// forgot password route
router.post("/forgot-password", AuthController.forgotPassword);

// reset password route
router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
