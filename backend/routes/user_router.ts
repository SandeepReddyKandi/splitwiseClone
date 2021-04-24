import * as express from 'express';
import userController from '../controllers/user_controller';
import isLoggedIn from '../middlewares/auth_middleware';
import uploadMiddleware from '../middlewares/upload';

const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/signup', userController.signUpUser);
router.put('/update', isLoggedIn, uploadMiddleware, userController.updateUserDetails);
router.get('/all', isLoggedIn, userController.getAllUsers);
router.post('/me', isLoggedIn, userController.getUserDetails);

export default router;
