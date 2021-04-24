import * as _ from 'underscore';
import getLogger from '../utils/logger';
import genericDTL from '../dtl/generic';
import groupsDtl from '../dtl/groups_dtl';
import GroupService from '../services/GroupService';

async function getGroupInfo(req, res, next) {
  try {
    getLogger().info('controllers', 'getGroupInfo');
    const { groupId } = req.params;
    const group = await GroupService.getGroupById(groupId);
    const response = genericDTL.getResponseDto(group);
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to get groups info. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function getAllGroups(req, res, next) {
  try {
    getLogger().info('controllers', 'getAllGroups');
    const { userId } = req.user;
    const groups = await GroupService.getAllGroupsByUserId(userId);
    const data = groupsDtl.getAllGroupsDto(groups);
    const response = genericDTL.getResponseDto(data);
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to get all groups. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function acceptGroupInvite(req, res, next) {
  try {
    getLogger().info('controllers', 'acceptGroupInvite');
    const { userId } = req.user;
    const { groupId } = req.params;
    await GroupService.acceptGroupInvite({ groupId, userId });
    const updatedDetails = await GroupService.getGroupById(groupId);
    const data = groupsDtl.getBasicGroupDetails(updatedDetails);
    const response = genericDTL.getResponseDto(data);
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to accept group invite. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function createGroup(req, res, next) {
  try {
    getLogger().info('controllers', 'createGroup');
    const { userId } = req.user;
    const data = req.body;
    const { name, invitedUsers, currency } = data;
    const group = await GroupService.findGroupByName(name);
    if (group && !_.isEmpty(group)) return res.send(genericDTL.getResponseDto('', 'Group with this name already exists'));
    const newGroup = await GroupService.createGroup({ userId, name, currency, invitedUsers });
    const resData = groupsDtl.getBasicGroupDetails(newGroup);
    const response = genericDTL.getResponseDto(resData);
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to create new group. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function leaveGroup(req, res, next) {
  try {
    getLogger().info('controllers', 'leaveGroup');
    const { userId } = req.user;
    const { groupId } = req.params;
    const groupExpense = await GroupService.getGroupExpenseForUserId(groupId, userId);
    if (groupExpense && !_.isEmpty(groupExpense)) return res.send(genericDTL.getResponseDto('', 'You can not leave group without clearing dues.'));
    await GroupService.leaveGroup(userId, groupId);
    const updatedDetails = await GroupService.getGroupById(groupId);
    const data = groupsDtl.getBasicGroupDetails(updatedDetails);
    const response = genericDTL.getResponseDto(data);
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to leave group. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

async function updateGroup(req, res, next) {
  try {
    getLogger().info('controllers', 'updateGroup', 'body', JSON.stringify(req.body));
    const { name, groupId } = req.body;
    await GroupService.updateGroupDetails({ groupId, name });
    const updatedDetails = await GroupService.getGroupById(groupId);
    const data = groupsDtl.getBasicGroupDetails(updatedDetails);
    const response = genericDTL.getResponseDto(data);
    return res.send(response);
  } catch (err) {
    getLogger().error(`Unable to update user details. Err. ${JSON.stringify(err)}`);
    return next(err);
  }
}

export default {
  getAllGroups,
  getGroupInfo,
  acceptGroupInvite,
  createGroup,
  leaveGroup,
  updateGroup,
};
