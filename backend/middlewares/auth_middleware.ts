import * as _ from 'underscore';
import config from '../config/config';
import authenticationUtil from '../utils/authentication';
import genericDtl from '../dtl/generic';
import getLogger from '../utils/logger';
import UserService from "../services/UserService";

async function isLoggedIn(req, res, next) {
  try {
    let tokenData;
    const bearerToken = req.headers.authorization;
    getLogger().debug('isLoggedIn User Check called with bearerToken', bearerToken);

    if (!bearerToken || !bearerToken.length) {
      getLogger().error('isLoggedIn User Check did not get authorization header', req.headers.authorization);
      const response = genericDtl.getResponseDto({}, 'Unauthorized User!');
      return res.status(401).send(response);
    }

    try {
      tokenData = await authenticationUtil.verifyJwtToken(config.APP_TOKEN_SECRET, bearerToken);
    } catch (err) {
      getLogger().error(`Error while trying to verify token. Err: ${err}`);

      const appAccessToken = bearerToken.split(' ')[1];
      const user = await UserService.getUserByAppAccessToken(appAccessToken);
      if (!_.isEmpty(user)) {
        await UserService.unsetUserAppAccessToken(user.id);
      }

      const response = genericDtl.getResponseDto({}, 'Unauthorized User!');
      return res.status(401).send(response);
    }

    const { decodedToken } = tokenData;
    const { userId } = decodedToken;
    const decodedUser = await UserService.getUserById(userId);
    if (!decodedUser || _.isEmpty(decodedUser)) {
      const response = genericDtl.getResponseDto({}, 'Invalid token!');
      return res.status(401).send(response);
    }
    req.user = { userId: decodedUser.id, email: decodedUser.email,  name: decodedUser.name };
    return next();
  } catch (err) {
    getLogger().error(`Error while verifying user auth. Err: ${err}`);
    return next(err);
  }
}

export default isLoggedIn;
