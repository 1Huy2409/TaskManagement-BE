import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    async sendOTP(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Email Verification - OTP Code',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Email Verification</h2>
                    <p>Your OTP code is:</p>
                    <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 5 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendBoardInvitation(email: string, boardName: string, inviterName: string, inviteLink: string, expiresAt?: Date | null): Promise<void> {
        const isExistingUser = !expiresAt; // If no expiration, it's for existing user
        
        const expiryText = expiresAt 
            ? `<p style="color: #6B7280;">This invitation will expire on ${expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.</p>`
            : '';

        const actionText = isExistingUser 
            ? 'You have been added to the board! Click the button below to view it.'
            : 'Click the button below to accept the invitation and join the board.';

        const buttonText = isExistingUser ? 'View Board' : 'Accept Invitation';

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: `You've been invited to join "${boardName}" board`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                    <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #111827; margin-bottom: 20px;">Board Invitation</h2>
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                            <strong>${inviterName}</strong> has invited you to join the board:
                        </p>
                        <h3 style="color: #4F46E5; margin: 20px 0;">${boardName}</h3>
                        <p style="color: #6B7280; margin-bottom: 30px;">
                            ${actionText}
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${inviteLink}" 
                               style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                                ${buttonText}
                            </a>
                        </div>
                        ${expiryText}
                        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
                        <p style="color: #9CA3AF; font-size: 14px;">
                            Or copy and paste this link into your browser:<br>
                            <a href="${inviteLink}" style="color: #4F46E5; word-break: break-all;">${inviteLink}</a>
                        </p>
                        <p style="color: #9CA3AF; font-size: 12px; margin-top: 20px;">
                            If you didn't expect this invitation, you can safely ignore this email.
                        </p>
                    </div>
                </div>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }
}