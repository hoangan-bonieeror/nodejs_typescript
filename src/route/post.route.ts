import express from "express";
import { createPostHandler, deletePostHandler, getPostHandler, updatePostHandler } from "../controller/post.controller";
import { validateRequest } from "../middleware/validateRequest";
import { schema_createPost } from "../schema/post.schema";


const router = express.Router();

router.post('/', validateRequest(schema_createPost), createPostHandler)
router.get('/:postId', getPostHandler)
router.delete('/:postId', deletePostHandler)
router.put('/:postId', updatePostHandler)

export { router as postRoute }