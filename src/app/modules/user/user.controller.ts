import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { getUserById, UserService } from "./user.service";
import { get } from "http";
import { JwtPayload } from "jsonwebtoken";
import httpStatusCode from "http-status-codes";
import sendResponse from "../../utils/sendResponse";

const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserService.getMe(decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Your profile Retrieved Successfully",
        data: result
    })
})

export const getAllUsersController = catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.getAllUsersService();

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "All users with role USER retrieved successfully",
        data: users,
    });
});


export const getUserByIdController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await getUserById(userId);

  if (!user) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatusCode.NOT_FOUND,
      message: "User not found",
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "User retrieved successfully",
    data: user,
  });
});





export const UserController = {
    getMe,
    getAllUsersController,
    getUserByIdController
};