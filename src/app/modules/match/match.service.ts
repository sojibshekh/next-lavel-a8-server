import httpStatusCode from 'http-status-codes';
import { prisma } from '../../shared/db';
import AppError from '../../errorHelpers/AppError';

const requestToJoin = async (fromUserId: string, payload: { travelPlanId: string }) => {
  const { travelPlanId } = payload;

  // Check travel plan exists
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!travelPlan) {
    throw new AppError(httpStatusCode.NOT_FOUND, "Travel plan not found!");
  }

  const toUserId = travelPlan.userId;

  // Prevent self-request
  if (toUserId === fromUserId) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "You cannot request your own travel plan!");
  }

  // Check if already requested
  const alreadyRequested = await prisma.match.findFirst({
    where: {
      fromUserId,
      toUserId,
      travelPlanId,
    },
  });

  if (alreadyRequested) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "You have already requested to join this travel plan!");
  }

  // Create match request
  const match = await prisma.match.create({
    data: {
      fromUserId,
      toUserId,
      travelPlanId,
      status: "PENDING",
    },
  });

  return match;
};


const respondToMatch = async ({ matchId, ownerId, status }: RespondMatchInput) => {
  // Check match exists
  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) {
    throw new AppError(httpStatusCode.NOT_FOUND, "Match request not found!");
  }

  // Check if the current user is the travel plan owner
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: match.travelPlanId },
  });

  if (!travelPlan) {
    throw new AppError(httpStatusCode.NOT_FOUND, "Associated travel plan not found!");
  }

  if (travelPlan.userId !== ownerId) {
    throw new AppError(httpStatusCode.FORBIDDEN, "You are not allowed to respond to this request");
  }

  // Update match status
  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: { status },
  });

  return updatedMatch;
};


const getMyMatches = async (userId: string) => {
  const sentRequests = await prisma.match.findMany({
    where: { fromUserId: userId },
    include: {
      travelPlan: { select: { destination: true, startDate: true, endDate: true } },
      toUser: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const receivedRequests = await prisma.match.findMany({
    where: { toUserId: userId },
    include: {
      travelPlan: { select: { destination: true, startDate: true, endDate: true } },
      fromUser: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { sentRequests, receivedRequests };
};


const getRequestsForMyTravels = async (ownerId: string) => {
  return prisma.match.findMany({
    where: {
      travelPlan: {
        userId: ownerId, // 🔥 travel owner
      },
    },
    include: {
      fromUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      travelPlan: {
        select: {
          id: true,
          destination: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};


export const matchServices = {
  requestToJoin,
  respondToMatch,
  getMyMatches,
  getRequestsForMyTravels,
};
