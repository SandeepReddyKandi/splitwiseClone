import { getAllPosts, createPost, deletePost} from "../controllers/post_controller";

const PostResolver = {
    Query:{
        getAllPosts: getAllPosts,
    },

    Mutation: {
        createPost: createPost,
        deletePost: deletePost,
    }
}

export default PostResolver;
