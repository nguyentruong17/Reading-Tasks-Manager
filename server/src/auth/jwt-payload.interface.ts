import { BaseUserMongo } from "src/user/user.model";

export interface JwtPayload {
    user: BaseUserMongo,
    //accessToken: string,
}