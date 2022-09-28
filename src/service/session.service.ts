import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import Session, { SessionDocument } from '../model/session.model';
import { UserDocument } from '../model/user.model';
import { decode, sign } from '../utils/jwt.utils';
import config from "config";
import { get } from 'lodash';
import { findUser } from './user.service';

export const createSession = async (userId : string, userAgent : string) => {
    try {
        return await Session.create({ user : userId, userAgent }).then(data => <SessionDocument>data.toJSON());
    } catch (error) {
        throw new Error(error);
    }
}

export const createAccessToken = (
    {
        user,
        session
    } : {
        user : 
        | Omit<UserDocument, "password">
        | LeanDocument<Omit<UserDocument, "password">>,
        session : 
        | Omit<SessionDocument, "password">
        | LeanDocument<Omit<SessionDocument, "password">>,
    }
) => {
    const accessToken = sign(
        {...user, session : session._id },
        { expiresIn : config.get("accessTokenTtl") }
    )

    return accessToken;
}

export const reIssueAccessToken = async (
    { refreshToken } : { refreshToken : string }
) => {
    // Decode refresh token
    const { decoded } = decode(refreshToken);

    if(!decode || !get(decoded, "_id")) return false;

    // Get the session
    const session = await Session.findById(get(decoded, "_id"));

    // Make sure the session is still valid
    if(!session || !session?.valid) return false;

    const user = await findUser({ _id : session.user });

    if(!user) return false;

    const newAccessToken = createAccessToken({ user, session });

    return newAccessToken;
}

export async function updateSession(
    query : FilterQuery<SessionDocument>,
    update : UpdateQuery<SessionDocument>
) {
    return Session.updateOne(query, update);
}