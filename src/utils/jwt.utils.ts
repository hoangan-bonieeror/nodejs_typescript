import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get("privateKey") as string;

export function sign(object : Object, option? : jwt.SignOptions | undefined) {
    return jwt.sign(object, privateKey, option)
}

export function decode(token : string) {
    try {
        const decoded = jwt.verify(token, privateKey);

        return { valid : true, expired : false, decoded };
    } catch (error) {
        console.log(error)
        return {
            valid : false,
            expired : true,
            decoded : null
        };
    }
}