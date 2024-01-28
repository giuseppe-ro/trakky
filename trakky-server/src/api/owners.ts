import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { addOwners, deleteOwners, getOwners } from "../infrastructure/owners";
import { Owner } from "@prisma/client";


export const ownersRouter = express.Router();

 ownersRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getOwners);
});

ownersRouter.post("/", (req: Request, res: Response) => {
  const newValues = req.body as Owner[];

  return baseHandler(res, addOwners, newValues);
});

ownersRouter.delete("/", (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deleteOwners, ids);
});