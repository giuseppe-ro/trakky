import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { getIcons } from "../infrastructure/icons";


export const iconsRouter = express.Router();

iconsRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getIcons, req.body);
});
