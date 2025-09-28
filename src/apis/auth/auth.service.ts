import { User } from "@/common/entities/user.entity";
import { BadRequestError, NotFoundError } from "@/common/handler/error.response";
import { Repository } from "typeorm";
import { comparePassword } from "@/common/utils/handlePassword";
import { signAccessToken, signRefreshToken, verifyAccessToken } from "@/common/utils/auth.util";
import { email } from "zod";
export default class AuthService {
    constructor(private userRepository: Repository<User>) { }

    login = async (credentials: { username: string, password: string }): Promise<{ accessToken: string, refreshToken: string }> => {
        const { username, password } = credentials
        const user = await this.userRepository.findOne({
            where: { username: username }
        })
        if (!user) {
            throw new NotFoundError(`Username ${username} is not found!`)
        }
        // call compare password
        const hashedPassword = user.password;
        const verifyPassword = await comparePassword(password, hashedPassword)
        if (!verifyPassword) {
            throw new BadRequestError(`Password is incorrect!`)
        }
        const payload = { sub: user.id, username: user.username, email: user.email }
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);
        return { accessToken, refreshToken }
    }
    googleLogin = async (user: User | null): Promise<{ accessToken: string, refreshToken: string }> => {
        if (!user) {
            throw new NotFoundError('User account was not created!')
        }
        const payload = { sub: user.id, username: user.username, email: user.email }
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);
        return { accessToken, refreshToken }
    }
}