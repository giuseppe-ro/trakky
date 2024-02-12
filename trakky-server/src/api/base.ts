import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import  { Request, Response } from "express";
import { logger } from "../logger";
import { User } from "../models/user";

export function baseHandler(res: Response, func: Function, payload: any) {
  const user = JSON.parse(payload["user"]) as unknown as User;
  
  logger.info(`User: ${user.preferred_username} - Executing: ${func.name}`);

  func(payload["data"])
  .then((result: any) => {
    res.send(result);
  })
  .catch((e: Error) => {

    if (e instanceof PrismaClientKnownRequestError) { 
      if (e.code === errorCodes.duplicateDataError) {
        res.status(400);
        res.send({
          error: "Unable to add duplicated data!"
        });
      } else {
        res.status(401)
        res.send({
          error: "An error occurred with the database!"
        });
      }
      } else if (isPrismaAuthError(e)){
      console.log("error type: Auth error", e);
      res.status(401)
      res.send({
          error: "Database Authentication failed."
      })
      } else {
        console.log("Unrecognised error: ", e)
        res.status(500)
        res.send({
          error: "Server Error."
      })
      }
  })
  .catch((e: any) => {
    console.log(e);
    res.status(500)
    res.send({
          error: "Server Error."
      })
    }
  );
} 

function isPrismaAuthError(e: any) {
  return (e as any).message.toLowerCase().includes("authentication failed");
}

enum errorCodes {
  duplicateDataError = 'P2002'
}

const userInfo = (req: Request) => {
  return JSON.parse(req.headers["user"]!.toString()) as unknown as User;
}