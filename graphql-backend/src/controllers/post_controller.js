import * as _ from 'underscore';
import getLogger from '../utils/logger';
import genericDTL from '../dtl/generic';
import PostService from "../services/PostService";
import posts_dtl from "../dtl/posts_dtl";
import ExpenseService from "../services/ExpenseService";
import publishKafkaMessage from "../kafka/kafka-producer";


async function getAllPosts(req, res, next) {
    try {
        getLogger().info('controllers', 'getAllPosts');
        const { expenseId } = req.params;
        const posts = await PostService.getAllPostsByExpenseId(expenseId);
        const data = posts_dtl.getAllPostsDTO(posts);
        const response = genericDTL.getResponseDto(data);
        publishKafkaMessage({key: req.url, value: response});
        return res.send(response);
    } catch (err) {
        getLogger().error(`Unable to get all posts. Err. ${JSON.stringify(err)}`);
        return next(err);
    }
}

async function createPost(req, res, next) {
    try {
        getLogger().info('controllers', 'createPost');
        const { userId, name } = req.user;
        console.log(req.user);
        const { comment, expenseId } = req.body;
        const expense = await ExpenseService.findExpenseById(expenseId);
        if (!expense) return res.send(genericDTL.getResponseDto('', `There is no Expense with id ${expenseId}`));
        const newPost = await PostService.createPost({ author: name, comment, expenseId });
        const response = genericDTL.getResponseDto(newPost);
        publishKafkaMessage({key: req.url, value: response});
        return res.send(response);
    } catch (err) {
        getLogger().error(`Unable to create new post. Err. ${JSON.stringify(err)}`);
        return next(err);
    }
}

async function deletePost(req, res, next) {
    try {
        getLogger().info('controllers', 'deletePost');
        const { id } = req.params;
        const post = await PostService.findPostById(id);
        if (!post) return res.send(genericDTL.getResponseDto('', `There is no Post with id ${id}`));
        await PostService.deletePostById(id);
        // get the rest of the Posts
        const posts = await PostService.getAllPostsByExpenseId(post.expenseId)
        const response = genericDTL.getResponseDto(posts);
        publishKafkaMessage({key: req.url, value: response});
        return res.send(response);
    } catch (err) {
        getLogger().error(`Unable to create new post. Err. ${JSON.stringify(err)}`);
        return next(err);
    }
}


export default {
    getAllPosts,
    createPost,
    deletePost
};
