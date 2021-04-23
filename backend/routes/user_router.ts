import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path';
import userController from '../controllers/user_controller';
import isLoggedIn  from '../middlewares/auth_middleware';

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/images/',
    filename(req, file, cb) {
      cb(null, `${req.user.userId}${path.extname(file.originalname)}`);
    },
    limits: { fileSize: 1000000 },
  }),
}).single('image');

router.post('/login', userController.loginUser);
router.post('/signup', userController.signUpUser);
router.put('/update', isLoggedIn, upload, userController.updateUserDetails);
router.get('/all', isLoggedIn, userController.getAllUsers);
router.post('/me', isLoggedIn, userController.getUserDetails);

export default router;
