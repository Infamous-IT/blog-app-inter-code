import { Router } from "express";
import post from "./post.js";
import comment from "./comment.js";

const router = Router();

router.use("/posts", post);
router.use("/comments", comment);

export default router;