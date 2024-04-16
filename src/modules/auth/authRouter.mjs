import { Router } from "express"
import { AuthController } from "./authController.mjs"

export const authRouter = Router()
authRouter.get("/login", AuthController.loginPage)
authRouter.post("/login", AuthController.processLoginSubmission)