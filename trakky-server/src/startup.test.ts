import assert from "node:assert/strict";
import { test } from "node:test";

import { assertAuthConfig } from "./startup";

// if/else instead of bare asserts so the StartDecision union stays narrowed.
const expectStart = (env: NodeJS.ProcessEnv, label: string) => {
  const decision = assertAuthConfig(env);
  if (decision.ok) {
    return decision.warning;
  }
  assert.fail(`${label}: expected the server to start, got: ${decision.error}`);
};

const expectRefusal = (env: NodeJS.ProcessEnv) => {
  const decision = assertAuthConfig(env);
  if (decision.ok) {
    assert.fail(`expected refusal, got warning: ${decision.warning}`);
  }
  return decision.error;
};

test("SKIP_AUTH=true starts but warns about the consequence", () => {
  const warning = expectStart({ SKIP_AUTH: "true" }, "SKIP_AUTH=true");
  assert.match(warning ?? "", /AUTH DISABLED/);
  assert.match(warning ?? "", /public/);
});

test("AUTH_ISSUER alone is a valid configuration and warns about nothing", () => {
  assert.equal(expectStart({ AUTH_ISSUER: "https://id.example.com/app/" }, "AUTH_ISSUER"), undefined);
});

test("AUTH_USERINFO_URL alone (no discovery) is a valid configuration", () => {
  assert.equal(
    expectStart({ AUTH_USERINFO_URL: "https://id.example.com/userinfo/" }, "AUTH_USERINFO_URL"),
    undefined,
  );
});

test("no auth configuration refuses to start, with an actionable message", () => {
  const error = expectRefusal({});
  assert.match(error, /AUTH_ISSUER/);
  assert.match(error, /AUTH_USERINFO_URL/);
  assert.match(error, /SKIP_AUTH=true/);
});

test("empty env values count as unconfigured (docker -e with no value)", () => {
  expectRefusal({ SKIP_AUTH: "", AUTH_ISSUER: "", AUTH_USERINFO_URL: "" });
});

test("anything other than the literal 'true' does not disable auth", () => {
  for (const value of ["TRUE", "True", "1", "yes", " true"]) {
    expectRefusal({ SKIP_AUTH: value });
  }
});
