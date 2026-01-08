

import { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../../shared/db';


const getMe = async (decodedToken: JwtPayload) => {
    const id = decodedToken.userId;
    const userData = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
             bio: true,
            currentLocation: true,
            interests: true,
            visitedCountries: true,
            profilePhoto: true,
            isPremium: true,
        
           
        },
    });

    return userData
    
};


export const getAllUsersService = async () => {
    const users = await prisma.user.findMany({
        where: {
            role: "USER",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
        orderBy: {
            name: "asc", // নাম অনুযায়ী sort
        },
    });

    return users;
};


export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    
    },
  });

  return user;
};


const updateMyProfile = async (
  decodedToken: JwtPayload,
  payload: any
) => {
  if (!decodedToken.email) {
    throw new Error("Invalid token: email missing");
  }

  const updatedUser = await prisma.user.update({
    where: {
      email: decodedToken.email, // ✅ UNIQUE
    },
    data: {
      name: payload.name,
      bio: payload.bio,
      profilePhoto: payload.profilePhoto,
      currentLocation: payload.address,
      interests: payload.travelInterests || [],
      visitedCountries: payload.visitedCountries || [],
    },
  });

  return updatedUser;
};


export const UserService = {
 
    getMe,
    getAllUsersService,
    getUserById,
    updateMyProfile,
}