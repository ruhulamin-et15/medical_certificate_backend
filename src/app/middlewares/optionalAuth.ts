import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";
import prisma from "../../shared/prisma";
import { jwtHelpers } from "../../helpars/jwtHelpers";

const optionalAuth = (required = true, ...roles: string[]) => {
  return async (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        if (required) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized!"
          );
        } else {
          return next(); // Skip authentication if not required
        }
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      const { id, role } = verifiedUser;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
      }

      if (user.status === "BLOCKED") {
        throw new ApiError(httpStatus.FORBIDDEN, "Your account is blocked!");
      }

      req.user = verifiedUser as JwtPayload;

      if (roles.length && !roles.includes(role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized!");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default optionalAuth;
