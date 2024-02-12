import express, { Express, Request, Response } from "express";
import { getPayments } from "../infrastructure/payments";
import { getBudgets } from "../infrastructure/budgets";
import { getOwners } from "../infrastructure/owners";
import { getTypes } from "../infrastructure/types";
import { baseHandler } from "./base";

async function getBackup() {
    return {
      "payments": await getPayments(),
      "budgets": await getBudgets(),
      "owners": await getOwners(),
      "types": await getTypes()
    }
  }

export const backupRouter = express.Router();

backupRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getBackup, req.body);
});