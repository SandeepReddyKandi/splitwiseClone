import Expense from '../models/expenses_model';
import * as _ from 'underscore';

class ExpenseService {
    static getTotalAmount(allExpenses) {
        let total = 0;
        if (!allExpenses || !Array.isArray(allExpenses)) return total;
        allExpenses.forEach((expense) => {
            total += expense.amount;
            return expense;
        });
        return total;
    }

    static async getBalanceBetweenUsers(user1Id, user2Id) {
        const getCondition = {byUser: user1Id, toUser: user2Id, settledAt: null};
        const payCondition = {byUser: user2Id, toUser: user1Id, settledAt: null};
        const getExpenses = await Expense.find(getCondition);
        const payExpenses = await Expense.find(payCondition);
        const getAmount = this.getTotalAmount(getExpenses);
        const payAmount = this.getTotalAmount(payExpenses);
        const balance = getAmount - payAmount;
        return { getAmount, payAmount, balance };
    }

    static async settleAllBalancesBetweenUsers(byUser, toUser) {
        const values = { settledAt: Date.now() };
        const condition = [{ byUser, toUser }, { byUser: toUser, toUser: byUser }];
        const result = await Expense.updateMany({
            $or : condition
        }, values);
        return result;
    }
    static async getAllExpensesByGroupId(groupId, userId) {
        // TODO
        const condition = [{ byUser: userId, groupId }, { toUser: userId, groupId }];
        const result = await Expense.find({
            $or: condition
        });
        return result;
    }
    static async getAllExpensesForUserId(userId: string) {
        const getExpenses = await Expense.find({ byUser: userId, settledAt: null });
        const payExpenses = await Expense.find( { toUser: userId, settledAt: null });
        return { getExpenses, payExpenses };
    }

    static async getAllExpensesForGroup(groupId) {
        return Expense.find({ groupId });
        // return JSON.stringify(result);
    }

    static async createGroupExpense(data) {
        const { userId, userIds, groupId, amount, description, currency } = data;
        const amountPerUser = amount / (userIds.length);
        const result = await Promise.all(_.map(userIds, async (toUserId) => {
            if (userId != toUserId) {
                const newExpenseData = { byUser: userId, toUser: toUserId, amount: amountPerUser, description, groupId, currency };
                const newExpense = new Expense(newExpenseData);
                return await newExpense.save();
            }
        }));
        return result;
    }
}
export default ExpenseService;
