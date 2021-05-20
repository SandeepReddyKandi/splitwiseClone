import { gql } from '@apollo/client';

export const GET_USERS = gql`
    {
        users {
            success
            message
            data {
                id
                name
                email
                token
                language
                phone
                timezone
                imageURL
            }
        }
    }
`;


export const GET_USER_DETAIL = gql`
    query($userId: String!) {
        getUserDetails (userId: $userId) {
            success
            message
            data {
                id
                name
                email
                token
                language
                phone
                timezone
                imageURL
            }
        }
    }
`;

/*  ALL THE EXPENSE RELATED QUERIES */

export const GET_ALL_EXPENSES = gql`
    query($userId: String!) {
        getAllExpenses(userId: $userId) {
            success
            message
            data {
                totalcost
                pay
                recieve
                recieveExpenses {
                    name
                    id
                    totalAmt
                    groups {
                        id
                        amt
                        group
                    }
                }
                getExpenses {
                    name
                    id
                    totalAmt
                    groups {
                        id
                        amt
                        group
                    }
                }
            }
        }
    }
`;


export const GET_RECENT_ACTIVITIES = gql`
    query($userId: String!) {
        getRecentExpenses(userId: $userId) {
            success
            message
            data {
                timestamp
                byUserName
                toUserName
                type
                groupName
                description
                amount
                userId
                currency
            }
        }
    }
`;

export const GET_ALL_EXPENSES_FOR_GROUP = gql`
    query($groupId: String!) {
        getAllExpensesForGroup(groupId: $groupId) {
            success
            message
            data {
                id
                byUser
                toUser
                groupId
                amount
                description
                settledAt
                currency
            }
        }
    }
`;


/*  ALL THE GROUP RELATED QUERIES */


export const GET_ALL_GROUPS = gql`
    query($userId: String!) {
        getAllGroups(userId: $userId) {
            success
            message
            data {
                acceptedGroups {
                    id
                    name
                }
                invitedGroups {
                    id
                    name
                }
            }
        }
    }
`;


export const GET_GROUP_INFO = gql`
    query($groupId: String!) {
        getGroupInfo(groupId: $groupId) {
            success
            message
            data {
                id
                name
                acceptedUsers
                invitedUsers
                currency
                imageUrl
            }
        }
    }
`;

export const GET_BALANCE_BETWEEN_USERS_FOR_GROUP = gql`
    query($groupId: String!) {
        getBalanceBetweenAllUsersForGroup(groupId: $groupId) {
            success
            message
            data {
                byUserName
                toUserName
                balance
            }
        }
    }
`;


