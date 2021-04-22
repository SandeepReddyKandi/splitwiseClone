import * as mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface IExpense extends Document {
  id: string,
  byUser: string,
  toUser: string,
  groupId: string
  amount: number,
  description: string,
  settledAt: string,
  currency: string,
}

const expenseSchema: Schema = new Schema({
  byUser: { type: String, required: true},
  toUser: { type: String, required: true},
  groupId: { type: String, required: true},
  amount: { type: Number, required: true},
  description: { type: String, required: true},
  settledAt: { type: String, required: true},
  currency: { type: String, required: true},
}, { timestamps: true });

export default mongoose.model<IExpense>("Expense", expenseSchema);
