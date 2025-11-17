import { toUserResponse } from './../user/user.mapper';
import { CompleteRegisterForm, RegisterForm, RequestOTPForm, RequestOTPResponse, VerifyOTPForm } from './schemas/auth.schema';
import { User } from "@/common/entities/user.entity";
import { AuthFailureError, BadRequestError, ConflictRequestError, NotFoundError } from "@/common/handler/error.response";;
import { comparePassword, hashPassword } from "@/common/utils/handlePassword";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "@/common/utils/auth.util";
import crypto from 'crypto';
import { UserResponse } from '../user/schemas';
import { Request } from 'express';
import { EmailService } from '@/common/utils/mailService';
import { IUserRepository } from '../user/repositories/user.repository.interface';
import { OtpService } from '@/common/utils/otpService';
export default class AuthService {
    private emailService: EmailService
    private otpService: OtpService
    constructor(private userRepository: IUserRepository) {
        this.emailService = new EmailService();
        this.otpService = new OtpService()
    }

    login = async (credentials: { username: string, password: string }): Promise<{ accessToken: string, refreshToken: string, user: UserResponse }> => {
        const { username, password } = credentials
        console.log(username);
        const user = await this.userRepository.findByUsername(username);
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
    register = async (userData: RegisterForm): Promise<RequestOTPResponse> => {
        const { fullname, username, email, password } = userData;
        const existingUserByEmail = await this.userRepository.findByEmail(email);
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                throw new ConflictRequestError(`Email ${email} is already in use.`);
            }
            const canResendOtp = await this.otpService.canResendOTP(email);
            if (!canResendOtp) {
                throw new BadRequestError('OTP was sent recently. Please wait before requesting a new one.');
            }
        }
        const existingUserByUsername = await this.userRepository.findByUsernameExceptId(username, existingUserByEmail ? existingUserByEmail.id : '');
        if (existingUserByUsername) {
            throw new ConflictRequestError(`Username ${username} is already in use.`);
        }
        await this.userRepository.create({
            fullname,
            username,
            email,
            password: await hashPassword(password),
        })
        // always generate and send OTP
        const otp = this.otpService.generateOTP();
        await this.otpService.saveOTP(email, otp);
        await this.emailService.sendOTP(email, otp);
        return {
            email,
            message: 'OTP has been sent to your email address.'
        }
    }

    verifyEmail = async (data: VerifyOTPForm) => {
        const { email, otp } = data;
        await this.otpService.verifyOTP(email, otp);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError(`User with email ${email} not found.`);
        }
        user.isVerified = true;
        await this.userRepository.update(user.id, user);
        return {
            email,
            message: 'Email has been successfully verified.'
        }
    }
    resendOTP = async (email: string): Promise<RequestOTPResponse> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError(`User with email ${email} not found.`);
        }
        if (user.isVerified) {
            throw new BadRequestError('Email is already verified.');
        }
        const canResendOtp = await this.otpService.canResendOTP(email);
        if (!canResendOtp) {
            throw new BadRequestError('OTP was sent recently. Please wait before requesting a new one.');
        }
        const otp = this.otpService.generateOTP();
        await this.otpService.saveOTP(email, otp);
        await this.emailService.sendOTP(email, otp);
        return {
            email,
            message: 'OTP has been resent to your email address.'
        }
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