import {loginUser, signUpUser, updateUserDetails, getUserDetails, getAllUsers} from '../controllers/user_controller';

const userResolver = {
    Query: {
        users: getAllUsers
    },
    Mutation: {
        login: loginUser,
        updateDetails: updateUserDetails,
        signUpUser: signUpUser,
        getUserDetails: getUserDetails,
    }
}

export default userResolver;
