import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { addCategory, deleteCategories, getCategories } from "../infrastructure/categories";
import { Category } from "@prisma/client";


export const categoriesRouter = express.Router();

categoriesRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getCategories, req.body);
});

categoriesRouter.post("/", (req: Request, res: Response) => {
  console.log("saving categories..");
  const newValues = req.body as Category;

  console.log('new values:', newValues);

  return baseHandler(res, addCategory, newValues);
});

categoriesRouter.delete("/", (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deleteCategories, ids);
});