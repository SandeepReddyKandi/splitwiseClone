import * as mongoose from "mongoose";
import {Schema} from "mongoose";

const userSchema = new Schema({
    author: { type: String, required: true },
    comment: { type: String, required: true },
    expenseId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Post", userSchema);
