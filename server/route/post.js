import express from 'express';
import multer from 'multer';

import {
    getAll,
    getPost,
    removePostById,
    updatePostById,
    createPostWithPhotos,
    searchPost,
    sortPostsByCreationDate,
    sortPostsByDateRangePicker,
    uploadMultiplePhoto,
    getPostTotalCount
} from '../service/post.js';

const router = express.Router();
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            //when i use my MacBook
            cb(null, "/Users/nazar_hlukhaniuk/documents/projects/blog-app-inter-code/server/assets/images");

            //when i use my PC
            // cb(null, "E:/DevProj/blog-app-inter-code/server/assets/images");
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileExtension = file.originalname.split(".").pop();
            cb(null, uniqueSuffix + "." + fileExtension);
        },
    })
});


// router.get('/', async (req, res, next) => {
//     try {
//         const offset = parseInt(req.query.offset) || 0;
//         const limit = parseInt(req.query.limit) || 6;
//         const [posts, total] = await Promise.all([
//             getAll(offset, limit),
//             getPostTotalCount()
//         ]);
//         res.status(200).json({ posts, total });
//     } catch (error) {
//         next(error);
//     }
// });

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
// if (req.photos.length > 10) {
        //     return res
        //         .status(400)
        //         .json({ message: "Maximum number of photos allowed is 10" });
        // }

router.post("/", upload.array("photos", 10), async (req, res, next) => {
    try {
        const uploadedPhotos = req.files.map(({filename, mimetype, path}) => ({
            url: `/assets/images/${filename}`,
            contentType: mimetype,
            path,
            filename,
        }));

        const newPost = await createPostWithPhotos({ ...req.body }, uploadedPhotos);
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
        const { startDate, endDate } = req.query;
        const posts = await sortPostsByDateRangePicker(startDate, endDate);
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const post = await getPost(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const postWithPhotoPaths = {
            ...post.toObject(),
            photos: post.photos.map((photo) => ({
                ...photo.toObject(),
                url: `${photo.url}`,
            })),
            comments: post.comments.map((comment) => ({
                ...comment.toObject(),
                text: `${comment.text}`
            })),
        };

        res.status(200).json(postWithPhotoPaths);
    } catch (error) {
        next(error);
    }
});

router.patch(
    "/:id/upload_photos",
    upload.array("photos", 10),
    async (req, res, next) => {
        try {
            if (req.files.length > 10) {
                return res
                    .status(400)
                    .json({ message: "Maximum number of photos allowed is 10" });
            }

            const uploadedPhotos = req.files.map((file) => ({
                url: `/assets/images/${file.filename}`,
                contentType: file.mimetype,
                path: file.path,
            }));

            const post = await uploadMultiplePhoto(req.params.id, uploadedPhotos);
            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    }
);

export default router;