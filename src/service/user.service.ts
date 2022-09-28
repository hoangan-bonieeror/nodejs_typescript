import { omit } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import User, { UserDocument } from "../model/user.model";

export function createUser(input : DocumentDefinition<UserDocument>) {
    try {
        return User.create(input);
    } catch (error) {
        throw new Error(error);
    }
}

export async function findUser(query : FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
}

export async function validatePwd({ email , password  } : { email : UserDocument['email'], password : string }) {
    // Find the user that matches the email field
    const userFound = await User.findOne({ email });

    if(!userFound) return false

    const isValidPwd = await userFound.comparePwd(password);

    if(!isValidPwd) return false

    return <UserDocument>omit(userFound.toJSON(), "password");
}