import { response } from "express";
import { PostDB } from "../models/post";
import { BaseDatabase } from "./BaseDatabase";



export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
public static TABLE_LIKES_DISLIKES = "likes_dislikes"

public insertPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(postDB)
}


public getPosts = async (): Promise<PostDB [] > => {
    const reponse: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)

    return reponse
}
}