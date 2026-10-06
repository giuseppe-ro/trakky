import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { z } from "zod";

import { baseHandler, sendError } from "./base";

function stubRes() {
  const res = {
    code: 0,
    body: undefined as unknown,
    status(c: number) {
      res.code = c;
      return res;
    },
    json(body: unknown) {
      res.body = body;
      return res;
    },
    send(body: unknown) {
      res.body = body;
      return res;
    },
  };
  return res;
}

const run = async (func: Function, payload: any = { data: [] }, schema?: z.ZodTypeAny) => {
  const res = stubRes();
  await baseHandler(res as never, func, payload, undefined, schema);
  return res;
};

const throwsSync = (e: unknown) => () => {
  throw e;
};

const known = (code: string) =>
  new PrismaClientKnownRequestError("prisma known error", { code, clientVersion: "5.20.0" });

test("a successful handler sends the resolved result with no explicit status", async () => {
  const res = await run(async () => ({ count: 2 }));
  assert.equal(res.code, 0);
  assert.deepEqual(res.body, { count: 2 });
});

test("P2002 maps to 409 'Unable to add duplicated data!'", async () => {
  const res = await run(throwsSync(known("P2002")));
  assert.equal(res.code, 409);
  assert.deepEqual(res.body, { error: "Unable to add duplicated data!" });
});

test("P2025 maps to 404 'Not found.'", async () => {
  const res = await run(throwsSync(known("P2025")));
  assert.equal(res.code, 404);
  assert.deepEqual(res.body, { error: "Not found." });
});

test("P2003 maps to 400 'Related record does not exist.'", async () => {
  const res = await run(throwsSync(known("P2003")));
  assert.equal(res.code, 400);
  assert.deepEqual(res.body, { error: "Related record does not exist." });
});

test("any other known Prisma error maps to 400, never 401", async () => {
  const res = await run(throwsSync(known("P2000")));
  assert.equal(res.code, 400);
  assert.deepEqual(res.body, { error: "An error occurred with the database!" });
});

test("a DB auth failure is an initialization error -> 500, not 401", async () => {
  const res = await run(
    throwsSync(
      new PrismaClientInitializationError(
        "Authentication failed against the database server",
        "5.20.0",
      ),
    ),
  );
  assert.equal(res.code, 500);
  assert.deepEqual(res.body, { error: "Server Error." });
});

test("PrismaClientValidationError maps to 500", async () => {
  const res = await run(throwsSync(new PrismaClientValidationError("bad", { clientVersion: "5.20.0" })));
  assert.equal(res.code, 500);
  assert.deepEqual(res.body, { error: "Server Error." });
});

test("a synchronous throw answers JSON 500 instead of escaping to the HTML error page", async () => {
  const res = await run(throwsSync(new Error("boom")));
  assert.equal(res.code, 500);
  assert.deepEqual(res.body, { error: "Server Error." });
});

test("a thrown non-Error (string) maps to 500 — the old isPrismaAuthError crashed on this", async () => {
  const res = await run(throwsSync("driver adapter said no"));
  assert.equal(res.code, 500);
  assert.deepEqual(res.body, { error: "Server Error." });
});

test("an async rejection maps like its synchronous twin", async () => {
  const res = await run(async () => {
    throw known("P2025");
  });
  assert.equal(res.code, 404);
  assert.deepEqual(res.body, { error: "Not found." });
});

test("a schema violation answers 400 with the first zod issue and never runs func", async () => {
  let called = false;
  const res = await run(
    () => {
      called = true;
    },
    { data: [{ name: "toolong" }] },
    z.array(z.object({ name: z.string().min(1).max(3) })),
  );
  assert.equal(called, false);
  assert.equal(res.code, 400);
  assert.deepEqual(res.body, { error: "String must contain at most 3 character(s)" });
});

test("sendError maps a ZodError to 400 with the first issue message", async () => {
  const res = stubRes();
  const parsed = z.object({ n: z.number() }).safeParse({ n: "x" });
  if (parsed.success) {
    assert.fail("expected the schema to reject");
  }
  sendError(res as never, parsed.error);
  assert.equal(res.code, 400);
  assert.equal((res.body as { error: string }).error, parsed.error.issues[0].message);
});
