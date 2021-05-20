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

export const GET_ALL_EXPENSES = gql`
    query($userId: String!) {
        getAllExpenses(userId: $userId) {
            success
            message
            data {
                totalcost
                pay
                recieve
                recieveExpenses
                getExpenses
            }
        }
    }
`;
