import Post from '../model/Post.js';

export const getAllPosts = () => {
    return Post.find();
}

export const getPostById = (id) => {
    return Post.findOne({_id: id});
}

export const createPost = (post) => {
    return Post.create(post);
}

export const updatePost = (id, post) => {
    return Post.findByIdAndUpdate(id, post, { new: true });;
}

export const removePost = (id) => {
    return Post.findByIdAndDelete(id);
}

export const searchPosts = (query) => {
    const {title, description, category} = query;
    const searchQuery = {};

    if (title) {
        searchQuery.title = { $regex: new RegExp(title, 'i') };
    }
    if (description) {
        searchQuery.description = { $regex: new RegExp(description, 'i') };
    }
    if (category) {
        searchQuery.category = { $regex: new RegExp(category, 'i') };
    }
    return Post.find({$or: [
        { title: searchQuery.title },
        { description: searchQuery.description },
        { category: searchQuery.category }
    ]});
}

export const sortByCreationDate = (sortOrder) => {
    let sortDirection = sortOrder === 'desc' ? -1 : 1;
    return Post.find().sort({ date: sortDirection }).exec();
}

export const sortByDateRangePicker = (startDate, endDate) => {
    return Post.find({date: { $gte: startDate, $lte: endDate }});
}

export const uploadMultiplePhotos = async (postId, files) => {
    const photos = files.map((file) => {
        return {
            data: file.buffer,
            contentType: file.mimeType
        };
    });
    return await Post.findByIdAndUpdate(postId, {$push: {photos: {$each: photos}}}, {new: true});
};