import express from 'express';
import multer from 'multer';

import {
    getAll,
    getPost,
    removePostById,
    updatePostById,
    createPosts,
    searchPost,
    sortPostsByCreationDate,
    sortPostsByDateRangePicker,
    uploadMultiplePhoto
} from '../service/post.js';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
});


router.get("/", async (req, res, next) => {
    try {
        const result = await getAll();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.patch("/:id", async (req, res, next) => {
    try {
        const updatedPost = await updatePostById(
            req.params.id, req.body,
            { $set: req.body.data },
            { new: true });
        res.status(201).json(updatedPost);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await removePostById(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const post = await getPost(req.params.id);
        const postWithPhotoPaths = {
            ...post._doc,
            photos: post.photos.map(photo => ({
                ...photo,
                path: `/path/to/photos/${photo._id}`
            }))
        };
        
        res.status(200).json(postWithPhotoPaths);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const newPost = await createPosts({...req.body});
        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
});

router.get("/search/by", async (req, res, next) => {
    try {
        const posts = await searchPost(req.query);
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
});

router.get("/sort/by_creation_date", async (req, res, next) => {
    try {
        let sortOrderByDefault = req.query.order || 'asc';
        const posts = await sortPostsByCreationDate(sortOrderByDefault);
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
});

router.get("/sort/by_date_range_picker", async (req, res, next) => {
    try {
        const {startDate, endDate} = req.query;
        const posts = await sortPostsByDateRangePicker(startDate, endDate);
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/upload_photos', upload.array('photos', 10), async (req, res, next) => {
    try {
        if (req.files.length > 10) {
            return res.status(400).json({ message: 'Maximum number of photos allowed is 10' });
        }
        const post = await uploadMultiplePhoto(req.params.id, req.files);
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
});

export default router;