import * as mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface IPost extends Document {
    id: string,
    author: string,
    comment: string,
    expenseId: string,
}

const userSchema: Schema = new Schema({
    author: { type: String, required: true },
    comment: { type: String, required: true },
    expenseId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IPost>("Post", userSchema);
