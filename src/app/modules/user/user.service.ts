

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

export const UserService = {
 
    getMe,
    getAllUsersService,
    getUserById,
}