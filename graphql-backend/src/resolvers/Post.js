import { getAllPosts, createPost, deletePost} from "../controllers/post_controller";

const PostResolver = {
    Query:{
        getAllPosts: getAllPosts,
    },

    Mutation: {
        createPost: acceptGroupInvite,
        deletePost: createGroup,
    }
}

export default PostResolver;
