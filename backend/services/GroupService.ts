const _ = require('underscore');
import Group from "../models/groups_model";

class GroupService {
    static async findGroupByName(name) {
        const condition = name ? {name: {[Op.like]: `%${name}%`}} : null;
        const result = await Group.findOne({where: condition});
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
        const result = await Group.findOne({id: groupId});
        return result;
    }

    static async acceptGroupInvite(data) {
        const {groupId, userId} = data;
        const groupData = await Group.findOne( {id: groupId});
        if (!groupData) throw new Error('Invalid group id');
        if (groupData.acceptedUsers.includes(userId)) return groupData;
        const newInvitedUsers = _.filter(groupData.invitedUsers, user => user !== userId);
        const newAcceptedUsers = [...groupData.acceptedUsers.split(';'), userId]; // TODO added the manipulation here
        const values = {acceptedUsers: newAcceptedUsers, invitedUsers: newInvitedUsers};
        const condition = {returning: true, plain: true, where: {id: groupId}};
        const result = await Group.update(values, condition); // TODO
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
        const groupData = await Group.findOne({where: {id: groupId}});
        if (!groupData) throw new Error('Invalid group id');
        const newAcceptedUsers = _.filter(groupData.acceptedUsers, user => user !== userId);
        const values = {acceptedUsers: newAcceptedUsers};
        if (newAcceptedUsers.length === 0 && groupData.invitedUsers.length === 0) {
            const result = await Group.deleteMany({id: groupId});
            return result;
        }
        const condition = {returning: true, plain: true, where: {id: groupId}};
        const result = await Group.update(values, condition); // TODO
        return result;
    }

    static async updateGroupDetails(data) {
        const {groupId, name} = data;
        const values = {name};
        // TODO
        const condition = {returning: true, plain: true, where: {id: groupId}};
        const result = await Group.update(values, condition);
        return result;
    }

    static async getAllAcceptedUsersByGroupId(groupId) {
        // TODO
        const group = await Group.findOne({plain: true, where: {id: groupId}});
        const result = group.acceptedUsers;
        return result;
    }
}

export default GroupService;
