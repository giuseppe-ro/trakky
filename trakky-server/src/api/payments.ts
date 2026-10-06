import express, { Request, Response } from "express";
import { post, del, get, put } from "../infrastructure/payments";
import { baseHandler } from "./base";
import { ids, paymentList, paymentUpdate } from "../validation";
import fs from 'fs';
import multer from 'multer';
import os from 'os';


export const paymentsRouter = express.Router();
const upload = multer({ dest: os.tmpdir() });


paymentsRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, get, req.body, req.user);
});

paymentsRouter.post("/", (req: Request, res: Response) => {
  return baseHandler(res, post, req.body, req.user, paymentList);
});

paymentsRouter.put("/", (req: Request, res: Response) => {
  return baseHandler(res, put, req.body, req.user, paymentUpdate);
});

paymentsRouter.delete("/", (req: Request, res: Response) => {
  return baseHandler(res, del, req.body, req.user, ids);
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
          const payments = JSON.parse(data);
          console.log("File parsed: ", payments)

          // one payment-row schema for every write path: baseHandler validates the rows,
          // so a bad date is a 400 with the zod message instead of a Prisma 500.
          return baseHandler(res, post, { data: payments }, req.user, paymentList);

      } catch (err) {
          console.log("Err")
          res.status(400).json({ error: "Invalid JSON file" });
      }
  });
  }
});

