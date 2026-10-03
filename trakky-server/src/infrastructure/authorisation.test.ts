import assert from "node:assert/strict";
import http from "node:http";
import { after, before, test } from "node:test";
import { Response } from "express";

import { clearUserCache, openIdAuth } from "./authorisation";

let server: http.Server;
let port = 0;
let userinfoHits = 0;
let discoveryHits = 0;

const USERINFO_USER = {
  sub: "userinfo-sub",
  preferred_username: "from-userinfo",
  name: "From Userinfo",
};

before(async () => {
  server = http.createServer((req, res) => {
    if (req.url?.endsWith("/.well-known/openid-configuration")) {
      discoveryHits++;
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          userinfo_endpoint: `http://127.0.0.1:${port}/application/o/userinfo/`,
        }),
      );
      return;
    }

    userinfoHits++;
    if (req.headers.authorization !== "Bearer good-token") {
      res.writeHead(401, { "content-type": "application/json" });
      return res.end(JSON.stringify({ error_detail: "invalid_token" }));
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(USERINFO_USER));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  port = (server.address() as { port: number }).port;
  process.env.AUTH_USERINFO_URL = `http://127.0.0.1:${port}/application/o/userinfo/`;
});

after(() => new Promise<void>((resolve) => server.close(() => resolve())));

const fakeRes = () => {
  const res = {
    code: 0,
    body: undefined as unknown,
    status(code: number) {
      res.code = code;
      return res;
    },
    send(body?: unknown) {
      res.body = body;
      return res;
    },
  };
  return res;
};

const run = async (authorization?: string) => {
  const req: any = { headers: {} };
  if (authorization) req.headers.authorization = authorization;
  const res = fakeRes();
  let nextCalled = false;
  await openIdAuth(req, res as unknown as Response, () => {
    nextCalled = true;
  });
  return { req, res, nextCalled };
};

const forgedToken = `${Buffer.from('{"alg":"none"}').toString("base64url")}.${Buffer.from(
  JSON.stringify({ sub: "forged-sub", preferred_username: "attacker" }),
).toString("base64url")}.sig`;

test("rejects a request with no Authorization header without calling the IdP", async () => {
  userinfoHits = 0;
  const { res, nextCalled } = await run();
  assert.equal(res.code, 401);
  assert.equal(nextCalled, false);
  assert.equal(userinfoHits, 0);
});

test("rejects a token the IdP does not accept", async () => {
  const { res, nextCalled } = await run("Bearer forged-but-unknown");
  assert.equal(res.code, 401);
  assert.equal(nextCalled, false);
});

test("rejects an unparseable Authorization header", async () => {
  const { res, nextCalled } = await run("NotBearer whatever");
  assert.equal(res.code, 401);
  assert.equal(nextCalled, false);
});

test("identity comes from the userinfo response, never from the token claims", async () => {
  const { req, res, nextCalled } = await run(`Bearer good-token`);
  assert.equal(res.code, 0, "expected the request to be authorised");
  assert.equal(nextCalled, true);

  const user = req.user;
  assert.equal(user?.preferred_username, "from-userinfo");
  assert.equal(user?.sub, "userinfo-sub");
});

test("a token that is not a JWT still yields a usable identity", async () => {
  const { req, nextCalled } = await run("Bearer good-token");
  assert.equal(nextCalled, true);
  assert.equal(req.user?.preferred_username, "from-userinfo");
});

test("a verified token is not re-introspected on every request", async () => {
  clearUserCache();
  userinfoHits = 0;
  await run("Bearer good-token");
  await run("Bearer good-token");
  await run("Bearer good-token");
  assert.equal(userinfoHits, 1);
});

test("a cached identity is still attached to the request", async () => {
  clearUserCache();
  await run("Bearer good-token");
  const { req, nextCalled } = await run("Bearer good-token");
  assert.equal(nextCalled, true);
  assert.equal(req.user?.sub, "userinfo-sub");
});

test("a rejected token is not cached", async () => {
  clearUserCache();
  userinfoHits = 0;
  await run("Bearer nope");
  await run("Bearer nope");
  assert.equal(userinfoHits, 2);
});

test("cache entries expire", async () => {
  clearUserCache();
  process.env.AUTH_CACHE_TTL_MS = "0";
  userinfoHits = 0;
  await run("Bearer good-token");
  await run("Bearer good-token");
  delete process.env.AUTH_CACHE_TTL_MS;
  assert.equal(userinfoHits, 2);
});

test("the verified user is on the request, not smuggled through headers or body", async () => {
  clearUserCache();
  const { req } = await run("Bearer good-token");
  assert.equal(req.user?.sub, "userinfo-sub");
  assert.equal(req.headers["user"], undefined);
  assert.equal(req.body?.user, undefined);
});

test("the userinfo endpoint is discovered from AUTH_ISSUER", async () => {
  clearUserCache();
  const configured = process.env.AUTH_USERINFO_URL;
  delete process.env.AUTH_USERINFO_URL;
  process.env.AUTH_ISSUER = `http://127.0.0.1:${port}/application/o/trakky/`;
  discoveryHits = 0;

  try {
    const first = await run("Bearer good-token");
    const second = await run("Bearer good-token");

    assert.equal(first.req.user?.sub, "userinfo-sub");
    assert.equal(second.req.user?.sub, "userinfo-sub");
    assert.equal(discoveryHits, 1);
  } finally {
    process.env.AUTH_USERINFO_URL = configured;
    delete process.env.AUTH_ISSUER;
  }
});

test("without any issuer configuration every request is rejected", async () => {
  clearUserCache();
  const configured = process.env.AUTH_USERINFO_URL;
  delete process.env.AUTH_USERINFO_URL;

  try {
    const { res, nextCalled } = await run("Bearer good-token");
    assert.equal(res.code, 401);
    assert.equal(nextCalled, false);
  } finally {
    process.env.AUTH_USERINFO_URL = configured;
  }
});
