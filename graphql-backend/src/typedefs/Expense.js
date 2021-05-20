import { gql } from 'apollo-server-express';
import { loginUser } from '../controllers/user_controller';

const user = gql`
    type Expense {
        id: String
        byUser: String!
        toUser: String!
        groupId: String!
        amount: Float!
        description: String!
        settledAt: String!
        currency: String
    }
#
#    type AllExpenseData {
#        byUser: String!
#        toUser: String!
#        groupId: String!
#        amount: Float!
#        description: String!
#        settledAt: String!
#        currency: String
#    }

    type AllExpenseData {
        totalcost: String
        pay: String
        recieve: String
        recieveExpenses: [String]
        getExpenses: [String]
    }

    type RecentExpenseData {
        timestamp: String
        byUserName: String
        toUserName: String
        type: String
        groupName: String
        description: String
        amount: String
        userId: String
        currency: String
    }
    
    type Balance {
        byUserName: String
        toUserName: String
        balance: String
    }
    
    input CreateGroupExpenseInput {
        groupId: String!
        amount: String!
        description: String!
    }

    type ExpenseResponse {
        success: Boolean,
        message: String,
        data: Expense
    }

    type BalanceResponse {
        success: Boolean,
        message: String,
        data: [Balance]
    }

    type AllExpenseResponse {
        success: Boolean,
        message: String,
        data: AllExpenseData
    }

    type RecentExpenseResponse {
        success: Boolean,
        message: String,
        data: RecentExpenseData
    }
    
    type ExpenseListResponse {
        success: Boolean!,
        message: String,
        data: [Expense]
    }


    extend type Query {
        getAllExpenses(userId: String): AllExpenseResponse
        getBalanceByUser2Id(userId: String, user2Id: String): UserListResponse!
        getRecentExpenses(userId: String): RecentExpenseResponse
        getAllExpensesForGroup(groupId: String): ExpenseListResponse
        getBalanceBetweenAllUsersForGroup(groupId: String): BalanceResponse
    }

    extend type Mutation {
        createGroupExpense(userId: String, groupBody: CreateGroupExpenseInput): ExpenseResponse
        settleExpense(userId: String, user2Id: String): ExpenseListResponse
    }
`

export default   user;
