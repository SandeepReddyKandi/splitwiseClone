import { gql } from 'apollo-server-express';
import { loginUser } from '../controllers/user_controller';

const user = gql`
    type User {
        id: String!
        name: String!
        email: String!
        password: String
        token: String
        language: String
        phone: String
        timezone: String
        imageURL: String
    }

    input CreateUserInput {
        name: String!
        email: String!
        password: String!
        phone: String!
    }

    input UpdateUserInput {
        name: String
        email: String
        age: Int
    }

    type Response {
        success: Boolean,
        message: String,
        data: User
    }
    
    type UserListResponse {
        success: Boolean!,
        message: String,
        data: [User]
    }

    
    extend type Query {
        users: UserListResponse!
        getUserDetails(userId: String): Response
    }

    extend type Mutation {
        login(email: String, password: String): Response
        updateDetails(userId: String, userDetails: UpdateUserInput): Response
        signUpUser(userBody: CreateUserInput): Response
    }
`

export default   user;
