import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCredentials, postTweet } from "../scripts/x-post.mjs";

const FAKE = {
  X_API_KEY: "ak",
  X_API_SECRET: "as",
  X_ACCESS_TOKEN: "at",
  X_ACCESS_SECRET: "asec",
};

function withEnv(vars, fn) {
  const saved = {};
  const keys = ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET", "X_CREDENTIALS"];
  for (const k of keys) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  Object.assign(process.env, vars);
  try {
    return fn();
  } finally {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
}

test("loadCredentials reads all four env vars", () => {
  withEnv(FAKE, () => {
    const c = loadCredentials();
    assert.deepEqual(c, {
      api_key: "ak",
      api_secret: "as",
      access_token: "at",
      access_secret: "asec",
    });
  });
});

test("loadCredentials returns null when env is incomplete and no file points exist", () => {
  withEnv({ X_API_KEY: "only-one", X_CREDENTIALS: "/nonexistent/path.json" }, () => {
    assert.equal(loadCredentials(), null);
  });
});

test("postTweet throws NO_CREDS when nothing is configured", async () => {
  await withEnv({ X_CREDENTIALS: "/nonexistent/path.json" }, async () => {
    await assert.rejects(() => postTweet("hello", { dryRun: true }), (e) => e.code === "NO_CREDS");
  });
});

test("postTweet rejects empty text even with creds", async () => {
  await withEnv(FAKE, async () => {
    await assert.rejects(() => postTweet("   ", { dryRun: true }), (e) => e.code === "BAD_INPUT");
  });
});

test("postTweet dry-run signs successfully and does not send", async () => {
  await withEnv(FAKE, async () => {
    const out = await postTweet("A valid tweet 🐉", { dryRun: true });
    assert.deepEqual(out, { dryRun: true });
  });
});
