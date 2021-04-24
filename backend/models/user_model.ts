import * as mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface IUser extends Document {
    id: string,
    name: string,
    email: string,
    password: string,
    token: string,
    language: string,
    phone: string,
    timezone: string,
    imageURL: string,
}

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String },
    phone: { type: String },
    language: { type: String },
    timezone: { type: String },
    imageURL: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);
