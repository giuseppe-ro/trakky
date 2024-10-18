import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { post, del, get } from "../infrastructure/owners";


export const ownersRouter = express.Router();

 ownersRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body);
});

ownersRouter.post("/", (req: Request, res: Response) => {
  return baseHandler(res, post, req.body);
});

ownersRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, del, req.body);
});