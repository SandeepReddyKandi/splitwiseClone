import getLogger from '../utils/logger';
import PostService from "../services/PostService";
import posts_dtl from "../dtl/posts_dtl";
import ExpenseService from "../services/ExpenseService";


export async function getAllPosts(__, { expenseId }) {
    try {
        const posts = await PostService.getAllPostsByExpenseId(expenseId);
        const data = posts_dtl.getAllPostsDTO(posts);
        return {
            success: true,
            data,
        }
    } catch (err) {
        return {
            success: false,
            message: `Unable to get all posts. Err. ${JSON.stringify(err)}`
        }
    }
}

export async function createPost(__, { name, postBody }) {
    try {
        const { comment, expenseId } = postBody;
        const expense = await ExpenseService.findExpenseById(expenseId);
        if (!expense) {
            return {
                success: false,
                message: `There is no Expense with id ${expenseId}`
            }
        }
        const newPost = await PostService.createPost({ author: name, comment, expenseId });
        return {
            success: true,
            data: newPost,
        }
    } catch (err) {
        return {
            success: false,
            message: `Unable to create new post. Err. ${JSON.stringify(err)}`
        }
    }
}

export async function deletePost(__, {postId}) {
    try {
        getLogger().info('controllers', 'deletePost');
        const post = await PostService.findPostById(postId);
        if (!post) {
            return {
                success: false,
                message: `There is no Post with postId ${postId}`
            }
        }
        await PostService.deletePostById(postId);
        // get the rest of the Posts
        const data = await PostService.getAllPostsByExpenseId(post.expenseId)
        return {
            success: true,
            data,
        }
    } catch (err) {
        return {
            success: false,
            message: `Unable to create new post. Err. ${JSON.stringify(err)}`
        }
    }
}
