import _ from 'underscore';
import bcrypt from 'bcrypt';
import getLogger from '../utils/logger';
import config from '../config/config';
import {generateToken} from '../utils/authentication';
import UserService from '../services/UserService';
import userDtl from '../dtl/user_dtl';

async function createHashedPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function loginUser(_skip, {email, password}) {
  try {
    if (!email) throw new Error('email param required');
    if (!password) throw new Error('password param required');

    const user = await UserService.findUserByEmail(email);
    if (!user || _.isEmpty(user)) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    if (bcrypt.compareSync(password, user.password)) {
      const tokenData = {
        userId: user.id,
      };
      const loginToken = await generateToken(config.APP_TOKEN_SECRET, tokenData);
      await UserService.addUserAppAccessToken(user.id, loginToken);
      const userDetails = await UserService.getUserById(user.id);
      // call the `produce` function and log an error if it occurs
      // publishKafkaMessage({key: req.url, value: userDetails});
      return {
        success: true,
        data: userDetails
      }
    } else {
      return {
        success: false,
        message: 'Incorrect Password',
      }
    }

    // publishKafkaMessage({key: req.url, value: 'Incorrect Password!'});
    // return res.send(genericDTL.getResponseDto('', 'Incorrect password.'));
  } catch (err) {
    // publishKafkaMessage({key: req.url, value: `User Login failed. Err: ${err}`});
    // getLogger().error(`User Login failed. Err: ${err}`);
    // return next(err);
    return {
      success: true,
      message: `User Login failed. Err: ${err}`,
    }
  }
}

export async function signUpUser(_, { userBody }) {
  try {
    // getLogger().info('controllers', 'signUpUser', req.body);
    console.log(userBody)
    const { name, email, password, phone } = userBody;
    if (!name) throw new Error('name param required');
    if (!email) throw new Error('email param required');
    if (!phone) throw new Error('phone param required');
    if (!password) throw new Error('password param required');

    const user = await UserService.findUserByEmail(email);
    if (user && !_.isEmpty(user)){
      return {
        success: false,
        message:'User already exists with this email id.'
      };
    }

    const hashedPassword = await createHashedPassword(password);
    const newUser = await UserService.createNewUser({ name, email, phone, password: hashedPassword });
    const tokenData = {
      userId: newUser.id,
    };
    const loginToken = await generateToken(config.APP_TOKEN_SECRET, tokenData);
    await UserService.addUserAppAccessToken(newUser.id, loginToken);
    const userDetails = await UserService.getUserById(newUser.id);
    // publishKafkaMessage({key: req.url, value: userDetails});
    return {
      success: true,
      data: userDetails
    }
  } catch (err) {
    // publishKafkaMessage({key: req.url, value: `Unable to sign up user. Err ${err}`});
    getLogger().error(`Unable to sign up user. Err ${err}`);
    return {
      success: false,
      message: `Unable to sign up user .err ${err}`
    };
  }
}

export async function updateUserDetails(_skip, {userId, userDetails}) {
  try {
    getLogger().info('controllers', 'updateUserDetails', 'body', JSON.stringify(req.body));
    const { password, ...rest } = userDetails;
    let payload;
    console.log(userDetails)
    // let hashedPassword;
    // if (password) hashedPassword = await createHashedPassword(password);
    if (req.file && req.file.filename) { // TODO
    // if (false) {
      payload = {
        ...rest,
        // password: hashedPassword,
        imageURL:  req.file.filename,
      };
    } else {
      payload = {
        ...rest,
        // password: hashedPassword,
      };
    }
    await UserService.updateUserDetailsById(userId, payload);
    const updatedDetails = await UserService.getUserById(userId);
    // const response = genericDTL.getResponseDto(updatedDetails);
    // publishKafkaMessage({key: req.url, value: response});
    return {
      success: true,
      data: updatedDetails
    };
  } catch (err) {
    return {
      success: false,
      message: `Unable to update user details. Err. ${JSON.stringify(err)}`
    }
  }
}

export async function getAllUsers() {
  try {
    getLogger().info('controllers', 'getAllUsers');
    const users = await UserService.getAllUsers();
    const data = userDtl.getBasicUsersDetailDto(users);
    // publishKafkaMessage({key: req.url, value: response});
    return {
      success: true,
      data: data
    }
  } catch (err) {
    getLogger().error(`Error in getting all users. Err: ${err}`);
    // return next(err);
    return {
      success: false,
      message: `Error in getting all users. Err: ${err}`,
      data: []
    }
  }
}

export async function getUserDetails(userId) {
  try {
    getLogger().info('controllers', 'getUserDetails');
    const user = await UserService.getUserById(userId);
    return {
      success: true,
      data: user
    };
  } catch (err) {
    // getLogger().error('Error in getUserDetails', JSON.stringify(err));
    return {
      success: false,
      message: `Error in getUserDetails`,
    }
  }
}
