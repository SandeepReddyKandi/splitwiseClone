const db = require('../models/index');
import User from "../models/user_model";


class UserService {
    static async createNewUser(data) {
        const { name, email, phone, password } = data;
        const user = { name, email, phone, password };
        const result = new User(user);
        return await result.save();
    }

    static async getUserById(userId) {
        const user = await User.findOne({ id: userId });
        return user;
    }

    static async findUserByEmail(email) {
        //TODO
        const condition = email ? { email: { [Op.like]: `%${email}%` } } : null;
        const result = await User.findOne(condition);
        return result;
    }

    static async updateUserDetailsById(userId, data) {
        const { currency, phone, name, password, language, timezone, imageURL } = data;
        const values = { currency, phone, name, password, language, timezone, imageURL };
        const condition = { id: userId };
        await User.update(values, condition); //TODO
        const user = await User.findOne({ id: userId });
        return user;
    }

    static async getUserByAppAccessToken(token) {
        const user = await User.findOne( token );
        return user;
    }

    static async unsetUserAppAccessToken(userId) {
        const condition = { returning: true, plain: true, where: { id: userId } };
        const user = await User.update({ token: '' }, condition); //TODO
        return user;
    }

    static async addUserAppAccessToken(userId, token) {
        const values = { token };
        const condition = { returning: true, plain: true, where: { id: userId } };
        const user = await User.update(values, condition);
        return user;
    }

    static async getAllUsers() {
        const result = await User.find();
        return result;
    }
}

export default UserService;
