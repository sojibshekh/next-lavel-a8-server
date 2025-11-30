import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";


const createUser = catchAsync(async(req: Request,res:Response)=>{
    console.log("ok login", req.body);
})


export const UserController = {
    createUser
};