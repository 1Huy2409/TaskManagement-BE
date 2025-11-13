import redis from "@/config/redis.config";
import { BadRequestError } from "../handler/error.response";
import { parse } from "path";

export class OtpService {
    private readonly OTP_EXPIRATION = 300;
    private readonly MAX_ATTEMPTS = 5;
    private readonly ATTEMPT_WINDOW = 300;

    generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async saveOTP(email: string, otp: string): Promise<void> {
        const otpKey = `otp:register:${email}`;
        await redis.setex(otpKey, this.OTP_EXPIRATION, otp);
    }

    async verifyOTP(email: string, otp: string): Promise<boolean> {
        const attemptsKey = `otp:attempts:${email}`;
        const attempts = await redis.get(attemptsKey);
        if (attempts && parseInt(attempts) >= this.MAX_ATTEMPTS) {
            throw new Error('Maximum OTP verification attempts exceeded. Please request a new OTP.');
        }
        const key = `otp:register:${email}`;
        const storedOtp = await redis.get(key);
        if (!storedOtp) {
            throw new BadRequestError('OTP has expired or does not exist.');
        }
        const currentAttempts = parseInt(attempts || '0') + 1;
        await redis.setex(attemptsKey, this.ATTEMPT_WINDOW, currentAttempts.toString());
        if (storedOtp !== otp) {
            throw new BadRequestError('Invalid OTP provided.');
        }
        await redis.del(key);
        await redis.del(attemptsKey);
        return true;
    }
    async canResendOTP(email: string): Promise<boolean> {
        const resendKey = `otp:resend:${email}`;
        const lastSent = await redis.get(resendKey);
        if (lastSent) {
            return false;
        }
        await redis.setex(resendKey, 60, Date.now().toString());
        return true;
    }
}