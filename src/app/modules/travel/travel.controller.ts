import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes';
import { travelServices } from "./travel.service";
import AppError from "../../errorHelpers/AppError";



const createdTravel = catchAsync(async (req: Request, res: Response) => {
   const payload = req.body;
   console.log(payload);
  const decoded = req.user as JwtPayload;

  const userId = decoded.userId; // token থেকে user id

  const result = await travelServices.createTravel(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.CREATED,
    message: "Travel plan created successfully!",
    data: result,
  });
    
})


const getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {

     const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;


     const result = await travelServices.getAllTravelPlans(page, limit);

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: 'All travel retrieve successfully!',
        meta: result.meta,
        data: result.data
    })

});


const getSingleTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const travelPlanId = req.params.id;

  const travelPlan = await travelServices.getSingleTravelPlan(travelPlanId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Travel plan fetched successfully!",
    data: travelPlan,
  });
});



const getMyTravelPlans = catchAsync(async (req: Request, res: Response) => {
  const decoded = req.user as JwtPayload;

   if (!decoded || !decoded.userId) {
    throw new AppError(401, "Unauthorized! User ID missing in token.");
  }
  console.log('Decoded Token:', decoded); // Debugging line
  const userId = decoded.userId;

  console.log('Current User ID:', userId); // Debugging line
  const travels = await travelServices.getMyTravelPlans(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "User travel plans fetched successfully!",
    data: travels,
  });
});

const updateTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const travelId = req.params.id;

  const decoded = req.user as JwtPayload; 
  const userId = decoded.userId;

  const updatedData = req.body;

  const result = await travelServices.updateTravelPlan(travelId, userId, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Travel plan updated successfully!",
    data: result,
  });
});


const deleteTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const travelId = req.params.id;

  const decoded = req.user as JwtPayload;
  const userId = decoded.userId;

  const result = await travelServices.deleteTravelPlan(travelId, userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Travel plan deleted successfully!",
    data: result,
  });
});



const matchTravelPlans = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const decoded = req.user as JwtPayload | undefined;

  const result = await travelServices.matchTravelPlans(query, decoded);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Matched travel plans fetched successfully!",
    data: result,
  });
});



export const travelControllers = {
    createdTravel,
    getAllTravelPlans,
    getSingleTravelPlan,
    getMyTravelPlans,
    updateTravelPlan,
    deleteTravelPlan,
    matchTravelPlans
}