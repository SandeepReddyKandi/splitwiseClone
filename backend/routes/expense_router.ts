import * as express from 'express';

import expenseController from '../controllers/expense_controller';
import isLoggedIn from '../middlewares/auth_middleware';

const router = express.Router();

router.get('/all', isLoggedIn, expenseController.getAllExpenses);
router.get('/balance/:user2Id', isLoggedIn, expenseController.getBalanceByUser2Id);
router.post('/create', isLoggedIn, expenseController.createGroupExpense);
router.get('/recent', isLoggedIn, expenseController.getRecentExpenses);
router.put('/settle/:user2Id', isLoggedIn, expenseController.settleExpense);
router.get('/all-group/:groupId', isLoggedIn, expenseController.getAllExpensesForGroup);
router.get('/balance-group/:groupId', isLoggedIn, expenseController.getBalanceBetweenAllUsersForGroup);

export default router;
