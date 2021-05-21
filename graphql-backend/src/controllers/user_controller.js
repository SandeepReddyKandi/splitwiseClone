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
    if (!email){
      return {
      success: false,
      message: 'Email is required field'
    }
  }
    if (!password) {
      return {
        success: false,
        message: 'Password is required field'
      };
    }

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
  } catch (err) {
    return {
      success: false,
      message: `User Login failed. Err: ${err}`,
    }
  }
}

export async function signUpUser(_, { userBody }) {
  try {
    const { name, email, password, phone } = userBody;
    if (!name) {
      return {
        success: false, message: 'name param required'
      }
    }
    if (!email) {
      return {
        success: false, message: 'email param required'
      }
    }
    if (!phone) {
      return {
        success: false, message: 'phone param required'
      }
    }
    if (!password) {
      return {
        success: false, message: 'password param required'
      }
    }

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
    return {
      success: true,
      data: userDetails
    }
  } catch (err) {
    return {
      success: false,
      message: `Unable to sign up user .err ${err}`
    };
  }
}

export async function updateUserDetails(_skip, {userId, userDetails}) {
  try {
    const { password, ...rest } = userDetails;
    let payload = {
      ...rest,
    };
    if (password) {
      const hashedPassword = createHashedPassword(password);
      payload = {
        ...payload,
        password: hashedPassword
      }
    }
    await UserService.updateUserDetailsById(userId, payload);
    const updatedDetails = await UserService.getUserById(userId);
    return {
      success: true,
      data: updatedDetails
    };
  } catch (err) {
    console.log('USER UPDATE', err)
    return {
      success: false,
      message: `Unable to update user details. Err. ${JSON.stringify(err)}`
    }
  }
}

export async function getAllUsers() {
  try {
    const users = await UserService.getAllUsers();
    const data = userDtl.getBasicUsersDetailDto(users);
    return {
      success: true,
      data: data
    }
  } catch (err) {
    return {
      success: false,
      message: `Error in getting all users. Err: ${err}`,
      data: []
    }
  }
}

export async function getUserDetails(__, {userId}) {
  try {
    const user = await UserService.getUserById(userId);
    return {
      success: true,
      data: user
    };
  } catch (err) {
    return {
      success: false,
      message: `Error in getUserDetails`,
    }
  }
}
