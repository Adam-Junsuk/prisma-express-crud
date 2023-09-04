import express from 'express';
import PostsRouter from './post.router.js';
import CommentsRouter from './comments.router.js';

const router = express.Router();

//posts경로
router.use('/posts', [PostsRouter, CommentsRouter]);

export default router;
