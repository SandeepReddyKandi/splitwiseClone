import getLogger from '../utils/logger';
import genericDTL from '../dtl/generic';
import GroupService from '../services/GroupService';
import UserService from '../services/UserService';
import ExpenseService from '../services/ExpenseService';
import expensesDtl from '../dtl/expenses_dtl';

function getNameById(data, id) {
  const value = data.find(entry => entry.id == id);
  return value ? value.name : undefined;
}

export async function getBalanceByUser2Id(__, {userId, user2Id}) {
  try {
    const user = await UserService.getUserById(user2Id);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    const { balance } = await ExpenseService.getBalanceBetweenUsers(userId, user2Id);
    return { success: true, data: { balance } };

  } catch (err) {
    getLogger().error(`Unable to get balance between users. Err. ${JSON.stringify(err)}`);
    return {
      success: false,
      message: `Unable to get balance between users. Err. ${JSON.stringify(err)}`
    };
  }
}

export async function getAllExpenses(__, {userId}) {
  try {
    console.log('USER ID IS', userId);
    const { getExpenses, payExpenses } = await ExpenseService.getAllExpensesForUserId(userId);
    const users = await UserService.getAllUsers();
    const allGroups = await GroupService.getAllGroups();
    const data = expensesDtl.getExpenseSummaryDto({ getExpenses, payExpenses, userId, users, allGroups });
    console.log('DATA IS', data)
    return {
      success: true,
      data,
    };
  } catch (err) {
    console.log('Error is ', err)
    return {
      success: false,
      message: `Unable to get all expenses. Err. ${JSON.stringify(err)}`
    };
  }
}

export async function getRecentExpenses(__, {userId}) {
  try {
    const { acceptedGroups } = await GroupService.getAllGroupsByUserId(userId);
    const groups = await GroupService.getAllGroups();
    const users = await UserService.getAllUsers();
    const expenses = [];
    await Promise.all(acceptedGroups.map(async (group) => {
      const groupId = group.id;
      const temp = await ExpenseService.getAllExpensesByGroupId(groupId, userId);
      expenses.push(...temp);
    }));
    const data = expensesDtl.getRecentExpensesDto({ users, groups, userId, expenses });
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      message: `Unable to get recent expenses. Err. ${JSON.stringify(err)}`,
    };
  }
}

export async function createGroupExpense(__, {userId, groupBody}) {
  try {
    const { groupId, amount, description } = groupBody;
    const group = await GroupService.getGroupById(groupId);
    if (!group || !group.acceptedUsers.length){
     return {
       success: false,
       message: 'Group not found'
     }
    }
    const userIds = group.acceptedUsers;
    const { currency } = group;
    const expenses = await ExpenseService.createGroupExpense({ userId, userIds, groupId, amount, description, currency });
    const data = expensesDtl.getBasicExpensesDetailsDto(expenses);
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      message: `Unable to create expense. Err. ${JSON.stringify(err)}`
    }
  }
}

export async function getAllExpensesForGroup(__, {groupId}) {
  try {
    const data = await ExpenseService.getAllExpensesForGroup(groupId);
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      message: `Unable to settle expense. Err. ${JSON.stringify(err)}`
    }
  }
}

export async function getBalanceBetweenAllUsersForGroup(__, {groupId}) {
  try {
    const users = await GroupService.getAllAcceptedUsersByGroupId(groupId);
    const balances = [];
    const allUsers = await UserService.getAllUsers();
    for (let i = 0; i < users.length; i += 1) {
      for (let j = i + 1; j < users.length; j += 1) {
        const byUser = users[i];
        const toUser = users[j];
        const { balance } = await ExpenseService.getBalanceBetweenUsers(byUser, toUser);
        const byUserName = getNameById(allUsers, byUser);
        const toUserName = getNameById(allUsers, toUser);
        balances.push({ byUserName, toUserName, balance });
      }
    }
    return {
      success: true,
      data: balances
    };
  } catch (err) {
    return {
      success: false,
      message: `Unable to settle expense. Err. ${JSON.stringify(err)}`
    }
  }
}


export async function settleExpense(__, {userId, user2Id}) {
  try {
    const updatedDetails = await ExpenseService.settleAllBalancesBetweenUsers(userId, user2Id);
    return {
      success: true,
      data: updatedDetails
    }
  } catch (err) {
    return {
      success: false,
      message: `Unable to settle expense. Err. ${JSON.stringify(err)}`
    }
  }
}

