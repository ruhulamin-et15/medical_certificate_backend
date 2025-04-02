import * as express from "express";
import { CouponCodeControllers } from "./coupon.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  CouponCodeControllers.createCouponCode
);
router.get("/all", auth(UserRole.ADMIN), CouponCodeControllers.getAllCoupon);
router.put(
  "/active/:id",
  auth(UserRole.ADMIN),
  CouponCodeControllers.activeCoupon
);
router.put("/:id", auth(UserRole.ADMIN), CouponCodeControllers.updateCoupon);

router.get("/", CouponCodeControllers.getActiveCoupon);
router.post("/valid", CouponCodeControllers.getCouponCodeKey);
router.delete("/:id", auth(UserRole.ADMIN), CouponCodeControllers.deleteCoupon);

export const couponCodeRoutes = router;
