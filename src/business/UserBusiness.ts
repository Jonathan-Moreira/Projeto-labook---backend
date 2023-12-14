import { UserDatabase } from "../database/UserDatabase"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/login.dto"
import { SignupInputDTO, SignupOutputDTO } from "../dtos/signup.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { ConflictError } from "../errors/ConflictError"
import { NotFoundError } from "../errors/NotFoundError"
import { TokenPayload, USER_ROLES, User } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
      
        const {name, email, password} = input

        const usuarioExiste = await this.userDatabase.findByEmail(email)
        if(usuarioExiste) {
            throw new ConflictError("Usuario com cadastro neste E-mail")

        }

     const id = this.idGenerator.generate()
     const hashedPassword = await this.hashManager.hash(password)

     const user = new User(
        id,
        name,
        email,
        hashedPassword,
       USER_ROLES.NORMAL,
       new Date(). toISOString()
     )

     await this.userDatabase.insertUser(user.toDBModel())


     const payload: TokenPayload ={
      id: user.getId(),
      name: user.getName(),
      role: user.getRole()
     }


     const token = this.tokenManager.createToken(payload)

     const output: SignupOutputDTO = {
        token: token
     }

     return output

    } 

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
      
        const {email, password} = input

        const userDB = await this.userDatabase.findByEmail(email)

        if(!userDB) {
            throw new NotFoundError("Sem registro neste E-mail")

        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        ) 


        const isPasswordCorrect = await this.hashManager.compare(password, user.getPassword())
         if (!isPasswordCorrect) {
           throw new BadRequestError("Senha incorreta")
         }


         const payload: TokenPayload ={
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
           }
      
      
           const token = this.tokenManager.createToken(payload)
      
           const output: LoginOutputDTO = {
              token: token
           }

     return output

    } 
}
