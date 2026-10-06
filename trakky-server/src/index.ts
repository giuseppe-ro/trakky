import express, { Express } from "express";
import { paymentsRouter } from "./api/payments";
import { backupRouter } from "./api/backup";
import { budgetsRouter } from "./api/budgets";
import { ownersRouter } from "./api/owners";
import { typesRouter } from "./api/types";
import { categoriesRouter } from "./api/categories";
import cors from 'cors';
import { openIdAuth } from "./infrastructure/authorisation";
import { logger } from "./logger";
import { User } from "./models/user";
import { iconsRouter } from "./api/icons";
import { sharedExpensesRouter } from "./api/sharedExpenses";
import { assertAuthConfig } from "./startup";

const origins = process.env.ALLOWED_ORIGINS?.split(",") ?? "http://localhost:5173"

console.log(origins)

const corsOptions = {
  origin: origins,
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

apiRouter.use("/backup", openIdAuth, backupRouter);
apiRouter.use("/payments", openIdAuth, paymentsRouter);
apiRouter.use("/sharedExpenses", openIdAuth, sharedExpensesRouter);
apiRouter.use("/budgets", openIdAuth, budgetsRouter);
apiRouter.use("/owners", openIdAuth, ownersRouter)
apiRouter.use("/types", openIdAuth, typesRouter)
apiRouter.use("/categories", openIdAuth, categoriesRouter)
apiRouter.use("/icons", openIdAuth, iconsRouter)


app.get('/api/auth', cors(corsOptions), openIdAuth, async (req, res, _next) => {
  if (!req.user) {
    return res.status(401).send({ error: "Not authenticated" });
  }
  return res.send(req.user)
});

app.get('/api/health-check', cors(corsOptions), async (req, res, _next) => {
  logger.info(`Health check from: ${req.get('origin')}`)
  res.status(200).send({'message':'OK'});
});

const decision = assertAuthConfig(process.env);
if (!decision.ok) { logger.error(decision.error); process.exit(1); }
if (decision.warning) { logger.warn(decision.warning); }

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
