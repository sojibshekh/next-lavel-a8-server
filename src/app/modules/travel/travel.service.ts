import { Prisma, TravelPlan } from "@prisma/client";
import { prisma } from "../../shared/db";




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

export const travelServices = {
  createTravel,
  getAllTravelPlans,
    getSingleTravelPlan,
    getMyTravelPlans
};
