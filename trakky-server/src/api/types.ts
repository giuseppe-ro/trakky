import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { post, del, get } from "../infrastructure/types";
import { Type } from "@prisma/client";


export const typesRouter = express.Router();

typesRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body, req.user);
});

typesRouter.post("/", (req: Request, res: Response) => {
  const newValues = req.body as Type[];

  return baseHandler(res, post, newValues, req.user);
});

typesRouter.delete("/", (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, del, ids, req.user);
});