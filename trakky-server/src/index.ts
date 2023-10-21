import express, { Express, Request, Response } from "express";
import {
  addPayments,
  deletePayments,
  getAllPayments,
  getPayment,
  updatePayment,
} from "./payments";
import { addBudgets, getBudgets } from "./budgets";
import { Budget, Owner, Payment, Type } from "@prisma/client";
import data from "./data.json"
import budgets from "./budgets.json"
import { addTypes, getTypes } from "./types";
import { addOwners, getOwners } from "./owners";

const cors = require("cors");

const corsOptions = {
  origin: ["http://trakky.localhost", "http://trakky.localhost/*"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app: Express = express();
app.use(cors());
app.use(express.json());

const host = "0.0.0.0";
const port = 8999;

app.get(
  "/payment/:id",
  cors(corsOptions),
  (req: Request<{ id: string }>, res: Response) => {
    getPayment(parseInt(req.params.id))
      .then((payments) => {
        res.send(payments);
      })
      .catch((e) => {});
  },
);

app.get("/payments", cors(corsOptions), (req: Request, res: Response) => {
  getAllPayments()
    .then((payments) => {
      res.send(payments);
    })
    .catch((e) => {});
});

app.delete("/payments", cors(corsOptions), (req: Request, res: Response) => {
  const paymentIds = req.body as number[];

  deletePayments(paymentIds)
    .then((deletedPayments) => {
      res.send(deletedPayments);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
});

app.post("/payments", cors(corsOptions), (req: Request, res: Response) => {
  const newPayments = req.body as Payment[];

  addPayments(newPayments)
    .then((addedPayments) => {
      res.send(addedPayments);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
});

app.put("/payments", cors(corsOptions), (req: Request, res: Response) => {
  const editPayments = req.body as Payment;

  updatePayment(editPayments)
    .then((payment) => {
      res.send(payment);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
});

app.get("/budgets", cors(corsOptions), (req: Request, res: Response) => {
  getBudgets()
    .then((budgets) => {
      res.send(budgets);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
});

app.get("/owners", cors(corsOptions), (req: Request, res: Response) => {
  getOwners()
    .then((owners) => {
      res.send(owners);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
});

app.get("/types", cors(corsOptions), (req: Request, res: Response) => {
  getTypes()
    .then((types) => {
      res.send(types);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});


// app.get("/uploadall", cors(corsOptions), async (req: Request, res: Response) => {
  // const newPayments = data.map(p =>
  // {
  //   return     {
  //     amount: Number(p.amount),
  //     description: p.description,
  //     date: new Date(p.date),
  //     id: p.id,
  //     owner: p.owner,
  //     type: p.type
  //   }
  // });

  // const newBudgets = budgets.map(b => {
  //   return {
  //     date: new Date(b.date),
  //     budget: Number(b.budget),
  //     maxBudget: Number(b.maxBudget)
  //   }
  // })

  // addBudgets(newBudgets).then(r => console.log(r))

  // const types: Type[] = [
  //   { id: 1, name: "Food" },
  //   { id: 2, name: "Bills" },
  //   { id: 3, name: "Transport" },
  //   { id: 4, name: "Personal" },
  //   { id: 5, name: "General" },
  //   { id: 6, name: "House" },
  // ]

  // const owners: Owner[] = [
  //   { id: 1, name: "Ray" },
  //   { id: 2, name: "Micia" },
  // ]

  // addPayments(newPayments)
  //   .then((addedPayments) => {
      
  //     addTypes(types).then(r => console.log(r))
  //     addOwners(owners).then(r => console.log(r))

  //     res.send(addedPayments);
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     res.status(400);
  //     res.send(e);
  //   });
// });