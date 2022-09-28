import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import log from "../logger/log";



export const validateRequest = (schema : AnySchema) => async (
    req : Request, res : Response, next : NextFunction
) => {
    try {
        await schema.validate({
            body : req.body,
            query : req.query,
            params : req.params
        });

        return next();
    } catch (error) {
        log.info(error);
        return res.status(409).send(error.message);
    }
} 