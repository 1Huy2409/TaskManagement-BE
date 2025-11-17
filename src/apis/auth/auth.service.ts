import redisClient  from '@/config/redis.config';

import { toUserResponse } from './../user/user.mapper';
import { CompleteRegisterForm, PostRegisterSchema, RegisterForm, RequestOTPForm, RequestOTPResponse, VerifyOTPForm, ResetPasswordForm } from './schemas/auth.schema';
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
interface OtpRedisData {
    otp: string;
    isVerified: boolean;
}
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
        const rawEmail = data.email;
        const email = rawEmail.trim().toLowerCase();
        const existingUser = await this.userRepository.findOne({
            where: { email: email }
        });
        if (existingUser) {
            throw new ConflictRequestError(`This email exist in this application!`)
        }
        const otp = crypto.randomInt(100000, 999999).toString();
       // 2. Dùng Redis key thay vì DB
        const redisKey = `otp:${email}`;
        
        // Lưu OTP và trạng thái chưa xác thực
        const otpData: OtpRedisData = {
            otp: otp,
            isVerified: false
        };
        await redisClient.set(redisKey, JSON.stringify(otpData), 'EX', 300);
        await this.emailService.sendOTP(email, otp);
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEV] requestOTP stored ${redisKey} ->`, otpData);
            const ttl = await redisClient.ttl(redisKey);
            console.log(`[DEV] ${redisKey} TTL=${ttl}s`);
        }

        return {
            email: email,
            message: 'OTP has been sent to your email.'
        }
    }
    verifyOTP = async (data: VerifyOTPForm): Promise<{ email: string, message: string }> => {
        const rawEmail = data.email;
        const email = rawEmail.trim().toLowerCase();
        const otp = data.otp.trim();
        const redisKey = `otp:${email}`;
        const dataStr = await redisClient.get(redisKey);
        if (!dataStr) {
            throw new BadRequestError('OTP has expired or does not exist!');
        }

        const otpData: OtpRedisData = JSON.parse(dataStr);
        if (otpData.otp !== otp) {
            throw new BadRequestError('Invalid OTP!');
        }
        otpData.isVerified = true;
        await redisClient.set(redisKey, JSON.stringify(otpData), 'EX', 600);
        return {
            email,
            message: 'OTP verified successfully.'
        }
    }

    // Forgot password: request OTP for existing account
    requestForgotPassword = async (data: RequestOTPForm): Promise<RequestOTPResponse> => {
        const rawEmail = data.email;
        const email = rawEmail.trim().toLowerCase();
        const existingUser = await this.userRepository.findOne({
            where: { email: email }
        });
        if (!existingUser) {
            throw new NotFoundError(`This email is not registered!`)
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        const redisKey = `forgot:${email}`;
        const otpData: OtpRedisData = { otp: otp, isVerified: false };
        await redisClient.set(redisKey, JSON.stringify(otpData), 'EX', 300);
        await this.emailService.sendOTP(email, otp);
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEV] requestForgotPassword stored ${redisKey} ->`, otpData);
            const ttl = await redisClient.ttl(redisKey);
            console.log(`[DEV] ${redisKey} TTL=${ttl}s`);
        }

        return {
            email: email,
            message: 'OTP has been sent to your email.'
        }
    }

    verifyForgotOTP = async (data: VerifyOTPForm): Promise<{ email: string, message: string }> => {
        const rawEmail = data.email;
        const email = rawEmail.trim().toLowerCase();
        const otp = data.otp.trim();
        const redisKey = `forgot:${email}`;
        const dataStr = await redisClient.get(redisKey);
        if (!dataStr) {
            throw new BadRequestError('OTP has expired or does not exist!');
        }
        const otpData: OtpRedisData = JSON.parse(dataStr);
        if (otpData.otp !== otp) {
            throw new BadRequestError('Invalid OTP!');
        }
        otpData.isVerified = true;
        // extend verification window a bit
        await redisClient.set(redisKey, JSON.stringify(otpData), 'EX', 600);

        if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEV] verifyForgotOTP success for ${redisKey} ->`, otpData);
            const ttl = await redisClient.ttl(redisKey);
            console.log(`[DEV] ${redisKey} TTL=${ttl}s`);
        }

        return { email, message: 'OTP verified successfully.' }
    }

    resetPassword = async (data: ResetPasswordForm): Promise<{ message: string }> => {
        const rawEmail = data.email;
        const email = rawEmail.trim().toLowerCase();
        const { newPassword } = data;
        if (!email) {
            throw new BadRequestError('Email is required.');
        }
        const redisKey = `forgot:${email}`;
        const dataStr = await redisClient.get(redisKey);
        if (!dataStr) {
            throw new BadRequestError('OTP has expired or does not exist!');
        }
        const otpData: OtpRedisData = JSON.parse(dataStr);
        // Only allow reset if OTP was verified previously
        if (otpData.isVerified !== true) {
            throw new BadRequestError('OTP not verified. Please verify OTP before resetting password.');
        }
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundError('User not found!');
        user.password = await hashPassword(newPassword);
        await this.userRepository.save(user);
        await redisClient.del(redisKey);
        return { message: 'Password has been reset successfully.' }
    }

    completeRegister = async (data: CompleteRegisterForm): Promise<UserResponse> => {
        const rawEmail = data.email;
        const email = rawEmail.trim().toLowerCase();
        const { fullname, username, password } = data;
        const redisKey = `otp:${email}`;
        const dataStr = await redisClient.get(redisKey);
        if(!dataStr) {
            throw new BadRequestError('OTP has expired or does not exist!');
        }
        const otpData: OtpRedisData = JSON.parse(dataStr);

        if (otpData.isVerified !== true) {
            throw new BadRequestError('Email not verified!');
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
        await redisClient.del(redisKey);
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