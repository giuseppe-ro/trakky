import express, { Express, Request, Response } from "express";
import os from 'os';
import { usePaymentsApi } from "./api/payments";
import { useBackupApi } from "./api/backup";
import { useBudgetsApi } from "./api/budgets";
import { useOwnersApi } from "./api/owners";
import { useTypesApi } from "./api/types";

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
const multer  = require('multer');
const upload = multer({ dest: os.tmpdir() });

app.use(cors());
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