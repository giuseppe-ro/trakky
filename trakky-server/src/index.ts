import express, { Express, Request, Response } from "express";
import { addPayments, getAllPayments, getPayment } from "./payments";
import { getBudgets } from "./budgets";
import { Payment } from "@prisma/client";


var cors = require('cors')

var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}


const app: Express = express();
app.use(cors())
app.use(express.json()) 

const host = "0.0.0.0"
const port = 8999;

app.get("/payment/:id", cors(corsOptions), (req: Request<{ id: string }>, res: Response) => {
  getPayment(parseInt(req.params.id))
    .then((payments) => {
      res.send(payments);
    })
    .catch((e) => {});
});

app.get("/payments", cors(corsOptions), (req: Request, res: Response) => {
  getAllPayments()
    .then((payments) => {
      res.send(payments);
    })
    .catch((e) => {});
});

// app.post('/payments', cors(corsOptions), (req, res) => {
//   console.log("all good :D")
//   res.json({requestBody: req.body})  // <==== req.body will be a parsed JSON object
// })

app.post("/payments", cors(corsOptions), (req: Request, res: Response) => {
  const newPayments = req.body as Payment[]

  addPayments(newPayments)
    .then((addedPayments) => {
      res.send(addedPayments);
    })
    .catch((e) => {
      console.log(e)
      res.status(400);
      res.send(e)
    });
});

app.get("/budgets", cors(corsOptions), (req: Request, res: Response) => {
  getBudgets()
    .then((budgets) => {
      res.send(budgets);
    })
    .catch((e) => {});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
