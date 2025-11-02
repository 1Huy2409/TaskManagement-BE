import { toUserResponse } from './../user/user.mapper';
import { CompleteRegisterForm, PostRegisterSchema, RegisterForm, RequestOTPForm, RequestOTPResponse, VerifyOTPForm } from './schemas/auth.schema';
import { User } from "@/common/entities/user.entity";
import { AuthFailureError, BadRequestError, ConflictRequestError, NotFoundError } from "@/common/handler/error.response";
import { MoreThan, Repository } from "typeorm";
import { comparePassword, hashPassword } from "@/common/utils/handlePassword";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "@/common/utils/auth.util";
import { email } from "zod";
import crypto from 'crypto';
import { UserResponse } from '../user/schemas';
import { Request } from 'express';
import { EmailService } from '@/common/utils/mailService';
import { Otp } from '@/common/entities/otp.entity';
export default class AuthService {
    private emailService: EmailService
    constructor(private userRepository: Repository<User>, private otpRepository: Repository<Otp>) {
        this.emailService = new EmailService();
    }

    login = async (credentials: { username: string, password: string }): Promise<{ accessToken: string, refreshToken: string, user: UserResponse }> => {
        const { username, password } = credentials
        console.log(username);
        const user = await this.userRepository.findOne({
            where: { username: username }
        })
        if (!user) {
            throw new AuthFailureError(`Username ${username} is not found!`)
        }
        console.log('User found for login:', user);
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
        console.log('Generated refresh token for Google login:', refreshToken); // Debug log
        return { refreshToken }
    }

    // register v2:
    requestOTP = async (data: RequestOTPForm): Promise<RequestOTPResponse> => {
        const { email } = data;
        const existingUser = await this.userRepository.findOne({
            where: { email: email }
        });
        if (existingUser) {
            throw new ConflictRequestError(`This email exist in this application!`)
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        await this.otpRepository.delete({ email: email });
        const newOtpEntity = this.otpRepository.create({
            email: email,
            otp: otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
        });
        await this.otpRepository.save(newOtpEntity);
        await this.emailService.sendOTP(email, otp);

        return {
            email: email,
            message: 'OTP has been sent to your email.'
        }
    }
    verifyOTP = async (data: VerifyOTPForm): Promise<{ email: string, message: string }> => {
        const { email, otp } = data;
        const otpEntity = await this.otpRepository.findOne({
            where: {
                email: email,
                otp: otp,
                isVerified: false,
            }
        })
        if (!otpEntity) {
            throw new BadRequestError('Invalid OTP!')
        }
        if (otpEntity.expiresAt < new Date()) {
            throw new BadRequestError('OTP has expired!')
        }
        otpEntity.isVerified = true;
        await this.otpRepository.save(otpEntity);
        return {
            email,
            message: 'OTP verified successfully.'
        }
    }

    completeRegister = async (data: CompleteRegisterForm): Promise<UserResponse> => {
        const { email, fullname, username, password } = data;
        const otpEntity = await this.otpRepository.findOne({
            where: {
                email: email,
                isVerified: true
            }
        });
        if (!otpEntity) {
            throw new BadRequestError('Email not verified!')
        }
        const existingUsername = await this.userRepository.findOne({
            where: { username: username }
        })
        if (existingUsername) {
            throw new ConflictRequestError(`This username exist in this application!`)
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