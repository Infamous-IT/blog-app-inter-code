import Comment from '../model/Comment.js';

export const getAllComments = () => {
    return Comment.find();
}

export const getCommentsByPostId = (postId) => {
    return Comment.find({ post: postId });
}

export const getCommentById = (id) => {
    return Comment.findById(id);
}

export const createComment = (postId, text) => {
    return Comment.create({postId, text});
}

export const updateComment = (id, text) => {
    return Comment.findByIdAndUpdate(id, text, { new: true });
}

export const removeComment = (id) => {
    return Comment.findByIdAndDelete(id);
}

export const sortByCreationDate = (sortOrder) => { 
    let sortDirection = sortOrder === 'desc' ? -1 : 1;
    return Comment.find().sort({ date: sortDirection }).exec();
}