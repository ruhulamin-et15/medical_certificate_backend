import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { IUser, IUserFilterRequest } from "./user.interface";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import emailSender from "../Auth/emailSender";

// Create a new user in the database.
const createUserIntoDb = async (payload: IUser) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new ApiError(
      400,
      `User with this email ${payload.email}  already exists`
    );
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  await emailSender(
    "Registration Successful",
    payload.email,
    `
      <h1>Registration Successful</h1>
      <p>Dear ${payload.firstName}${" "}${payload?.lastName},</p>
      <p>Thank you for registering with our platform. We are excited to have you as a part of our community.</p>
      <p>Here are some important details to keep in mind:</p>
      <ul>
        <li>Your email address: ${payload.email}</li>
      </ul>
      <p>Please make sure to keep your password secure and do not share it with anyone.</p>
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      <p>Best regards,</p>
      <p>Medic Team</p>
    `
  );

  return result;
};

// reterive all users from the database
const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0
      ? {
          AND: andCondions,
        }
      : {};

  const result = await prisma.user.findMany({
    where: { ...whereConditons },
    skip: skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  // if (!result || result.length === 0) {
  //   throw new ApiError(404, "No active users found");
  // }

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new ApiError(404, "User not found");
  }

  return result;
};

// update user profile by logged in user
const updateProfileIntoDb = async (user: IUser, payload: IUser) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userInfo) {
    throw new ApiError(404, "User not found");
  }

  if (payload.email && payload.email !== user.email) {
    if (userInfo) {
      throw new ApiError(
        400,
        `User with this email ${payload.email} already exists`
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      addressOne: payload.addressOne,
      addressTwo: payload.addressTwo,
      city: payload.city,
      postalCode: payload.postalCode,
      state: payload.state,
      country: payload.country,
    },
  });

  return updatedUser;
};

// update specialist profile by logged in speacialist
const updateSpeacialistProfileIntoDb = async (user: IUser, payload: IUser) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userInfo) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: payload,
  });

  return updatedUser;
};

// update  user status and role by admin
const updateUserIntoDb = async (payload: IUser, id: string) => {
  // Retrieve the existing user info
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  // Update the user with the provided payload
  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      status: payload.status || userInfo.status,
      role: payload.role || userInfo.role,
    },
  });

  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getByIdUser,
  updateProfileIntoDb,
  updateSpeacialistProfileIntoDb,
  updateUserIntoDb,
};
