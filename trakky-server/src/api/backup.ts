import express, { Request, Response } from "express";
import { get as getPayments } from "../infrastructure/payments";
import { get as getBudgets} from "../infrastructure/budgets";
import { get as getOwners} from "../infrastructure/owners";
import { get as getTypes} from "../infrastructure/types";
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