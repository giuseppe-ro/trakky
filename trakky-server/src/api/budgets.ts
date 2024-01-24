import { Express, Request, Response } from "express";
import { baseHandler } from "./base";
import { addBudgets, deleteBudgets, getBudgets, updateBudget } from "../infrastructure/budgets";
import { Budget } from "@prisma/client";

export function useBudgetsApi(app: Express, cors: any) { 

    app.get("/budgets", cors, (req: Request, res: Response) => {
        return baseHandler(res, getBudgets);
      });
      
      app.post("/budgets", cors, (req: Request, res: Response) => {
        const newValues = req.body as Budget[];
      
        return baseHandler(res, addBudgets, newValues);
      });
      
      app.put("/budget", cors, (req: Request, res: Response) => {
        const editBudget = req.body as Budget;
      
        return baseHandler(res, updateBudget, editBudget);
      });
      
      app.delete("/budgets", cors, (req: Request, res: Response) => {
        const ids = req.body as number[];
      
        return baseHandler(res, deleteBudgets, ids);
      });
}