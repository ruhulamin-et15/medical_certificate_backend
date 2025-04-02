import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { bookConsultationRoute } from "../modules/BookConsultation/bookConsultation.routes";
import { certificateRoutes } from "../modules/Certificate/certificate.routes";
import { paymentRoutes } from "../modules/Payment/payment.routes";
import { couponCodeRoutes } from "../modules/CouponCode/coupon.route";
import { contactRoutes } from "../modules/contact/contact.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/certificate",
    route: bookConsultationRoute,
  },

  {
    path: "/certificate",
    route: certificateRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },

  {
    path: "/coupon",
    route: couponCodeRoutes,
  },
  {
    path: "/contact",
    route: contactRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
