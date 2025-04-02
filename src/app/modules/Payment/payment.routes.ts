import express from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { blockPostmanRequests } from "../../middlewares/postman";

const router = express.Router();

router.post("/create/:orderId/:userId", paymentController.checkoutSession);
router.get("/", auth(UserRole.ADMIN), paymentController.getTransactions);
router.get(
  "/retrive-payment/:sessionId",
  paymentController.reteriveSessionById
);
router.get(
  "/total-earnings",
  auth(UserRole.ADMIN),
  blockPostmanRequests,
  paymentController.totalEarnings
);
router.get(
  "/today-earnings",
  auth(UserRole.ADMIN),
  paymentController.todaysEarning
);

//for admin
router.get("/single-transaction/:id", paymentController.getSingleTransaction);

//for logged in user
router.get(
  "/logged-user-transactions",
  auth(),
  paymentController.getTransactionForLoggedUser
);

//for logged in user
router.get("/transaction/:id", auth(), paymentController.getTransaction);

router.get(
  "/check-payment-status/:orderId",
  paymentController.checkPaymentStatus
);

export const paymentRoutes = router;
