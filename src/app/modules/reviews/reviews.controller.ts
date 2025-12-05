import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes';
import { reviewServices } from "./reviews.service";



const createReviews = catchAsync(async (req: Request, res: Response) => {
   const payload = req.body;

  const decoded = req.user as JwtPayload;
  console.log('Decoded Token:', decoded); // Debugging line
  const userId = decoded.userId; // token থেকে user id

const result = await reviewServices.createReview(userId, payload);

console.log('Review Creation Result:', result); // Debugging line

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.CREATED,
    message: "review  send  successfully!",
    data: result,
  });
    
})


const getReviewsByTravelPlan = catchAsync(async (req: Request, res: Response) => {
   const travelPlanId = req.params.id; // route param থেকে নেওয়া


  const result = await reviewServices.getReviewsByTravelPlan(travelPlanId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Reviews fetched successfully!",
    data: result,
  });
});


const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.id;

  const review = await reviewServices.getSingleReview(reviewId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Review fetched successfully!",
    data: review,
  });
});


export const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const decoded = req.user as { userId: string };
  console.log('Decoded Token:', decoded); // Debugging line
  const userId = decoded.userId;

  console.log('Current User ID:', userId); // Debugging line

  const reviews = await reviewServices.getMyReviews(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Your reviews fetched successfully!",
    data: reviews,
  });
});


const updateReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const payload = req.body;

  // Token থেকে current user id
  const decoded = req.user as JwtPayload;
  const userId = decoded.userId;

  const updatedReview = await reviewServices.updateReview(reviewId, userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Review updated successfully!",
    data: updatedReview,
  });
});


const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.id;

  // Token থেকে current user id
  const decoded = req.user as JwtPayload;
  const userId = decoded.userId;

    const result = await reviewServices.deleteReview(reviewId, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: 'review delete successfully!',
        data: result
    })

});



export const reviewController = {
  createReviews,
  getReviewsByTravelPlan,
  getSingleReview ,
  updateReview,
  deleteReview,
  getMyReviews
};

