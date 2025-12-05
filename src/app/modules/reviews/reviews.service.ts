
import httpStatusCode from 'http-status-codes';
import { prisma } from '../../shared/db';
import AppError from '../../errorHelpers/AppError';


const createReview = async (reviewerId: string, payload: any) => {
  const { travelPlanId, rating, comment, revieweeId } = payload;

  if (!revieweeId) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "revieweeId is required");
  }

  if (rating < 1 || rating > 5) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "Rating must be 1–5");
  }

  const result = await prisma.review.create({
    data: {
      rating,
      comment,
      reviewerId,   // reviewer from token
      revieweeId,   // REQUIRED FIELD 🔥
      travelPlanId,
    },
  });

  return result;
};


const getReviewsByTravelPlan = async (travelPlanId: string) => {
  const reviews = await prisma.review.findMany({
    where: { travelPlanId },
    include: {
      reviewer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  return reviews;
};



const getSingleReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      reviewer: {
        select: { name: true, email: true },
      },
      reviewee: {
        select: { name: true, email: true },
      },
      travelPlan: {
        select: { destination: true, startDate: true, endDate: true },
      },
    },
  });

  return review;
};


export const getMyReviews = async (userId: string) => {
  const reviews = await prisma.review.findMany({
    where: { reviewerId: userId },
    include: {
      reviewee: {
        select: {
          name: true,
          email: true,
        },
      },
      travelPlan: {
        select: {
          destination: true,
          startDate: true,
          endDate: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};


const updateReview = async (reviewId: string, userId: string, payload: { rating?: number; comment?: string }) => {
  // প্রথমে check করো যে এই review এর reviewer কি current user
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) throw new Error("Review not found");

  if (review.reviewerId !== userId) {
    throw new Error("You are not allowed to update this review");
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: payload.rating ?? review.rating,
      comment: payload.comment ?? review.comment,
    },
  });

  return updated;
};



const deleteReview = async (reviewId: string, userId: string) => {
  // প্রথমে check করো যে এই review এর reviewer কি current user
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) throw new Error("Review not found");

  if (review.reviewerId !== userId) {
    throw new Error("You are not allowed to delete this review");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });
};



export const reviewServices = {
  createReview,
  getReviewsByTravelPlan,
  getSingleReview,
  updateReview,
  deleteReview,
  getMyReviews
};
