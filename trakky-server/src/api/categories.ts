import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { post, del, get } from "../infrastructure/categories";


export const categoriesRouter = express.Router();

categoriesRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body);
});

categoriesRouter.post("/", (req: Request, res: Response) => {
  console.log('new values:', req.body);
  return baseHandler(res, post, req.body);
});

categoriesRouter.delete("/", (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, del, ids);
});