import express, { Express } from "express";
import { paymentsRouter } from "./api/payments";
import { backupRouter } from "./api/backup";
import { budgetsRouter } from "./api/budgets";
import { ownersRouter } from "./api/owners";
import { typesRouter } from "./api/types";
import cors from 'cors';

const corsOptions = {
  origin: [
    "http://trakky.localhost",
    "http://trakky.localdomain",
    "http://localhost",
    "http://localhost:5173",
  ],
  methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app: Express = express();
const apiRouter = express.Router();

apiRouter.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());

const host = "0.0.0.0";
const port = 8999;

app.use("/api", apiRouter);

apiRouter.use("/backup", backupRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/budgets", budgetsRouter);
apiRouter.use("/owners", ownersRouter)
apiRouter.use("/types", typesRouter)

app.get('/api/health-check', async (_req, res, _next) => {
  console.log("Health check!")
  res.status(200).send({'message':'OK'});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
