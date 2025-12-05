

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







export const UserService = {
 
    getMe,
}