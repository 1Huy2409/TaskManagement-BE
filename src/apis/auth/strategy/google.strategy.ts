import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "dotenv";
import AuthService from "../auth.service";
import { AppDataSource } from "@/config/db.config";
import { User } from "@/common/entities/user.entity";

const userRepository = AppDataSource.getRepository(User)
config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            const user = await userRepository.findOne({
                where: { googleId: profile.id }
            })
            if (!user) {
                const newUser = userRepository.create({
                    fullname: profile._json.name!,
                    username: profile._json.email!,
                    email: profile._json.email!,
                    googleId: profile.id!,
                    password: ''
                })
                await userRepository.save(newUser)
                return cb(null, newUser)
            }
            return cb(null, user)
        }
        catch (error) {
            return cb(error);
        }
    }
));
export default passport;