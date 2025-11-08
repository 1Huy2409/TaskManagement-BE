import jwt, { type SignOptions } from 'jsonwebtoken'
import { config } from "dotenv";
import { BadRequestError } from '../handler/error.response';

config()

export const signAccessToken = (data: any): string => {
    const token: string = jwt.sign(
        data,
        process.env.ACCESS_SECRET_KEY!,
        {
            algorithm: 'HS256',
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1d'
        } as any
    )
    return token;
}

export const verifyAccessToken = (token: string): any => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY!)
        return decoded;
    }
    catch (error) {
        throw new BadRequestError('Access token is invalid!')
    }
}

export const signRefreshToken = (data: any): string => {
    const token: string = jwt.sign(
        data,
        process.env.REFRESH_SECRET_KEY!,
        {
            algorithm: "HS256",
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d'
        } as any
    )
    return token;
}

export const verifyRefreshToken = (token: string): any => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY!)
        return decoded;
    }
    catch (error) {
        throw new BadRequestError('Refresh token is invalid!')
    }
}