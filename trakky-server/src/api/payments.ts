import express, { Request, Response } from "express";
import { addPayments, deletePayments, getPayments, updatePayment } from "../infrastructure/payments";
import { baseHandler } from "./base";
import { Payment } from "@prisma/client";
import * as z from "zod";
import fs from 'fs';
import multer from 'multer';
import os from 'os';


const paymentsSchema = z.array(
  z.object({
    id: z.number().optional(),
    owner: z.string().min(1),
    type: z.string().min(1),
    date: z.string().refine((val) => new Date(val) !== null, { message: "invalid date" }),
    amount: z.number().refine((val) => val !== 0, {
      message: "cannot be 0",
    }),
    description: z.string().refine((val) => val.length <= 50 && val.length > 0),
  })
);

export const paymentsRouter = express.Router();
const upload = multer({ dest: os.tmpdir() });


paymentsRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getPayments);
});

paymentsRouter.post("/", (req: Request, res: Response) => {
  console.log("Post payments:", req.body);

  const newValues = req.body as Payment[];
      
  return baseHandler(res, addPayments, newValues);
});

paymentsRouter.put("/", (req: Request, res: Response) => {
  const editedValue = req.body as Payment;

  return baseHandler(res, updatePayment, editedValue);
});

paymentsRouter.delete("/", (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deletePayments, ids);
});

paymentsRouter.post("/upload", upload.single('file'), (req: Request, res: Response) => {
  const file = req.file;

  if(file) {
    console.log("Reading file:", file.filename);
    fs.readFile(file.path, 'utf-8', (err: any, data: string) => {
      if (err) {
          console.log("unable to read file!")
          res.status(500).json({ error: "Error reading file" });
          return;
      }

      try {
          console.log("Parsing file..")
          const parsedData = paymentsSchema.parse(JSON.parse(data));
          console.log("File parsed: ", parsedData)

          return baseHandler(res, addPayments, parsedData);

      } catch (err) {
          console.log("Err")
          res.status(400).json({ error: "Invalid JSON file" });
      }
  });
  }
});

