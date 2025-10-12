import { toUserResponse } from './../user/user.mapper';
import { PostRegisterSchema, RegisterForm } from './schemas/auth.schema';
import { User } from "@/common/entities/user.entity";
import { AuthFailureError, BadRequestError, ConflictRequestError, NotFoundError } from "@/common/handler/error.response";
import { Repository } from "typeorm";
import { comparePassword, hashPassword } from "@/common/utils/handlePassword";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "@/common/utils/auth.util";
import { email } from "zod";
import { UserResponse } from '../user/schemas';
import { Request } from 'express';
export default class AuthService {
    constructor(private userRepository: Repository<User>) { }

    login = async (credentials: { username: string, password: string }): Promise<{ accessToken: string, refreshToken: string, user: UserResponse }> => {
        const { username, password } = credentials
        const user = await this.userRepository.findOne({
            where: { username: username }
        })
        if (!user) {
            throw new AuthFailureError(`Username ${username} is not found!`)
        }
        // call compare password
        const hashedPassword = user.password;
        const verifyPassword = await comparePassword(password, hashedPassword)
        if (!verifyPassword) {
            throw new AuthFailureError(`Password is incorrect!`)
        }
        const payload = { sub: user.id, username: user.username, email: user.email }
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);
        const userResponse: UserResponse = toUserResponse(user)
        return { accessToken, refreshToken, user: userResponse }
    }
    googleLogin = async (user: User | null): Promise<{ refreshToken: string }> => {
        if (!user) {
            throw new NotFoundError('User account was not created!')
        }
        const payload = { sub: user.id, username: user.username, email: user.email }
        const refreshToken = signRefreshToken(payload);
        return { refreshToken }
    }

    register = async (registerData: RegisterForm): Promise<UserResponse> => {
        const { fullname, username, email, password } = registerData;
        // check duplicate for username and email
        const existingUsername = await this.userRepository.findOne({
            where: { username: username }
        })
        if (existingUsername) {
            throw new ConflictRequestError(`This username exist in this application!`)
        }
        const existingEmail = await this.userRepository.findOne({
            where: { email: email }
        })
        if (existingEmail) {
            throw new ConflictRequestError(`This email exist in this application!`)
        }
        const newUser = this.userRepository.create({
            fullname: fullname,
            username: username,
            email: email,
            password: await hashPassword(password)
        })
        await this.userRepository.save(newUser)
        return toUserResponse(newUser);
    }

    refreshToken = async (req: Request): Promise<{ newAccessToken: string, newRefreshToken: string }> => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new AuthFailureError('Refresh token is not found!')
        }
        const { sub, username, email } = verifyRefreshToken(refreshToken)
        const newPayload = { sub, username, email }
        const newAccessToken = signAccessToken(newPayload)
        const newRefreshToken = signRefreshToken(newPayload)
        return {
            newAccessToken,
            newRefreshToken
        }
    }
}