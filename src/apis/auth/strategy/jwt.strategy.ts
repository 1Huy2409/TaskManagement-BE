import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { AppDataSource } from "@/config/db.config";
import { User } from "@/common/entities/user.entity";

const userRepository = AppDataSource.getRepository(User);
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_SECRET_KEY!,
}, function (jwt_payload, done) {
    try {
        const user = userRepository.findOne({
            where: { id: jwt_payload.sub }
        })
        if (!user) {
            return done(null, null)
        }
        return done(null, user)
    }
    catch (error) {
        return done(error, null)
    }
}));