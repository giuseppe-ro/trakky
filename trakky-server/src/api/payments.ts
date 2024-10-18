import express, { Request, Response } from "express";
import { post, del, get, put } from "../infrastructure/payments";
import { baseHandler } from "./base";
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
  return baseHandler(res, get, req.body);
});

paymentsRouter.post("/", (req: Request, res: Response) => {
  return baseHandler(res, post, req.body);
});

paymentsRouter.put("/", (req: Request, res: Response) => {
  return baseHandler(res, put, req.body);
});

paymentsRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, del, req.body);
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
          const payments = paymentsSchema.parse(JSON.parse(data));
          console.log("File parsed: ", payments)

          return baseHandler(res, post, {data: payments, user: req.headers["user"]});

      } catch (err) {
          console.log("Err")
          res.status(400).json({ error: "Invalid JSON file" });
      }
  });
  }
});

