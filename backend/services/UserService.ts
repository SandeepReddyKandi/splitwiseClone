import User from "../models/user_model";

class UserService {
    static async createNewUser(data) {
        const { name, email, phone, password } = data;
        const user = { name, email, phone, password };
        const result = new User(user);
        return await result.save();
    }

    static async getUserById(userId) {
        const user = await User.findById( userId );
        return user;
    }

    static async findUserByEmail(email) {
        const condition = email ? { email:{$regex: email, $options: 'i'} } : null;
        const result = await User.findOne(condition);
        return result;
    }

    static async updateUserDetailsById(userId, data) {
        const { currency, phone, name, language, timezone, imageURL } = data;
        const values = { currency, phone, name, language, timezone, imageURL };
        const condition = { _id: userId };
        await User.updateOne(condition, values);
        const user = await User.findById(userId);
        return user;
    }

    static async getUserByAppAccessToken(token) {
        const user = await User.findOne( token );
        return user;
    }

    static async unsetUserAppAccessToken(userId) {
        const condition = { _id: userId };
        const user = await User.updateOne(condition, { token: '' });
        return user;
    }

    static async addUserAppAccessToken(userId, token) {
        const condition = { _id: userId };
        const user = await User.updateOne(condition, {token});
        // user.token = token;
        return user;
    }

    static async getAllUsers() {
        const result = await User.find();
        return result;
    }
}

export default UserService;
