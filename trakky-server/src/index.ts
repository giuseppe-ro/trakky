import express, { Express, Request, Response } from "express";
import { usePaymentsApi } from "./api/payments";
import { useBackupApi } from "./api/backup";
import { useBudgetsApi } from "./api/budgets";
import { useOwnersApi } from "./api/owners";
import { useTypesApi } from "./api/types";
import multer from 'multer';
import cors from 'cors';
import os from 'os';

const corsOptions = {
  origin: [
    "http://trakky.localhost",
    "http://trakky.localdomain",
    "http://localdomain",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app: Express = express();
const upload = multer({ dest: os.tmpdir() });

app.use(cors(corsOptions));
app.use(express.json());

const host = "0.0.0.0";
const port = 8999;


app.get("/health-check", cors(corsOptions), (req: Request, res: Response) => {
  res.status(200);

  return res;
});

usePaymentsApi(app, cors(corsOptions), upload);
useBudgetsApi(app, cors(corsOptions));
useOwnersApi(app, cors(corsOptions));
useTypesApi(app, cors(corsOptions));

useBackupApi(app, cors(corsOptions));


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});