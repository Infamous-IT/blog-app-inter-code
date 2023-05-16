import { 
    getAllPosts,
    getPostById,
    removePost,
    updatePost,
    createPost,
    searchPosts,
    // searchByTitle,
    sortByCreationDate,
    sortByDateRangePicker,
    uploadMultiplePhotos
} from '../repository/post.js';

export const getAll = async () => {
    return await getAllPosts();
};

export const getPost = async (id) => {
    return await getPostById(id);
};

export const createPosts = async (data) => {
    return await createPost({...data});
};

export const updatePostById = async (id, data) => {
    const updatedPost = await updatePost(id, data);
    return await updatedPost.save();
};

export const removePostById = async (id) => {
    return await removePost(id);
};

export const searchPost = async (query) => {
    return await searchPosts(query);
}

// export const searchByPostsTitle = async (title) => {
//     return await searchByTitle(title);
// }

export const sortPostsByCreationDate = async (sortOrder) => {
    return await sortByCreationDate(sortOrder);
}

export const sortPostsByDateRangePicker = async (startDate, endDate) => {
    return await sortByDateRangePicker(startDate, endDate);
}

export const uploadMultiplePhoto = async (postId, files) => {
    return await uploadMultiplePhotos(postId, files);
}