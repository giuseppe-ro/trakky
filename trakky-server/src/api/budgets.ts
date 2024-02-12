import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { addBudgets, deleteBudgets, getBudgets, updateBudget } from "../infrastructure/budgets";
import { Budget } from "@prisma/client";


export const budgetsRouter = express.Router();

budgetsRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getBudgets, req.body);
});

budgetsRouter.post("/", (req: Request, res: Response) => {
  console.log("Adding budget:", req.body)
  return baseHandler(res, addBudgets, req.body);
});

budgetsRouter.put("/", (req: Request, res: Response) => {
  return baseHandler(res, updateBudget, req.body);
});

budgetsRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, deleteBudgets, req.body);
});