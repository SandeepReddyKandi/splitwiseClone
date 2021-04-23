import * as _ from 'underscore';
import * as bcrypt from 'bcrypt';
import getLogger from '../utils/logger';
import genericDTL from '../dtl/generic';
import config from '../config/config';
import authenticationUtil from '../utils/authentication';
import UserService from '../services/UserService';
import ExpenseService from '../services/ExpenseService';
import userDtl from '../dtl/user_dtl';

async function createHashedPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function loginUser(req, res, next) {
  try {
    getLogger().info('controllers', 'loginUser', req.body);
    const { email, password } = req.body;
    if (!email) throw new Error('email param required');
    if (!password) throw new Error('password param required');

    const user = await UserService.findUserByEmail(email);
    if (!user || _.isEmpty(user)) return res.send(genericDTL.getResponseDto('', 'User not found'));
    if (bcrypt.compareSync(password, user.password)) {
      const tokenData = {
        userId: user.id,
      };
      const loginToken = await authenticationUtil.generateToken(config.APP_TOKEN_SECRET, tokenData);
      await UserService.addUserAppAccessToken(user.id, loginToken);
      const userDetails = await UserService.getUserById(user.id);
      return res.send(genericDTL.getResponseDto(userDetails));
    }
    return res.send(genericDTL.getResponseDto('', 'Incorrect password.'));
  } catch (err) {
    getLogger().error(`User login failed. Err: ${err}`);
    return next(err);
  }
}

async function signUpUser(req, res, next) {
  try {
    getLogger().info('controllers', 'signUpUser', req.body);
    const { name, email, password, phone } = req.body;
    if (!name) throw new Error('name param required');
    if (!email) throw new Error('email param required');
    if (!phone) throw new Error('phone param required');
    if (!password) throw new Error('password param required');

    const user = await UserService.findUserByEmail(email);
    if (user && !_.isEmpty(user)) return res.send(genericDTL.getResponseDto('', 'User already exists with this email id.'));

    const hashedPassword = await createHashedPassword(password);
    const newUser = await UserService.createNewUser({ name, email, phone, password: hashedPassword });
    const tokenData = {
      userId: newUser.id,
    };
    const loginToken = await authenticationUtil.generateToken(config.APP_TOKEN_SECRET, tokenData);
    await UserService.addUserAppAccessToken(newUser.id, loginToken);
    const userDetails = await UserService.getUserById(newUser.id);
    return res.send(genericDTL.getResponseDto(userDetails));
  } catch (err) {
    getLogger().error(`Unable to sign up user. Err ${err}`);
    return next(err);
  }
}

async function updateUserDetails(req, res, next) {
  try {
    getLogger().info('controllers', 'updateUserDetails', 'body', JSON.stringify(req.body));
    const { userId } = req.user;
    const { password, ...rest } = req.body;
    let payload;
    let hashedPassword;
    if (password) hashedPassword = await createHashedPassword(password);
    if (req.file) {
      payload = {
        ...rest,
        password: hashedPassword,
        imageURL: req.file.path,
      };
    } else {
      payload = {
        ...rest,
        password: hashedPassword,
      };
    }
    await UserService.updateUserDetailsById(userId, payload);
    const updatedDetails = await UserService.getUserById(userId);
    const response = genericDTL.getResponseDto(updatedDetails);
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to update user details. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function fetchBalance(req, res, next) {
  try {
    getLogger().info('controllers', 'fetchBalance');
    const { userId } = req.user;
    // @ts-ignore
    const balance = await ExpenseService.fetchBalanceByUserId(userId);
    // @ts-ignore
    const data = userDtl.getFetchBalanceDto(balance);
    const response = genericDTL.getResponseDto(data);
    return res.send(response);
  } catch (err) {
    getLogger().error(`Error in fetching balance. Err: ${err}`);
    return next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    getLogger().info('controllers', 'getAllUsers');
    const users = await UserService.getAllUsers();
    const data = userDtl.getBasicUsersDetailDto(users);
    const response = genericDTL.getResponseDto(data);
    return res.send(response);
  } catch (err) {
    getLogger().error(`Error in getting all users. Err: ${err}`);
    return next(err);
  }
}

async function getUserDetails(req, res, next) {
  try {
    getLogger().info('controllers', 'getUserDetails');
    const { userId } = req.user;
    const user = await UserService.getUserById(userId);
    const response = genericDTL.getResponseDto(user);
    return res.send(response);
  } catch (err) {
    getLogger().error('Error in getUserDetails', JSON.stringify(err));
    return next(err);
  }
}

export default {
  loginUser,
  signUpUser,
  fetchBalance,
  updateUserDetails,
  getAllUsers,
  getUserDetails,
}
