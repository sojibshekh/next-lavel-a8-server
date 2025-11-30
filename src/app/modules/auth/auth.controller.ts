import { Request, Response } from "express";

import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import catchAsync from "../../shared/catchAsync";
import { StatusCodes } from "http-status-codes";


const login = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthService.login();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Log In Successfully!",
        data: result
    })
});



export const AuthControllers = {
    login,
}