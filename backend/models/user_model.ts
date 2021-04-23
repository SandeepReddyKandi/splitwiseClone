import * as mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  id: string,
      name: string,
      email: string,
      password: string
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);
