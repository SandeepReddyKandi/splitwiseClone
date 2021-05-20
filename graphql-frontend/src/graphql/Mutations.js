import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation($email: String, $password: String) {
        login (email: $email, password: $password) {
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

export const SIGNUP_USER = gql`
    mutation($userBody: CreateUserInput!) {
        signUpUser (userBody: $userBody) {
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

