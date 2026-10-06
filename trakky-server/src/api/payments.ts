import express, { Request, Response } from "express";
import { post, del, get, put } from "../infrastructure/payments";
import { baseHandler } from "./base";
import { ids, paymentList, paymentUpdate } from "../validation";
import { logger } from "../logger";
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
    logger.debug("Reading file:", file.filename);
    fs.readFile(file.path, 'utf-8', (err: any, data: string) => {
      if (err) {
          logger.error("unable to read uploaded file", err)
          res.status(500).json({ error: "Error reading file" });
          return;
      }

      try {
          const payments = JSON.parse(data);

          return baseHandler(res, post, { data: payments }, req.user, paymentList);

      } catch (err) {
          logger.warn("invalid JSON upload", err)
          res.status(400).json({ error: "Invalid JSON file" });
      }
  });
  }
});

