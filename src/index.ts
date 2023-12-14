import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import {userRouter} from "./router/userRouter"
import { postRouter } from './router/postRouter'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log("Servidor rodando em porta 3003")
})

app.get("/vai", (req, res ) => {
    res.send("volta")
})

app.use("/users", userRouter)
app.use("/posts", postRouter)