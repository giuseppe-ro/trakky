import express, { Request, Response } from "express";
import { post, del, get, put } from "../infrastructure/payments";
import { baseHandler } from "./base";
import { ids, paymentList, paymentUpdate } from "../validation";
import { logger } from "../logger";
import fs from "fs";
import multer from "multer";
import os from "os";

export const paymentsRouter = express.Router();

const maxUploadBytes = 2 * 1024 * 1024;
const upload = multer({
  dest: os.tmpdir(),
  limits: { files: 1, fileSize: maxUploadBytes },
});

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

export async function handleUpload(req: Request, res: Response) {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    let data: string;
    try {
      data = await fs.promises.readFile(file.path, "utf-8");
    } catch (e) {
      logger.error("unable to read uploaded file", e);
      return res.status(500).json({ error: "Error reading file" });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      return res.status(400).json({ error: "Invalid JSON file" });
    }

    return await baseHandler(res, post, { data: parsed }, req.user, paymentList);
  } finally {
    await fs.promises.unlink(file.path).catch(() => {});
  }
}

paymentsRouter.post("/upload", (req: Request, res: Response) => {
  upload.single("file")(req, res, (err: unknown) => {
    const code = err instanceof multer.MulterError ? err.code : "";
    if (code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large (max 2MB)" });
    }
    if (err && code !== "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: "Upload failed" });
    }
    void handleUpload(req, res);
  });
});
