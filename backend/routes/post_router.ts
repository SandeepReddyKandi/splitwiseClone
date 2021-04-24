import * as express from 'express';

import postController from '../controllers/post_controller';
import isLoggedIn from '../middlewares/auth_middleware';

const router = express.Router();

router.get('/:expenseId', isLoggedIn, postController.getAllPosts);
router.post('/create', isLoggedIn, postController.createPost);
router.delete('/delete/:id', isLoggedIn, postController.deletePost);

export default router;
