import { Request, Response } from "express";
import log from "../logger/log";
import { createAccessToken, createSession, updateSession } from "../service/session.service";
import { validatePwd } from "../service/user.service";
import { sign } from "../utils/jwt.utils";
import config from "config";
import { get } from "lodash";

export const createSessionHandler = async (req : Request, res : Response) => {
    try {
        // Validate email and password
        const user = await validatePwd(req.body);

        if(!user) return res.status(401).send("Invalid username or password")

        // Create session
        const session = await createSession(user._id, req.get('user-agent') || "");

        // Create access token
        const accessToken = createAccessToken({user, session});

        // Create refresh token
        const refreshToken = sign(
            session,
            { expiresIn : config.get("refreshTokenTtl") }
        )

        return res.status(200).json({
            code : 200,
            status : 'OK',
            accessToken,
            refreshToken
        })
    } catch (error) {
        log.info(error);
        return res
            .status(409)
            .send(error.message);
    }
}

export const invalidateUserSessionHandler = async (req : Request, res : Response) => {
    const sessionId = get(req, "user.session");

    await updateSession({ _id : sessionId }, { valid : false });

    return res.sendStatus(200);
}