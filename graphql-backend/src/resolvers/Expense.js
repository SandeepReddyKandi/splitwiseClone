import {
    getAllExpenses,
    getAllExpensesForGroup,
    createGroupExpense,
    getBalanceBetweenAllUsersForGroup,
    getRecentExpenses,
    settleExpense,
    getBalanceByUser2Id,
} from "../controllers/expense_controller";

const expenseResolver = {
    Query: {
        getAllExpenses: getAllExpenses,
        getBalanceByUser2Id: getBalanceByUser2Id,
        getRecentExpenses: getRecentExpenses,
        getAllExpensesForGroup: getAllExpensesForGroup,
        getBalanceBetweenAllUsersForGroup: getBalanceBetweenAllUsersForGroup,
    },
    Mutation: {
        createGroupExpense: createGroupExpense,
        settleExpense: settleExpense,
    }
}

export default expenseResolver;
