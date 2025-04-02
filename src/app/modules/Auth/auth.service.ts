import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import ApiError from "../../errors/ApiErrors";
import emailSender from "./emailSender";
import httpStatus from "http-status";

// user login
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData?.email) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! with this email " + payload.email
    );
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const result = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    token: accessToken,
  };
  return result;
};

// get user profile
const getMyProfile = async (userToken: string) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const userProfile = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      addressOne: true,
      addressTwo: true,
      role: true,
      email: true,
      city: true,
      country: true,
      postalCode: true,
      state: true,
    },
  });

  return userProfile;
};

// change password
const changePassword = async (
  userToken: string,
  newPassword: string,
  oldPassword: string
) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const user = await prisma.user.findUnique({
    where: { id: decodedToken?.id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user?.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const result = await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return { message: "Password changed successfully" };
};

// forget password
const forgotPassword = async (payload: { email: string; baseUrl: string }) => {
  const userData = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new ApiError(
      404,
      "No account was found with the email address you entered."
    );
  }

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  const resetPassLink =
    payload.baseUrl +
    "/reset-password" +
    `?userId=${userData.id}&token=${resetPassToken}`;
  await emailSender(
    "Reset Your Password",
    userData.email,
    `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
  <table width="100%" style="border-collapse: collapse;">
    <tr>
      <td style="background-color: #007BFF; padding: 20px; text-align: center; color: #ffffff; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">Reset Your Password</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <p style="font-size: 16px; margin: 0;">Hello <strong>${
          userData.firstName
        }</strong>,</p>
        <p style="font-size: 16px;">We received a request to reset your password. Please click the button below to proceed with resetting your password.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetPassLink}" style="
              background-color: #007BFF;
              color: white;
              padding: 12px 24px;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
              text-decoration: none;
              display: inline-block;
              cursor: pointer;">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #555;">If you did not request this change, please ignore this email. No further action is needed.</p>
        
        <p style="font-size: 16px; margin-top: 20px;">Thank you,<br>Medic Team</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888; border-radius: 0 0 10px 10px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Medic Team. All rights reserved.</p>
      </td>
    </tr>
  </table>
</div>
`
  );

  return { message: "Reset password link sent via your email successfully" };
};

// reset password
const resetPassword = async (payload: {
  token: string;
  id: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isValidToken = jwtHelpers.verifyToken(
    payload.token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
  return;
};

export const AuthServices = {
  loginUser,
  getMyProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
