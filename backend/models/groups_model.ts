import * as mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface IGroup extends Document {
    id: string,
    name: string,
    acceptedUsers: string[],
    invitedUsers: string[],
    currency: string,
    imageUrl: string,
}
//     acceptedUsers: {
//      type: DataTypes.STRING,
//      get() {
//        return this.getDataValue('acceptedUsers') ? this.getDataValue('acceptedUsers').split(';') : this.getDataValue('acceptedUsers');
//      },
//      set(val) {
//        this.setDataValue('acceptedUsers', val.join(';'));
//      },
//    },

const groupSchema: Schema = new Schema({
    name: { type: String, required: true},
    acceptedUsers: { type: [String], required: false},
    invitedUsers: { type: [String], required: false},
    currency: { type: String},
    imageUrl: {type: String}
}, { timestamps: true });

export default mongoose.model<IGroup>("Group", groupSchema);

