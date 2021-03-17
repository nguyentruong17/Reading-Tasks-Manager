import { User } from "src/user/user.model";

export interface JwtPayload {
    user: User,
}