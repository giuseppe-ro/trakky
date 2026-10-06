import assert from "node:assert/strict";
import { test } from "node:test";
import type { ZodTypeAny } from "zod";

import {
  budgetUpdate,
  categoryList,
  ids,
  namedList,
  paymentCreate,
  paymentList,
  paymentUpdate,
} from "./validation";

const payment = { owner: "a", type: "b", date: "2024-01-01", amount: 5, description: "d" };
const rows = (n: number, row = payment) => Array.from({ length: n }, () => ({ ...row }));

const expectRejected = (schema: ZodTypeAny, value: unknown, label: string) => {
  const result = schema.safeParse(value);
  if (result.success) {
    assert.fail(`${label}: expected rejection, parsed ${JSON.stringify(result.data)}`);
  }
  return result.error.issues[0].message;
};

test("a conforming payment list parses through unchanged", () => {
  assert.deepEqual(paymentList.parse([payment]), [payment]);
});

test("a non-array body is rejected", () => {
  expectRejected(paymentList, payment, "object instead of array");
  expectRejected(namedList, { name: "a" }, "object instead of array");
});

test("an empty array is rejected", () => {
  expectRejected(paymentList, [], "empty payments");
  expectRejected(ids, [], "empty ids");
});

test("a blank name is rejected", () => {
  expectRejected(namedList, [{ name: "" }], "blank owner name");
  expectRejected(categoryList, [{ name: "", iconId: 1 }], "blank category name");
  expectRejected(categoryList, [{ name: "cat", iconId: 0 }], "iconId 0");
});

test("amount 0 is rejected with the message the client shows", () => {
  const message = expectRejected(paymentList, [{ ...payment, amount: 0 }], "amount 0");
  assert.equal(message, "cannot be 0");
});

test("description is capped at 50 characters", () => {
  expectRejected(paymentList, [{ ...payment, description: "x".repeat(51) }], "51 chars");
  assert.equal(paymentCreate.parse({ ...payment, description: "x".repeat(50) }).description.length, 50);
});

test("the array length is capped", () => {
  expectRejected(paymentList, rows(501), "501 payments");
  assert.equal(paymentList.parse(rows(500)).length, 500);
});

test("id and unknown fields are stripped from a create payload", () => {
  const parsed = paymentCreate.parse({ ...payment, id: 99, ownerId: 7 });
  assert.deepEqual(parsed, payment);
  assert.ok(!("id" in parsed));
});

test("delete ids must be positive integers", () => {
  expectRejected(ids, [0, "x"], "zero and string ids");
  expectRejected(ids, [-1], "negative id");
  expectRejected(ids, [1.5], "fractional id");
  assert.deepEqual(ids.parse([1, 2]), [1, 2]);
});

test("update requires an id, create must not have one", () => {
  expectRejected(paymentUpdate, payment, "payment update without id");
  expectRejected(paymentUpdate, { ...payment, id: 0 }, "payment update with id 0");
  expectRejected(budgetUpdate, { date: "2024-01-01", budget: 1, maxBudget: 2 }, "budget update without id");
  assert.deepEqual(paymentUpdate.parse({ ...payment, id: 3 }), { ...payment, id: 3 });
});
