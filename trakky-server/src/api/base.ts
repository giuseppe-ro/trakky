import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import  { Response } from "express";

export function baseHandler(res: Response, func: Function, args?: any) {

    func(args)
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
       }
    })
    .catch((e: any) => {
      console.log(e);
      res.status(401)
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