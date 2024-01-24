import { Express, Request, Response } from "express";
import { baseHandler } from "./base";
import { addOwners, deleteOwners, getOwners } from "../infrastructure/owners";
import { Owner } from "@prisma/client";

export function useOwnersApi(app: Express, cors: any) { 
    app.get("/owners", cors, (req: Request, res: Response) => {
        return baseHandler(res, getOwners);
      });
      
      app.post("/owners", cors, (req: Request, res: Response) => {
        const newValues = req.body as Owner[];
      
        return baseHandler(res, addOwners, newValues);
      });
      
      app.delete("/owners", cors, (req: Request, res: Response) => {
        const ids = req.body as number[];
      
        return baseHandler(res, deleteOwners, ids);
      });
 }