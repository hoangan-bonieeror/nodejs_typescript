import { object, string } from "yup";

const payload = {
    body : object({
        title : string().required("Title is required"),
        body : string()
            .required("Body is required")
            .min(120, "Body is too short - should be 120 chars minimum")
    })
};

const params = {
    params : object({
        postId : string().required("Post ID is required")
    })
}

export const schema_createPost = object({
    ...payload
})

export const schema_updatePost = object({
    ...params,
    ...payload
})


export const schema_deletePost = object({
    ...params
})


