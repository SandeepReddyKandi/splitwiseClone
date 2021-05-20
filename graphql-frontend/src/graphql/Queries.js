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
