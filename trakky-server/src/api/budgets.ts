import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { addBudgets, deleteBudgets, getBudgets, updateBudget } from "../infrastructure/budgets";
import { Budget } from "@prisma/client";


export const budgetsRouter = express.Router();

budgetsRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getBudgets);
});

budgetsRouter.post("/", (req: Request, res: Response) => {
  const newValues = req.body as Budget[];

  return baseHandler(res, addBudgets, newValues);
});

budgetsRouter.put("/", (req: Request, res: Response) => {
  const editBudget = req.body as Budget;

  return baseHandler(res, updateBudget, editBudget);
});

budgetsRouter.delete("/", (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deleteBudgets, ids);
});