import express, { Express } from "express";
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
    "http://localhost",
    "http://localhost:5173",

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


app.get('/health-check', async (_req, res, _next) => {
  console.log("Health check!")
  res.status(200).send({'message':'OK'});
});

usePaymentsApi(app, cors(corsOptions), upload);
useBudgetsApi(app, cors(corsOptions));
useOwnersApi(app, cors(corsOptions));
useTypesApi(app, cors(corsOptions));

useBackupApi(app, cors(corsOptions));


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
