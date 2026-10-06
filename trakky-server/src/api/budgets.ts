import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { post, del, get, put } from "../infrastructure/budgets";
import { budgetList, budgetUpdate, ids } from "../validation";


export const budgetsRouter = express.Router();

budgetsRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body, req.user);
});

budgetsRouter.post("/", (req: Request, res: Response) => {
  return baseHandler(res, post, req.body, req.user, budgetList);
});

budgetsRouter.put("/", (req: Request, res: Response) => {
  return baseHandler(res, put, req.body, req.user, budgetUpdate);
});

budgetsRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, del, req.body, req.user, ids);
});