import express, { Express, Request, Response } from "express";
import {
  addPayments,
  deletePayments,
  getAllPayments,
  getPayment,
  updatePayment,
} from "./payments";
import { getBudgets, addBudgets, updateBudget, deleteBudgets } from "./budgets";
import { Budget, Payment, Type } from "@prisma/client";
import { addTypes, deleteTypes, getTypes } from "./types";
import { getOwners } from "./owners";


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

app.put("/payment", cors(corsOptions), (req: Request, res: Response) => {
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

app.post("/budgets", cors(corsOptions), (req: Request, res: Response) => {
  const newBudgets = req.body as Budget[];

  addBudgets(newBudgets)
    .then((addedBudgets) => {
      res.send(addedBudgets);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
});

app.put("/budget", cors(corsOptions), (req: Request, res: Response) => {
  const editBudget = req.body as Budget;

  updateBudget(editBudget)
    .then((budget) => {
      res.send(budget);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
});

app.delete("/budgets", cors(corsOptions), (req: Request, res: Response) => {
  const budgetIds = req.body as number[];

  deleteBudgets(budgetIds)
    .then((deletedBudgets) => {
      res.send(deletedBudgets);
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

app.post("/types", cors(corsOptions), (req: Request, res: Response) => {
  const newTypes = req.body as Type[];

  addTypes(newTypes)
    .then((addedTypes) => {
      res.send(addedTypes);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
});

app.delete("/types", cors(corsOptions), (req: Request, res: Response) => {
  const typeIds = req.body as number[];

  deleteTypes(typeIds)
    .then((deleted) => {
      res.send(deleted);
    })
    .catch((e) => {
      console.log(e);
      res.status(400);
      res.send(e);
    });
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