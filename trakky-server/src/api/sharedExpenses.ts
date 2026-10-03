import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { add, del, get, put } from "../infrastructure/sharedExpenses";


export const sharedExpensesRouter = express.Router();

 sharedExpensesRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body, req.user);
});

sharedExpensesRouter.post("/", (req: Request, res: Response) => {
  return baseHandler(res, add, req.body, req.user);
});

sharedExpensesRouter.put("/", (req: Request, res: Response) => {
  return baseHandler(res, put, req.body, req.user);
});

sharedExpensesRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, del, req.body, req.user);
});