import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { post, del, get } from "../infrastructure/types";
import { ids, namedList } from "../validation";


export const typesRouter = express.Router();

typesRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body, req.user);
});

typesRouter.post("/", (req: Request, res: Response) => {
  return baseHandler(res, post, req.body, req.user, namedList);
});

typesRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, del, req.body, req.user, ids);
});