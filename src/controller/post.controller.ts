import { Request, Response } from "express";
import { get } from "lodash";
import { createPost, deletePost, findAndUpdate, findPost } from "../service/post.service";

export const createPostHandler = async (req : Request, res : Response) => {
    try {
        const userId= get(req, "user._id")

        const body = req.body

        // @ts-ignore
        console.log(req.user)

        const post = await createPost({ ...body, user : userId })

        return res
            .status(200)
            .json({
                code : 200,
                status : "Successfully",
                data : post
            })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                code : 500,
                status : "Internal System Error",
                msg : "Something went wrong"
            })
    }
}

export const updatePostHandler = async (req : Request, res : Response) => {
    try {
        const userId = get(req, "user._id")
        const postId = get(req, "params.postId")
        const post = await findPost({ postId });
        if(!post) {
            return res.sendStatus(404);
        }
    
        if(String(userId) !== String(post.user)) return res.sendStatus(401)
    
        const updatedDocument = await findAndUpdate({ _id : postId }, req.body)
    
        return res
            .status(200)
            .json({
                code : 200,
                status : "Successfully",
                data : updatedDocument
            })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                code : 500,
                status : "Internal System Error",
                msg : "Something went wrong"
            })
    }
}

export const getPostHandler = async (req : Request, res : Response) => {
    try {
        const postId = get(req, "params.postId")

        const post = await findPost({ _id : postId });
    
        if(!post) {
            return res.sendStatus(404);
        }
    
        return res.send(post);
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                code : 500,
                status : "Internal System Error",
                msg : "Something went wrong"
            })
    }
}

export const deletePostHandler = async (req : Request, res : Response) => {
    try {
        const postId = get(req, "params.postId")

        const foundPost = await findPost({ _id : postId });
        if(!foundPost) {
            return res.status(404).json({ code : 404, status : "No Content", msg : "Post does not exist" })
        }

        const userId = get(req, "user._id");
        if(String(userId) !== String(foundPost.user)) { 
            return res.status(403).json({
                code : 403,
                status : "Forbidden",
                msg : "Only the user who posted this can perform"
            })
        }

        await deletePost({ _id : postId });
        return res.status(200).json({
            code : 200,
            status : "Successfully"
        })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                code : 500,
                status : "Internal System Error",
                msg : "Something went wrong"
            })
    }
}