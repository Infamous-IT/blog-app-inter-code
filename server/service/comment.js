import {
    getAllComments,
    getCommentById,
    getCommentsByPostId,
    removeComment,
    updateComment,
    createComment,
    sortByCreationDate
} from '../repository/comment.js';
import {
    getPost,
    updatePostById
} from '../service/post.js'

export const getAll = async () => {
    return await getAllComments();
};

export const getComment = async (id) => {
    return await getCommentById(id);
};

export const getCommentByPostsId = async (id) => {
    return await getCommentsByPostId(id);
}

export const createComments = async (postId, commentText) => {
    const post = await getPost(postId);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    const newComment = await createComment(post, commentText);
    await newComment.save();
    post.comments.push(newComment._id);
    return await post.save();
};

export const updateCommentById = async (id, data) => {
    const updatedComment = await updateComment(id, data);
    return await updatedComment.save();
};

export const removeCommentById = async (id) => {
    return await removeComment(id);
};

export const sortCommentsByCreationDate = async (sortOrder) => {
    return await sortByCreationDate(sortOrder);
}
