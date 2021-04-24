import getLogger from '../utils/logger';
import genericDTL from '../dtl/generic';
import GroupService from '../services/GroupService';
import UserService from '../services/UserService';
import ExpenseService from '../services/ExpenseService';
import expensesDtl from '../dtl/expenses_dtl';
import publishKafkaMessage from "../kafka-producer";

function getNameById(data, id) {
  const value = data.find(entry => entry.id == id);
  return value ? value.name : undefined;
}

async function getBalanceByUser2Id(req, res, next) {
  try {
    getLogger().info('controllers', 'getBalanceByUser2Id');
    const { userId } = req.user;
    const { user2Id } = req.params;
    const user = await UserService.getUserById(user2Id);
    if (!user) return res.send(genericDTL.getResponseDto('', 'User not found'));
    const { balance } = await ExpenseService.getBalanceBetweenUsers(userId, user2Id);
    const response = genericDTL.getResponseDto({ balance });
    publishKafkaMessage({key: req.url, value: response});
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to get balance between users. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function getAllExpenses(req, res, next) {
  try {
    getLogger().info('controllers', 'getAllExpenses');
    const { userId } = req.user;
    const { getExpenses, payExpenses } = await ExpenseService.getAllExpensesForUserId(userId);
    const users = await UserService.getAllUsers();
    const allGroups = await GroupService.getAllGroups();
    const data = expensesDtl.getExpenseSummaryDto({ getExpenses, payExpenses, userId, users, allGroups });
    const response = genericDTL.getResponseDto(data);
    publishKafkaMessage({key: req.url, value: response});
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to get all expenses. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function getRecentExpenses(req, res, next) {
  try {
    getLogger().info('controllers', 'getRecentExpenses');
    const { userId } = req.user;
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
    const response = genericDTL.getResponseDto(data);
    publishKafkaMessage({key: req.url, value: response});
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to get recent expenses. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function createGroupExpense(req, res, next) {
  try {
    getLogger().info('controllers', 'createGroupExpense', 'body', JSON.stringify(req.body));
    const { userId } = req.user;
    const { groupId, amount, description } = req.body;
    const group = await GroupService.getGroupById(groupId);
    if (!group || !group.acceptedUsers.length) return res.send(genericDTL.getResponseDto('', 'Group not found'));
    const userIds = group.acceptedUsers;
    const { currency } = group;
    const expenses = await ExpenseService.createGroupExpense({ userId, userIds, groupId, amount, description, currency });
    const resData = expensesDtl.getBasicExpensesDetailsDto(expenses);
    const response = genericDTL.getResponseDto(resData);
    publishKafkaMessage({key: req.url, value: response});
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to create expense. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function getAllExpensesForGroup(req, res, next) {
  try {
    getLogger().info('controllers', 'getAllExpensesForGroup', 'params', JSON.stringify(req.params));
    const { groupId } = req.params;
    const expenses = await ExpenseService.getAllExpensesForGroup(groupId);
    const response = genericDTL.getResponseDto(expenses);
    publishKafkaMessage({key: req.url, value: response});
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to settle expense. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function getBalanceBetweenAllUsersForGroup(req, res, next) {
  try {
    getLogger().info('controllers', 'getBalanceBetweenAllUsersForGroup', 'params', JSON.stringify(req.params));
    const { groupId } = req.params;
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
    const response = genericDTL.getResponseDto(balances);
    publishKafkaMessage({ key: req.path, value: response})
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to settle expense. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}


async function settleExpense(req, res, next) {
  try {
    getLogger().info('controllers', 'settleExpense', 'params', JSON.stringify(req.params));
    const { userId } = req.user;
    const { user2Id } = req.params;
    const updatedDetails = await ExpenseService.settleAllBalancesBetweenUsers(userId, user2Id);
    const response = genericDTL.getResponseDto(updatedDetails);
    publishKafkaMessage({key: req.url, value: response});
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to settle expense. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}
export default {
  getBalanceByUser2Id,
  getAllExpenses,
  getAllExpensesForGroup,
  createGroupExpense,
  getBalanceBetweenAllUsersForGroup,
  getRecentExpenses,
  settleExpense,
};
