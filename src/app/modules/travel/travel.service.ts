import { Prisma, TravelPlan } from "@prisma/client";
import { prisma } from "../../shared/db";
import AppError from "../../errorHelpers/AppError";




const createTravel = async ( userId: string, payload: Prisma.TravelPlanCreateInput): Promise<TravelPlan> => {

  const travel = await prisma.travelPlan.create({
    data: {
      ...payload,
      user: { connect: { id: userId } }, // relation connect
    },
  });

  return travel;
};



const getAllTravelPlans = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [total, travels] = await Promise.all([
        prisma.travelPlan.count(),
        prisma.travelPlan.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                       
                    },
                },
            },
        }),
    ]);

    const totalPage = Math.ceil(total / limit);

    return {
        meta: {
            total,
            totalPage,
            currentPage: page,
            limit,
        },
        data: travels,
    };
};



const getSingleTravelPlan = async (travelPlanId: string) => {
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
    include: {
      user: {
        select: { name: true, email: true },
      },
      reviews: {
        include: {
          reviewer: { select: { name: true, email: true } },
        },
      },
      matches: true, // যদি matches দরকার হয়
    },
  });

  return travelPlan;
};




const getMyTravelPlans = async (userId: string) => {
    console.log('Fetching travel plans for User ID:', userId); // Debugging line
  const travels = await prisma.travelPlan.findMany({
    where: { userId },
    include: {
      user: { select: { name: true, email: true } },
      reviews: {
        include: {
          reviewer: { select: { name: true, email: true } },
        },
      },
      matches: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return travels;
};


const updateTravelPlan = async (
  travelId: string,
  userId: string,
  payload: any
) => {
  // Check if travel exists
  const travel = await prisma.travelPlan.findUnique({
    where: { id: travelId },
  });

  if (!travel) {
    throw new AppError(404, "Travel plan not found!");
  }

  // Ownership check — ভিন্ন user হলে update করতে পারবে না
  if (travel.userId !== userId) {
    throw new AppError(403, "You are not authorized to update this travel plan!");
  }

  // Update travel
  const updatedTravel = await prisma.travelPlan.update({
    where: { id: travelId },
    data: payload,
  });

  return updatedTravel;
};



const deleteTravelPlan = async (travelId: string, userId: string) => {
  // Check travel exists
  const travel = await prisma.travelPlan.findUnique({
    where: { id: travelId },
  });

  if (!travel) {
    throw new AppError(404, "Travel plan not found!");
  }

  // Ownership check
  if (travel.userId !== userId) {
    throw new AppError(403, "You are not authorized to delete this travel plan!");
  }

  // Delete travel plan
  const deleted = await prisma.travelPlan.delete({
    where: { id: travelId },
  });

  return deleted;
};

const matchTravelPlans = async (query: any, decoded: any) => {
  const {
    destination,
    startDate,
    endDate,
    travelType,
    page = 1,
    limit = 10,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  // Base filter
  const filters: any = {};

  if (destination) {
    filters.destination = {
      contains: destination,
      mode: "insensitive",
    };
  }

  // Travel Type Filter
  if (travelType) {
    filters.travelType = travelType;
  }

  // Date Overlap Logic:
  if (startDate && endDate) {
    filters.AND = [
      { startDate: { lte: new Date(endDate) } },
      { endDate: { gte: new Date(startDate) } },
    ];
  }

  // Interests filter (only if user is logged in)
  let interestFilter = {};
  if (decoded?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { interests: true },
    });

    if (user && user.interests.length > 0) {
      interestFilter = {
        OR: user.interests.map((int: string) => ({
          description: { contains: int, mode: "insensitive" },
        })),
      };
    }
  }

  const total = await prisma.travelPlan.count({
    where: {
      ...filters,
      ...interestFilter,
    },
  });

  const plans = await prisma.travelPlan.findMany({
    where: {
      ...filters,
      ...interestFilter,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
      
          interests: true,
          currentLocation: true,
        },
      },
      reviews: true,
    },
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
    plans,
  };
};



export const travelServices = {
  createTravel,
  getAllTravelPlans,
    getSingleTravelPlan,
    getMyTravelPlans,
    updateTravelPlan,
    deleteTravelPlan,
    matchTravelPlans
};
