import { gql } from 'apollo-server-express';

const post = gql`
    type Post {
        id: String!
        author: String!
        comment: [String]
        expenseId: [String]
    }


    input CreatePostBody {
        comment: String
        expenseId: String
    }

    type PostResponse {
        success: Boolean
        message: String
        data: Post
    }


    type PostListResponse {
        success: Boolean
        message: String
        data: [Post]
    }


    extend type Query {
        getAllPosts(expenseId: String): PostListResponse!
    }

    extend type Mutation {
        createPost(name: String, postBody: CreatePostBody): PostResponse
        deletePost(postId: String): PostResponse
    }
`

export default post;
