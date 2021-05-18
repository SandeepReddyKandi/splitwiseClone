import * as mongoose from "mongoose";
import {Schema} from "mongoose";

const expenseSchema = new Schema({
  byUser: { type: String, required: true},
  toUser: { type: String, required: true},
  groupId: { type: String, required: true},
  amount: { type: Number, required: true},
  description: { type: String, required: true},
  settledAt: { type: Schema.Types.Mixed},
  currency: { type: String },
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
