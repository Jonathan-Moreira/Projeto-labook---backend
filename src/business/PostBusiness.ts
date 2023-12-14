import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/creatPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post, PostModel } from "../models/post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";


export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    
    ) {}

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
    
       const { token, content} = input

       const  payload = this.tokenManager.getPayload(token)

       if (!payload) {
        throw new UnauthorizedError("token invalido")
       }

        const id = this.idGenerator.generate()

       const post = new Post(
        id,
        content,
        0,
        0,
        new Date().toISOString(),
        new Date().toISOString(),
        payload.id,
        payload.name
       )

       await this.postDatabase.insertPost(post.toDBMoldel())

       const output: CreatePostOutputDTO = undefined
       return output
    } 


    public getPost = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
    
        const { token } = input
 
        const  payload = this.tokenManager.getPayload(token)
        if (!payload) {
         throw new UnauthorizedError("token invalido")
        }
 
        const postsDB = await this.postDatabase.getPosts()

        const postsModel: PostModel [] = []
        
      for (let postDB of postsDB) {
        const userDB = await this.userDatabase.findById(postDB.creator_id)


        const post = new Post(
            postDB. id,
            postDB. content,
            postDB. likes,
            postDB. dislikes,
            postDB.created_at,
            postDB. updated_at,
            postDB. creator_id,
            userDB.name
           )

           postsModel.push(post.toBusinessModel())
      }
        
 
        const output: GetPostsOutputDTO = postsModel
        return output
     } 







}