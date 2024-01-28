import express, { Express, Request, Response } from "express";
import { baseHandler } from "./base";
import { addTypes, deleteTypes, getTypes } from "../infrastructure/types";
import { Type } from "@prisma/client";


export const typesRouter = express.Router();

typesRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getTypes);
});

typesRouter.post("/", (req: Request, res: Response) => {
  const newValues = req.body as Type[];

  return baseHandler(res, addTypes, newValues);
});

typesRouter.delete("/", (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deleteTypes, ids);
});