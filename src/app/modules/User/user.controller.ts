import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.services";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.costant";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUserIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Registered successfully!",
    data: result,
  });
});

// get all user form db
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userService.getUsersFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieve successfully!",
    data: result,
  });
});

const getByIdUser = catchAsync(async (req: Request, res: Response) => {

  const id = req.params.id;
  const result = await userService.getByIdUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieve successfully!",
    data: result,
  });

});

// update user profile by logged in user
const updateProfile = catchAsync(async (req: any, res: Response) => {
  const user = req?.user;

  const result = await userService.updateProfileIntoDb(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully!",
    data: result,
  });
});

// update specialist profile by logged in speacialist
const updateSpeacialistProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req?.user;

    const result = await userService.updateSpeacialistProfileIntoDb(
      user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Speacialist profile updated successfully!",
      data: result,
    });
  }
);

// update  user status and role by admin
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await userService.updateUserIntoDb(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully!",
    data: result,
  });
});

export const userController = {
  createUser,
  getUsers,
  getByIdUser,
  updateProfile,
  updateSpeacialistProfile,
  updateUser,
};




// # EMAIL = "ruhulamin.et15@gmail.com"
// # APP_PASS = "klie dcfc balg rgtm"
// # CONTACT_MAIL_ADDRESS = "ruhulamin.et15@gmail.com"