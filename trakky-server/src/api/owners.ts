import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { addOwners, deleteOwners, getOwners } from "../infrastructure/owners";


export const ownersRouter = express.Router();

 ownersRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getOwners, req.body);
});

ownersRouter.post("/", (req: Request, res: Response) => {
  return baseHandler(res, addOwners, req.body);
});

ownersRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, deleteOwners, req.body);
});