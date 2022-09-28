import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Post, { PostDocument } from "../model/post.model";

export const createPost = async (input : DocumentDefinition<PostDocument>) => {
    console.log(input)
    return Post.create(input)
}

export const findPost = async (
    query : FilterQuery<PostDocument>,
    options : QueryOptions = { lean : true }
) => {
    return Post.findOne(query, {}, options)
}

export const findAndUpdate = (
    query : FilterQuery<PostDocument>,
    update : UpdateQuery<PostDocument>,
    options : QueryOptions = { lean : true }
) => {
    return Post.findOneAndUpdate(query, update, options)
}

export const deletePost = async (query : FilterQuery<PostDocument>) => {
    return Post.deleteOne(query);
}