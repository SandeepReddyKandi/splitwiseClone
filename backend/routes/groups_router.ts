import express from 'express';
import groupsController from '../controllers/group_controller.ts';
import { isLoggedIn } from '../middlewares/auth_middleware.ts';

const router = express.Router();

router.get('/all', isLoggedIn, groupsController.getAllGroups);
router.get('/:groupId', isLoggedIn, groupsController.getGroupInfo);
router.put('/accept-invite/:groupId', isLoggedIn, groupsController.acceptGroupInvite);
router.post('/create', isLoggedIn, groupsController.createGroup);
router.put('/leave/:groupId', isLoggedIn, groupsController.leaveGroup);
router.put('/update', isLoggedIn, groupsController.updateGroup);

export default router;
