import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
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



export const UserController = {
    getMe
};