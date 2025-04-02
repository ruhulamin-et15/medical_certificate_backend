import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createCouponCode = async (payload: any) => {
  if (payload.codeKey) {
    payload.codeKey = payload.codeKey;
  }
  const coupon = await prisma.coupon.create({
    data: payload,
  });

  return coupon;
};

const getActiveCouponFromDB = async () => {
  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
    },
  });

  return coupons[0];
};

const getAllCouponCode = async () => {
  const coupons = await prisma.coupon.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return coupons;
};

const getCouponCode = async (codeKey: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      codeKey: codeKey,
    },
  });

  if (!coupon) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Coupon code invalid or not found!"
    );
  }

  const currentDate = new Date();
  if (coupon.valid < currentDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Coupon code has expired!");
  }

  return coupon;
};

const activeCouponIntoDB = async (id: string) => {
  await prisma.coupon.update({
    where: {
      id: id,
    },
    data: {
      isActive: true,
    },
  });

  const coupon = await prisma.coupon.updateMany({
    where: {
      id: {
        not: id,
      },
    },
    data: {
      isActive: false,
    },
  });

  return coupon;
};

const updateCouponCodeIntoDB = async (payload: any, id: string) => {
  const result = await prisma.coupon.update({
    where: {
      id: id,
    },
    data: payload,
  });

  return result;
};

const deleteCouponCodeFromDB = async (id: string) => {
  const result = await prisma.coupon.delete({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon code not found!");
  }

  if (result.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot delete active coupon!");
  }

  return;
};

export const CouponCodeServices = {
  createCouponCode,
  getActiveCouponFromDB,
  getCouponCode,
  getAllCouponCode,
  activeCouponIntoDB,
  updateCouponCodeIntoDB,
  deleteCouponCodeFromDB,
};
