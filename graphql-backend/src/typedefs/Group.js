import { gql } from 'apollo-server-express';

const group = gql`
    type Group {
        id: String!
        name: String!
        acceptedUsers: [String]
        invitedUsers: [String]
        currency: String
        imageUrl: String
    }
    
    type IdNameObj {
        id: String
        name: String
    }

    type AllGroupInfo {
        acceptedGroups: [IdNameObj]
        invitedGroups: [IdNameObj]
    }

    input CreateGroupInput {
        name: String
        invitedUsers: [String]
        currency: String
    }

    type GroupResponse {
        success: Boolean
        message: String
        data: Group
    }

    type AllGroupResponse {
        success: Boolean!
        message: String
        data: AllGroupInfo
    }

    extend type Query {
        getGroupInfo(groupId: String): GroupResponse!
        getAllGroups(userId: String): AllGroupResponse
    }

    extend type Mutation {
        acceptGroupInvite(userId: String, groupId: String): GroupResponse
        createGroup(userId: String, data: CreateGroupInput): GroupResponse
        leaveGroup(userId: String, groupId: String): GroupResponse
        updateGroup(name: String, groupId: String): GroupResponse
    }
`

export default   group;
