import express from "express";
import { bookConsultationController } from "./bookConsultation.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/specialist-referral",
  bookConsultationController.bookConsultation
);

router.get(
  "/specialist-referral",
  auth(UserRole.ADMIN),
  bookConsultationController.getAllBookingConsultations
);
router.get(
  "/specialist-referral/:id",
  auth(UserRole.ADMIN),
  bookConsultationController.getBookingConsultation
);

export const bookConsultationRoute = router;
