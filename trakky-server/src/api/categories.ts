import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { addCategories, deleteCategories, getCategories } from "../infrastructure/categories";


export const categoriesRouter = express.Router();

categoriesRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getCategories, req.body);
});

categoriesRouter.post("/", (req: Request, res: Response) => {
  console.log('new values:', req.body);
  return baseHandler(res, addCategories, req.body);
});

categoriesRouter.delete("/", (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deleteCategories, ids);
});