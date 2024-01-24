import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import  { Response } from "express";

export function baseHandler(res: Response, func: Function, args?: any) {
    func(args)
    .then((result: any) => {
      res.send(result);
    })
    .catch((e: Error) => {
  
      if (e instanceof PrismaClientKnownRequestError) { 
        if (e.code === 'P2002') {
          res.status(400);
          res.send("Unable to add duplicated data!");
        } else {
          res.status(401)
          res.send("An error occurred with the database!");
        }
       } else if ((e as any).message.toLowerCase().includes("authentication failed")){
        console.log("error type: Auth error", e);
        res.status(401)
        res.send("Database Authentication failed.")
       }
    })
    .catch((e: any) => {
      console.log(e);
      res.status(401)
      res.send("Server Error.")
    }
    );
  } 