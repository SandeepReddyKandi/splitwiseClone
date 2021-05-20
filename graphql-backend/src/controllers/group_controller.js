import _ from 'underscore';
import groupsDtl from '../dtl/groups_dtl';
import GroupService from '../services/GroupService';

export async function getGroupInfo(__, {groupId}) {
  try {
    const data = await GroupService.getGroupById(groupId);
    return {
      success: true,
      data,
    }
  } catch (err) {
    return {
      success: false,
      message: `Unable to get groups info. Err. ${JSON.stringify(err)}`,
    }
  }
}

export async function getAllGroups(__, { userId }) {
  try {
    const groups = await GroupService.getAllGroupsByUserId(userId);
    const data = groupsDtl.getAllGroupsDto(groups);
    console.log('DATA IS ', data)
    return {
      success: true,
      data,
    }
  } catch (err) {
    return {
      success: false,
      message: `Unable to get all groups. Err. ${JSON.stringify(err)}`,
    }
  }
}

export async function acceptGroupInvite(__, { userId, groupId}) {
  try {
    await GroupService.acceptGroupInvite({ groupId, userId });
    const updatedDetails = await GroupService.getGroupById(groupId);
    const data = groupsDtl.getBasicGroupDetails(updatedDetails);
    return {
      success: true,
      data,
    }
  } catch (err) {
    return {
      success: false,
      message: `Unable to accept group invite. Err. ${JSON.stringify(err)}`,
    }
  }
}

export async function createGroup(__, {userId, data}) {
    const { name, invitedUsers, currency } = data;
    try {
    const group = await GroupService.findGroupByName(name);
    if (group && !_.isEmpty(group)) {
      return {
        success: false,
        message:  'Group with this name already exists',
      }
    }
    const newGroup = await GroupService.createGroup({ userId, name, currency, invitedUsers });
    console.log('new GgrouP IS', newGroup)
    const data = groupsDtl.getBasicGroupDetails(newGroup);
    return {
      success: true,
      data,
    }
  } catch (err) {
    console.log('[GROUP CONTROLLER] ERROR IS', err)
    return {
      success: false,
      message: `Unable to create new group. Err. ${JSON.stringify(err)}`,
    }
  }
}

export async function leaveGroup(__, {userId, groupId}) {
  try {
    const groupExpense = await GroupService.getGroupExpenseForUserId(groupId, userId);
    if (groupExpense && !_.isEmpty(groupExpense)) {
      return {
        success: false,
        message: 'You can not leave group without clearing dues.'
      }
    }
    await GroupService.leaveGroup(userId, groupId);
    const updatedDetails = await GroupService.getGroupById(groupId);
    const data = groupsDtl.getBasicGroupDetails(updatedDetails);
    return {
      success: true,
      data,
    }
  } catch (err) {
    return {
      success: false,
      message: `Unable to leave group. Err. ${JSON.stringify(err)}`,
    }
  }
}

export async function updateGroup(__, { name, groupId}) {
  try {
    await GroupService.updateGroupDetails({ groupId, name });
    const updatedDetails = await GroupService.getGroupById(groupId);
    const data = groupsDtl.getBasicGroupDetails(updatedDetails);
    return {
      success: true,
      data,
    }
  } catch (err) {
    return {
      success: false,
      message: `Unable to update user details. Err. ${JSON.stringify(err)}`
    }
  }
}
