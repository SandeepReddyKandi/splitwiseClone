import {getGroupInfo, updateGroup, createGroup, leaveGroup, acceptGroupInvite, getAllGroups } from "../controllers/group_controller";

const GroupResolvers = {
    Query:{
        getGroupInfo: getGroupInfo,
        getAllGroups: getAllGroups,
    },

    Mutation: {
        acceptGroupInvite: acceptGroupInvite,
        createGroup: createGroup,
        leaveGroup: leaveGroup,
        updateGroup: updateGroup,
    }
}

export default GroupResolvers;
