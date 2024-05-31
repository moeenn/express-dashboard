import express, { Express } from "express"
import bodyParser from "body-parser"
import helmet from "helmet"
import cors from "cors"
import { config } from "@/config"
import { loggerMiddleware } from "./logger"
import { Request, Response, NextFunction } from "express"
import { logger } from "./logger"
import { Http } from "@status/codes"
import { APIError } from "./errors"
import { authRouter } from "@/modules/auth/auth.router"
import { userRouter } from "@/modules/user/user.router"


/**
 * ----------------------------------------------------------------------------
 * 
 * define function for handling errors globally. This will prevent express 
 * server from crashing in case any error in not handled in the controller
 * 
 * ----------------------------------------------------------------------------
 */

export function globalErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let message: string
  let status: number = Http.InternalServerError
  let details: Record<string, unknown> | undefined = undefined

  // TODO: handle database errors

  if (error instanceof APIError) {
    message = error.message
    status = error.status
    details = error.details
  } else if (error instanceof Error) {
    message = error.message
    logger.error(error.message)
  } else {
    message = "unknown error occured"
    logger.error(error)
  }

  res.status(status).json(errorResponse(message, status, details))
}


/**
 * ----------------------------------------------------------------------------
 * 
 * create an fully configured instance of the express server
 * this instance will also be used for testing
 * 
 * ----------------------------------------------------------------------------
 */

export function createServer(): Express {
  const app = express()

  /** register all global middleware here */
  app.use(helmet())
  app.use(cors())
  app.use(loggerMiddleware)
  app.use(bodyParser.json())

  /** expose static assets and public files */
  if (config.server.public.exposePublicFolder) {
    app.use(express.static(config.server.public.publicDir))
  }

  /** register all routers here */
  app.use("/api/auth", authRouter)
  app.use("/api/user", userRouter)

  /** catch-all error handler: must register after all routes and middleware */
  app.use(globalErrorHandler)
  return app
}

/**
 * ----------------------------------------------------------------------------
 * 
 * express doesn't perform error handling on async request handlers. All request
 * handler functions will be wrapped with the following function to allow proper
 * error handling
 * 
 * ----------------------------------------------------------------------------
 */

export function runAsync(
  callback: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    Promise.resolve(callback(req, res, next)).catch(next)
  }
}

/**
 * ----------------------------------------------------------------------------
 * 
 * helper functions for sending uniform responses
 * 
 * ----------------------------------------------------------------------------
 */

export function errorResponse(
  message: string,
  status: number,
  details: Record<string, unknown> | undefined = undefined,
) {
  return { success: false, status, message, details }
}

export function okResponse(
  message: string | null,
  data: unknown | undefined = undefined,
) {
  if (!message) {
    return { success: true, data }
  }
  return { success: true, message, data }
}
