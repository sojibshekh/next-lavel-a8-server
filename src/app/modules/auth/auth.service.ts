import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/db";
import bcryptjs from 'bcryptjs';
import statusCode from 'http-status-codes';


import envVars from './../../../config';
import { newAccessTokenByRefreshToken } from "../../utils/userTokens";
import AppError from "../../errorHelpers/AppError";


const createUser = async (payload: Prisma.UserCreateInput) => {
    const { password, ...rest } = payload;
    // Hash password
    const hashedPassword = await bcryptjs.hash(
        password as string,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    // Create user
    const createdUser = await prisma.user.create({
        data:
        {
            password: hashedPassword,
            ...rest
        }
    });

    return createdUser
}
const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "User Not Found!");
    }
    if (email !== user?.email) {
        throw new AppError(statusCode.NOT_FOUND, "Email is incorrect!");
    }

    if (user.password) {
        const isPasswordMatch = await bcryptjs.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            throw new AppError(statusCode.NOT_FOUND, "Password is incorrect!");
        }
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      
    }
}

// Generate New Access Token by refresh token
const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await newAccessTokenByRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken,
    }
};

export const AuthService = {
    login,
    getNewAccessToken,
    createUser
}