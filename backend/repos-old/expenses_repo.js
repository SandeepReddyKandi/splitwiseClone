const _ = require('underscore');
const db = require('../models/index');

const { expenses } = db;
const { Op } = db.Sequelize;
// TODO DONE
function getTotalAmount(allExpenses) {
  let total = 0;
  if (!allExpenses || !Array.isArray(allExpenses)) return total;
  allExpenses.forEach((expense) => {
    total += expense.amount;
    return expense;
  });
  return total;
}
// TODO DONE
async function getBalanceBetweenUsers(user1Id, user2Id) {
  const getCondition = { where: { byUser: user1Id, toUser: user2Id, settledAt: null } };
  const payCondition = { where: { byUser: user2Id, toUser: user1Id, settledAt: null } };
  const getExpenses = await expenses.findAll(getCondition);
  const payExpenses = await expenses.findAll(payCondition);
  const getAmount = getTotalAmount(getExpenses);
  const payAmount = getTotalAmount(payExpenses);
  const balance = getAmount - payAmount;
  return { getAmount, payAmount, balance };
}

// TODO DONE
async function settleAllBalancesBetweenUsers(byUser, toUser) {
  const values = { settledAt: Date.now() };
  const condition = { returning: true, plain: true, where: { [Op.or]: [{ byUser, toUser }, { byUser: toUser, toUser: byUser }] } };
  const result = await expenses.update(values, condition);
  return result;
}
// TODO DONE
async function getAllExpensesForUserId(userId) {
  const getCondition = { where: { byUser: userId, settledAt: null } };
  const payCondition = { where: { toUser: userId, settledAt: null } };
  const getExpenses = await expenses.findAll(getCondition);
  const payExpenses = await expenses.findAll(payCondition);
  return { getExpenses, payExpenses };
}

// TODO DONE
async function createGroupExpense(data) {
  const { userId, userIds, groupId, amount, description, currency } = data;
  const amountPerUser = amount / (userIds.length);
  const result = await Promise.all(_.map(userIds, async (toUserId) => {
    if (userId != toUserId) {
      const newExpenseData = { byUser: userId, toUser: toUserId, amount: amountPerUser, description, groupId, currency };
      const newExpense = await expenses.create(newExpenseData);
      return newExpense;
    }
  }));
  return result;
}
// TODO DONE
async function getAllExpensesByGroupId(groupId, userId) {
  const condition = { where: { [Op.or]: [{ byUser: userId, groupId }, { toUser: userId, groupId }] } };
  const result = await expenses.findAll(condition);
  return result;
}

// TODO DONE
async function getAllExpensesForGroup(groupId) {
  return expenses.findAll({ where: { groupId } });
  // return JSON.stringify(result);
}
// TODO DONE
async function getGroupExpenseForUserId(groupId, userId) {
  const condition = { where: { [Op.or]: [{ byUser: userId, groupId, settledAt: null }, { toUser: userId, groupId, settledAt: null }] } };
  return expenses.findAll(condition);
}

module.exports = {
  getBalanceBetweenUsers,
  settleAllBalancesBetweenUsers,
  getAllExpensesForUserId,
  createGroupExpense,
  getAllExpensesByGroupId,
  getAllExpensesForGroup,
  getGroupExpenseForUserId,
};
