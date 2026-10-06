import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { post, del, get } from "../infrastructure/categories";
import { categoryList, ids } from "../validation";


export const categoriesRouter = express.Router();

categoriesRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body, req.user);
});

categoriesRouter.post("/", (req: Request, res: Response) => {
  return baseHandler(res, post, req.body, req.user, categoryList);
});

categoriesRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, del, req.body, req.user, ids);
});