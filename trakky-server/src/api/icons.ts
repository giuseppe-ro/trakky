import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { get } from "../infrastructure/icons";


export const iconsRouter = express.Router();

iconsRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body);
});
