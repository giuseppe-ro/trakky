import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { handleUpload } from "./payments";

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

function tempFile(content: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "upload-test-"));
  const file = path.join(dir, "file.json");
  fs.writeFileSync(file, content);
  return file;
}

const req = (file?: string) =>
  ({ file: file ? { path: file } : undefined }) as never;

test("a request with no file answers 400 'No file uploaded'", async () => {
  const res = stubRes();
  await handleUpload(req(), res as never);
  assert.equal(res.code, 400);
  assert.deepEqual(res.body, { error: "No file uploaded" });
});

test("a file that is not JSON answers 400 and its temp file is unlinked", async () => {
  const file = tempFile("{ not json");
  const res = stubRes();
  await handleUpload(req(file), res as never);
  assert.equal(res.code, 400);
  assert.deepEqual(res.body, { error: "Invalid JSON file" });
  assert.equal(fs.existsSync(file), false);
});

test("a file that cannot be read answers 500", async () => {
  const res = stubRes();
  await handleUpload(req(path.join(os.tmpdir(), "upload-test-missing", "x.json")), res as never);
  assert.equal(res.code, 500);
  assert.deepEqual(res.body, { error: "Error reading file" });
});
