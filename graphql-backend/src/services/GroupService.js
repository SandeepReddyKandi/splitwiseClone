import _ from 'underscore';
import Group from '../models/groups_model';
import Expense from '../models/expenses_model';

class GroupService {
    static async findGroupByName(name) {
        const condition = name ? { name:{$regex: name, $options: 'i'} }: null;
        const result = await Group.findOne(condition);
        return result;
    }

    static async getAllGroups() {
        const result = await Group.find();
        return result;
    }

    static async getAllGroupsByUserId(userId) {
        const allGroups = await Group.find();
        const invitedGroups = _.filter(allGroups, group => group.invitedUsers.includes(userId));
        const acceptedGroups = _.filter(allGroups, group => group.acceptedUsers.includes(userId));
        const result = {invitedGroups, acceptedGroups};
        return result;
    }

    static async getGroupById(groupId) {
        const result = await Group.findOne({_id: groupId});
        return result;
    }

    static async acceptGroupInvite(data) {
        const {groupId, userId} = data;
        const groupData = await Group.findOne( {_id: groupId});
        if (!groupData) throw new Error('Invalid group id');
        if (groupData.acceptedUsers.includes(userId)) return groupData;
        const newInvitedUsers = _.filter(groupData.invitedUsers, user => user !== userId);
        const newAcceptedUsers = [...groupData.acceptedUsers, userId];
        const values = {acceptedUsers: newAcceptedUsers, invitedUsers: newInvitedUsers};
        const condition = {_id: groupId};
        const result = await Group.updateMany(condition, values);
        return result;
    }

    static async createGroup(data) {
        const {name, userId, invitedUsers, currency} = data;
        const invitedUsersFinal = invitedUsers || [];
        const group = {name, invitedUsers: invitedUsersFinal, acceptedUsers: [userId], currency};
        const result = await Group.create(group);
        return result;
    }

    static async leaveGroup(userId, groupId) {
        const groupData = await Group.findOne({_id: groupId});
        if (!groupData) throw new Error('Invalid group id');
        const newAcceptedUsers = _.filter(groupData.acceptedUsers, user => user !== userId);
        const values = {acceptedUsers: newAcceptedUsers};
        if (newAcceptedUsers.length === 0 && groupData.invitedUsers.length === 0) {
            const result = await Group.deleteMany({_id: groupId});
            return result;
        }
        const condition = {_id: groupId};
        const result = await Group.updateOne(condition, values);
        return result;
    }

    static async updateGroupDetails(data) {
        const {groupId, name} = data;
        const values = {name};
        const condition = {_id: groupId};
        const result = await Group.updateOne(condition, values);
        return result;
    }

    static async getAllAcceptedUsersByGroupId(groupId) {
        const group = await Group.findOne({_id: groupId});
        const result = group.acceptedUsers;
        return result;
    }

    static async getGroupExpenseForUserId(groupId, userId) {
        const condition = { $or: [{ byUser: userId, groupId, settledAt: null }, { toUser: userId, groupId, settledAt: null }] };
        return Expense.find(condition);
    }
}

export default GroupService;
