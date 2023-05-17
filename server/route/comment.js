import express from 'express';
import {
    getAll,
    getComment,
    getCommentByPostsId,
    removeCommentById,
    updateCommentById,
    createComments,
    sortCommentsByCreationDate
} from '../service/comment.js';
import {
    getPost,
} from '../service/post.js'

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const result = await getAll();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/post/:postId", async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const comments = await getCommentByPostsId(postId);
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
});

router.patch("/:id", async (req, res, next) => {
    try {
        const updatedComment = await updateCommentById(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
    res.status(200).json(updatedComment);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    const post = await getPost(req.params.id);
    try {
        await removeCommentById(req.params.id);
        try {
            await updatePostById(post, {
                $pull: { rooms: req.params.id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Comment has been deleted.");
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const comment = await getComment(req.params.id);
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
});

router.post("/:postId", async (req, res, next) => {
    try {
        const {postId} = req.params;
        const body = req.body;
        if(!body?.text) {
            throw new Error("Text cannot be empty!");
        }
        const result = await createComments(postId, body.text);
        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
});

router.get("/sort/by_creation_date", async (req, res, next) => {
    try {
        let sortOrderByDefault = req.query.order || 'asc';
        const posts = await sortCommentsByCreationDate(sortOrderByDefault);
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
});

export default router;