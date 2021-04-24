import Post from '../models/post_model';

class PostService {
    static async findPostById(id) {
        const post = await Post.findById(id);
        return post;
    }
    static async createPost(data) {
        const {author, comment, expenseId} = data;
        console.log({
            author,
            comment,
            expenseId,
        })
        const result = new Post({
            author,
            comment,
            expenseId,
        });
        return await result.save();
    }
    static async getAllPostsByExpenseId(expenseId) {
        const posts = await Post.find({
            expenseId,
        });
        return posts;
    }
    static async deletePostById(_id) {
        const post = Post.deleteOne({
            _id,
        });
        return post;
    }
}

export default PostService;
