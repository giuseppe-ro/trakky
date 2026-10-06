import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import  { Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { logger } from "../logger";
import { User } from "../models/user";
import { skipAuth } from "../constants";

export function baseHandler(res: Response, func: Function, payload: any, user?: User, schema?: ZodTypeAny) {
  if (!skipAuth && user) {
    logger.info(`User: ${user.preferred_username} - Executing: ${func.name}`);
  } 

  const parsed = schema ? schema.safeParse(payload?.data) : undefined;
  if (parsed && !parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  func(parsed ? parsed.data : payload?.data)
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