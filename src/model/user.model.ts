import mongoose , { CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument extends mongoose.Document {
    email : string,
    name : string,
    password : string,
    createdAt : Date,
    updatedAt : Date
    comparePwd(candidatePwd : string) : Promise<boolean>
}

const UserSchema = new mongoose.Schema(
    {
        email : { type : String, required : true, unique : true},
        name : { type : String, required : true },
        password : { type : String, required : true }
    },
    { timestamps : true }
);

UserSchema.pre('save', async function (next : CallbackWithoutResultAndOptionalError) {
    let user = this as UserDocument;

    // Only hash the password if it is not the same old password
    if(!user.isModified("password")) return next();

    // Generate salt for additional data in the new hash
    const genSalt = await bcrypt.genSalt(config.get('saltWorkFactory'));

    // Hashing the new password
    const newHash = await bcrypt.hash(user.password, genSalt);

    // Replace the password with the hash
    user.password = newHash;

    return next();
})

UserSchema.methods.comparePwd = async function(candidatePwd : string) {
    const user = this as UserDocument;

    return bcrypt.compare(candidatePwd, user.password).catch(err => false)
};

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;