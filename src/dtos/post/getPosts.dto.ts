import z from "zod"
import { PostModel } from "../../models/post"

export interface GetPostsInputDTO{
token: string
}


export type GetPostsOutputDTO = PostModel[]
    



export const getPostsSchema = z.object ({
token: z.string().min(1)
}).transform(data => data as GetPostsInputDTO)