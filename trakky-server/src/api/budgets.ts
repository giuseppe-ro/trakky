import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { post, del, get, put } from "../infrastructure/budgets";


export const budgetsRouter = express.Router();

budgetsRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body);
});

budgetsRouter.post("/", (req: Request, res: Response) => {
  console.log("Adding budget:", req.body)
  return baseHandler(res, post, req.body);
});

budgetsRouter.put("/", (req: Request, res: Response) => {
  return baseHandler(res, put, req.body);
});

budgetsRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, del, req.body);
});