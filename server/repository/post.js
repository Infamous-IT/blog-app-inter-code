import Post from '../model/Post.js';

export const getAllPosts = () => {
    return Post.find();
}

// for pagination
// export const getAllPosts = (offset, limit) => {
//     return Post.find().skip(offset).limit(limit);
// }

export const getTotalCount = () => {
    try {
        const count = Post.countDocuments();
        return count;
    } catch (error) {
        throw new Error('Error retrieving total count');
    }
}

export const getPostById = (id) => {
    return Post.findOne({_id: id});
}

export const createPost = (post) => {
    return Post.create(post);
}

export const updatePost = (id, post) => {
    return Post.findByIdAndUpdate(id, { $set: post }, { new: true });
};


export const removePost = (id) => {
    return Post.findByIdAndDelete(id);
}

// export const searchPosts = (query) => {
//     const {title, description, category} = query;
//     const searchQuery = {};
//
//     if (title) {
//         searchQuery.title = { $regex: new RegExp(title, 'i') };
//     }
//     if (description) {
//         searchQuery.description = { $regex: new RegExp(description, 'i') };
//     }
//     if (category) {
//         searchQuery.category = { $regex: new RegExp(category, 'i') };
//     }
//
//     return Post.find({$or: [
//         { title: searchQuery.title },
//         { description: searchQuery.description },
//         { category: searchQuery.category }
//     ]});
// }
//
// export const sortByCreationDate = (sortOrder) => {
//     let sortDirection = sortOrder === 'desc' ? -1 : 1;
//     return Post.find().sort({ date: sortDirection }).exec();
// }
//
// export const sortByDateRangePicker = (startDate, endDate) => {
//     return Post.find({date: { $gte: startDate, $lte: endDate }});
// }

export const searchPosts = (query) => {
    const { title, description, category, sortOrder, startDate, endDate } = query;
    const aggregatePipeline = [];

    // Search by title, description, and category
    if (title || description || category) {
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

        aggregatePipeline.push({
            $match: {
                $or: [
                    { title: searchQuery.title },
                    { description: searchQuery.description },
                    { category: searchQuery.category }
                ]
            }
        });
    }

    // Sort by creation date
    if (sortOrder) {
        const sortDirection = sortOrder === 'desc' ? -1 : 1;
        aggregatePipeline.push({
            $sort: { date: sortDirection }
        });
    }

    // Filter by date range
    if (startDate && endDate) {
        aggregatePipeline.push({
            $match: {
                date: { $gte: startDate, $lte: endDate }
            }
        });
    }

    return Post.aggregate(aggregatePipeline);
};


export const uploadMultiplePhotos = (postId, files) => {
    const photos = files.map((file) => {
        return {
            url: `/assets/images/${file.filename}`,
            contentType: file.mimetype,
            path: file.path,
        };
    });
    return Post.findByIdAndUpdate(
        postId,
        {$push: {photos: {$each: photos}}},
        {new: true}
    );
};