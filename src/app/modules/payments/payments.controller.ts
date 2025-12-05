import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

const createdPaymentIntent = catchAsync(async (req: Request, res: Response) => {
    
    console.log("Payment Intent Created");
    
})


export const paymentsControllers = {
    createdPaymentIntent
}