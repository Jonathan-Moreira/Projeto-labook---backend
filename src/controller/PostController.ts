import { Request, Response } from "express";
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostSchema } from "../dtos/post/creatPost.dto"
import { getPostsSchema } from "../dtos/post/getPosts.dto";

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) {}


    public createPost = async (req: Request, res: Response) => {
        try {

            const input = CreatePostSchema.parse({
             token: req.headers.authorization,
             content: req.body.content   
            })

            const reponse = await this.postBusiness.createPost(input)

            res.status(201).send(reponse)



    
        } catch (error) {
        console.log(error)

        if (error instanceof ZodError) {
            res.status(400).send(error.issues)

        } else if (error instanceof BaseError) {
            res.status(error.statusCode). send(error.message)

        } else {
            res.status(500).send("erro inesperado")

        }

        }
    } 


    public getPosts = async (req: Request, res: Response) => {
        try {

            const input = getPostsSchema.parse({
             token: req.headers.authorization,
                
            })

            const reponse = await this.postBusiness.getPost(input)

            res.status(200).send(reponse)

    
        } catch (error) {
        console.log(error)

        if (error instanceof ZodError) {
            res.status(400).send(error.issues)

        } else if (error instanceof BaseError) {
            res.status(error.statusCode). send(error.message)

        } else {
            res.status(500).send("erro inesperado")

        }

        }
    }










}