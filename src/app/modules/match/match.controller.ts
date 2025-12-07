import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { matchServices } from './match.service';
import httpStatusCode from 'http-status-codes';

const requestMatchController = catchAsync(async (req: Request, res: Response) => {
  const fromUser = req.user as { userId: string };
  const { travelPlanId } = req.body;

  if (!travelPlanId) {
    throw new Error("travelPlanId is required");
  }

  const match = await matchServices.requestToJoin(fromUser.userId, { travelPlanId });

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.CREATED,
    message: "Request sent successfully!",
    data: match,
  });
});

const respondMatchController = catchAsync(async (req: Request, res: Response) => {
  const owner = req.user as { userId: string };
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
    throw new Error("Status must be 'ACCEPTED' or 'REJECTED'");
  }

  const updatedMatch = await matchServices.respondToMatch({
    matchId: id,
    ownerId: owner.userId,
    status,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: `Match request ${status.toLowerCase()} successfully!`,
    data: updatedMatch,
  });
});

const getMyMatchesController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as { userId: string };

  const matches = await matchServices.getMyMatches(user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Fetched your match requests successfully!",
    data: matches,
  });
});

export const matchControllers = {
  requestMatchController,
  respondMatchController,
  getMyMatchesController
};
