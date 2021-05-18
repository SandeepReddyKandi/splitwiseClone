import * as mongoose from "mongoose";
import {Schema} from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String },
    phone: { type: String },
    language: { type: String },
    timezone: { type: String },
    imageURL: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
