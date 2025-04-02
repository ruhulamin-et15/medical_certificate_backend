import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// register user
router.post(
  "/register",
  validateRequest(UserValidation.CreateUserValidationSchema),
  userController.createUser
);

// get all  user
router.get("/", auth(UserRole.ADMIN), userController.getUsers);

// get single user
router.get("/:id", auth(UserRole.ADMIN), userController.getByIdUser);

// update user profile by logged in user
router.patch("/user-profile", auth(), userController.updateProfile);

// update specialist profile by logged in speacialist
router.patch(
  "/specialist-profile",
  validateRequest(UserValidation.CreateUserValidationSchema),
  auth(UserRole.SPECIALIST),
  userController.updateSpeacialistProfile
);

// update  user status and role by admin
router.patch(
  "/update-user-profile/:id",
  auth(UserRole.ADMIN),
  userController.updateUser
);

export const userRoutes = router;
