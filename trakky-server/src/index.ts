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
apiRouter.use("/budgets", openIdAuth, budgetsRouter);
apiRouter.use("/owners", openIdAuth, ownersRouter)
apiRouter.use("/types", openIdAuth, typesRouter)
apiRouter.use("/categories", openIdAuth, categoriesRouter)
apiRouter.use("/icons", openIdAuth, iconsRouter)


app.get('/api/auth', cors(corsOptions), openIdAuth, async (_req, res, _next) => {
  const user = _req.body["user"] as unknown as User;

  return res.send(user)
});

app.get('/api/health-check', cors(corsOptions), async (req, res, _next) => {
  logger.info(`Health check from: ${req.get('origin')}`)
  res.status(200).send({'message':'OK'});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
