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

export const getCommentByPostsId = async (postId) => {
    return await getCommentsByPostId(postId);
};

export const createComments = async (postId, commentText) => {
    const post = await getPost(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    const newComment = await createComment(postId, commentText);
    post.comments.push(newComment._id);
    await post.save();
    const populatedComment = await newComment.populate('post');
    return populatedComment;
};


export const updateCommentById = async (id, data) => {
    const updatedComment = await updateComment(id, data.text);
    return updatedComment;
};

export const removeCommentById = async (id) => {
    return await removeComment(id);
};

export const sortCommentsByCreationDate = async (sortOrder) => {
    return await sortByCreationDate(sortOrder);
}
