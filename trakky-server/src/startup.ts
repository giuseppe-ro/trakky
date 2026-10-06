export type StartDecision = { ok: true; warning?: string } | { ok: false; error: string };

// Mirrors `skipAuth` in constants.ts: only the literal "true" disables authentication.
export function assertAuthConfig(env: NodeJS.ProcessEnv): StartDecision {
  if (env.SKIP_AUTH === "true") {
    return {
      ok: true,
      warning:
        "AUTH DISABLED: every /api route is public — run only where you trust the network",
    };
  }

  if (env.AUTH_ISSUER || env.AUTH_USERINFO_URL) {
    return { ok: true };
  }

  return {
    ok: false,
    error:
      "no auth configured: set AUTH_ISSUER (or AUTH_USERINFO_URL), or SKIP_AUTH=true to run without authentication",
  };
}
