import * as mongoose from "mongoose";
import {Schema} from "mongoose";

const groupSchema = new Schema({
    name: { type: String, required: true},
    acceptedUsers: { type: [String], required: false},
    invitedUsers: { type: [String], required: false},
    currency: { type: String},
    imageUrl: {type: String}
}, { timestamps: true });

export default mongoose.model("Group", groupSchema);

