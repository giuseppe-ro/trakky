import express, { Express, Request, Response } from "express";
import {
  addPayments,
  deletePayments,
  getPayments,
  updatePayment,
} from "./payments";
import { getBudgets, addBudgets, updateBudget, deleteBudgets } from "./budgets";
import { Budget, Owner, Payment, Prisma, Type } from "@prisma/client";
import { addTypes, deleteTypes, getTypes } from "./types";
import { addOwners, deleteOwners, getOwners } from "./owners";


const cors = require("cors");

const corsOptions = {
  origin: [
    "http://trakky.localhost", 
    "http://trakky.localhost/*",
    "http://trakky.localdomain",
    "http://trakky.localdomain/*"
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app: Express = express();
app.use(cors());
app.use(express.json());

const host = "0.0.0.0";
const port = 8999;

function baseHandler(res: Response, func: Function, args?: any) {
  func(args)
  .then((result: any) => {
    res.send(result);
  })
  .catch((e: any) => {
    console.log(e);
    res.status(400);
    res.send(e);
  });
} 

app.get("/payments", cors(corsOptions), (req: Request, res: Response) => {
  return baseHandler(res, getPayments);
});

app.delete("/payments", cors(corsOptions), (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deletePayments, ids);
});

app.post("/payments", cors(corsOptions), (req: Request, res: Response) => {
  const newPayments = req.body as Payment[];

  return baseHandler(res, addPayments, newPayments);
});


app.put("/payment", cors(corsOptions), (req: Request, res: Response) => {
  const editPayments = req.body as Payment;

  return baseHandler(res, updatePayment, editPayments);
});

app.get("/budgets", cors(corsOptions), (req: Request, res: Response) => {
  return baseHandler(res, getBudgets);
});

app.post("/budgets", cors(corsOptions), (req: Request, res: Response) => {
  const newValues = req.body as Budget[];

  return baseHandler(res, addBudgets, newValues);
});

app.put("/budget", cors(corsOptions), (req: Request, res: Response) => {
  const editBudget = req.body as Budget;

  return baseHandler(res, updateBudget, editBudget);
});

app.delete("/budgets", cors(corsOptions), (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deleteBudgets, ids);
});

app.get("/owners", cors(corsOptions), (req: Request, res: Response) => {
  return baseHandler(res, getOwners);
});

app.post("/owners", cors(corsOptions), (req: Request, res: Response) => {
  const newValues = req.body as Owner[];

  return baseHandler(res, addOwners, newValues);
});

app.delete("/owners", cors(corsOptions), (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deleteOwners, ids);
});

app.get("/types", cors(corsOptions), (req: Request, res: Response) => {
  return baseHandler(res, getTypes);
});

app.post("/types", cors(corsOptions), (req: Request, res: Response) => {
  const newTypes = req.body as Type[];

  return baseHandler(res, addTypes, newTypes);
});

app.delete("/types", cors(corsOptions), (req: Request, res: Response) => {
  const typeIds = req.body as number[];

  return baseHandler(res, deleteTypes, typeIds);
});

app.listen(port, () => {
  // importFromJson()
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});


// import data from './data.json';

// function importFromJson() {
//   const mappedData = data.map((item) => {
//     return {
//       id: item.id,
//       amount: parseFloat(item.amount),
//       type: item.type,
//       owner: item.owner,
//       description: item.description,
//       date: new Date(item.date)
//     };
//   });

//   addPayments(mappedData)
//   .then((res) => console.log(res))
// }