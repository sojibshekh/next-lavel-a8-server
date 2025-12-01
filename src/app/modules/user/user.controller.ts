import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";


const createUser = catchAsync(async(req: Request,res:Response)=>{
    const payload = req.body;
 
})


export const UserController = {
    createUser
};