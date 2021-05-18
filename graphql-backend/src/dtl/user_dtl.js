import * as _ from 'underscore';

function getBasicUsersDetailDto(users) {
  const data = _.map(users, (user) => {
    const { id, name, email, phone } = user;
    return { id, name, email, phone };
  });
  return data;
}

export default {getBasicUsersDetailDto}
