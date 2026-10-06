import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { post, del, get } from "../infrastructure/owners";
import { ids, namedList } from "../validation";


export const ownersRouter = express.Router();

 ownersRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body, req.user);
});

ownersRouter.post("/", (req: Request, res: Response) => {
  return baseHandler(res, post, req.body, req.user, namedList);
});

ownersRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, del, req.body, req.user, ids);
});