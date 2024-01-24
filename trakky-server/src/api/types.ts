import { Express, Request, Response } from "express";
import { baseHandler } from "./base";
import { addTypes, deleteTypes, getTypes } from "../infrastructure/types";
import { Type } from "@prisma/client";

export function useTypesApi(app: Express, cors: any) { 
    app.get("/types", cors, (req: Request, res: Response) => {
        return baseHandler(res, getTypes);
      });
      
      app.post("/types", cors, (req: Request, res: Response) => {
        const newTypes = req.body as Type[];
      
        return baseHandler(res, addTypes, newTypes);
      });
      
      app.delete("/types", cors, (req: Request, res: Response) => {
        const typeIds = req.body as number[];
      
        return baseHandler(res, deleteTypes, typeIds);
      });
 }