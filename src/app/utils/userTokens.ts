import { JwtPayload } from "jsonwebtoken";

import AppError from "../errorHelpers/AppError";
import statusCode from "http-status-codes";
import { generateToken, verifyToken } from "./jwt";
import envVars from "../../config/index";
import { User } from "@prisma/client";
import { AuthTokens } from "./setCookie";
import { prisma } from "../shared/db";



export const createUserTokens = (user: User): AuthTokens => {

    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken: string = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
    const refreshToken: string = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

    return {
        accessToken,
        refreshToken
    }
};

export const newAccessTokenByRefreshToken = async (refreshToken: string) => {
    const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    const isExistUser = await prisma.user.findUnique({
        where: {
            email: verifiedToken.email
        }
    });

    if (!isExistUser) {
        throw new AppError(statusCode.BAD_REQUEST, "User doesn't Exist!");
    }
    // Import UserStatus enum at the top if not already imported
    // import { UserStatus } from "../path/to/UserStatus";

    // if (isExistUser.status === UserStatus.BLOCK || isExistUser.status === UserStatus.INACTIVE) {
    //     throw new AppError(statusCode.BAD_REQUEST, `User is ${isExistUser.status}`);
    // }


    const jwtPayload = {
        userId: isExistUser.id,
        email: isExistUser.email,
        role: isExistUser.role,
    };

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

    return accessToken
}