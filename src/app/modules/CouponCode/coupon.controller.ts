import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CouponCodeServices } from "./coupon.service";
import { Request, Response } from "express";

const createCouponCode = catchAsync(async (req, res) => {
  const result = await CouponCodeServices.createCouponCode(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Coupon code created successfully",
    data: result,
  });
});

const getActiveCoupon = catchAsync(async (req, res) => {
  const coupon = await CouponCodeServices.getActiveCouponFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon codes retrieved successfully",
    data: coupon,
  });
});

const getCouponCodeKey = catchAsync(async (req, res) => {
  const { codeKey } = req.body;

  const coupon = await CouponCodeServices.getCouponCode(codeKey);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon code retrieved successfully",
    data: coupon,
  });
});

const getAllCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await CouponCodeServices.getAllCouponCode();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All coupon code retrive successfully",
    data: coupon,
  });
});

const activeCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponCodeServices.activeCouponIntoDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "update coupon",
    data: result,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponCodeServices.updateCouponCodeIntoDB(req.body, id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "update coupon",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponCodeServices.deleteCouponCodeFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "deleted the coupon successfully",
    data: result,
  });
});

export const CouponCodeControllers = {
  createCouponCode,
  getActiveCoupon,
  getCouponCodeKey,
  getAllCoupon,
  activeCoupon,
  updateCoupon,
  deleteCoupon,
};
