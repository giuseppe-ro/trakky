import { Express, Request, Response } from "express";
import { addPayments, deletePayments, getPayments, updatePayment } from "../infrastructure/payments";
import { baseHandler } from "./base";
import { Payment } from "@prisma/client";
import * as z from "zod";
import fs from 'fs';


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


export function usePaymentsApi(app: Express, cors: any, upload: any) {
    app.get("/payments", cors, (req: Request, res: Response) => {
        return baseHandler(res, getPayments);
      });
      
      app.delete("/payments", cors, (req: Request, res: Response) => {
        const ids = req.body as number[];
      
        return baseHandler(res, deletePayments, ids);
      });
      
      app.put("/payment", cors, (req: Request, res: Response) => {
        const editPayments = req.body as Payment;
      
        return baseHandler(res, updatePayment, editPayments);
      });

      app.post("/payments", cors, (req: Request, res: Response) => {
        const newPayments = req.body as Payment[];
      
        return baseHandler(res, addPayments, newPayments);
      });

      app.post("/upload/payments", cors, upload.single('file'), (req: Request, res: Response) => {
        const file = req.file;
    
        if(file) {
          fs.readFile(file.path, 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({ error: "Error reading file" });
                return;
            }
    
            try {
                const parsedData = paymentsSchema.parse(JSON.parse(data));
    
                return baseHandler(res, addPayments, parsedData);
    
            } catch (err) {
                res.status(400).json({ error: "Invalid JSON file" });
            }
        });
        }
    });
}