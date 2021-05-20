import {loginUser, signUpUser, updateUserDetails, getUserDetails, getAllUsers} from '../controllers/user_controller';

const userResolver = {
    Query: {
        users: getAllUsers,
        getUserDetails: getUserDetails,
    },
    Mutation: {
        login: loginUser,
        updateDetails: updateUserDetails,
        signUpUser: signUpUser,
    }
}

export default userResolver;
