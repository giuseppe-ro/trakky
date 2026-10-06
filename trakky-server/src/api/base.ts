import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { logger } from "../logger";
import { User } from "../models/user";
import { skipAuth } from "../constants";

export async function baseHandler(
  res: Response,
  func: Function,
  payload: any,
  user?: User,
  schema?: ZodTypeAny,
) {
  if (!skipAuth && user) {
    logger.info(`User: ${user.preferred_username} - Executing: ${func.name}`);
  }

  try {
    const parsed = schema
      ? schema.safeParse(payload?.data)
      : { success: true as const, data: payload?.data };
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    // awaited inside the try: a synchronous throw from func becomes a JSON error
    // response here instead of escaping into Express' HTML error page.
    res.send(await func(parsed.data));
  } catch (e) {
    sendError(res, e);
  }
}

// The server-wide error -> status map. Never the auth status: the client retries its
// request once on an unauthorised response (remote/base.ts callApi), so a database
// problem must not look like an expired login.
export function sendError(res: Response, e: unknown) {
  if (e instanceof ZodError) {
    return res.status(400).json({ error: e.issues[0].message });
  }
  if (e instanceof PrismaClientKnownRequestError) {
    switch (e.code) {
      case "P2002":
        return res.status(409).json({ error: "Unable to add duplicated data!" });
      case "P2025":
        return res.status(404).json({ error: "Not found." });
      case "P2003":
        return res.status(400).json({ error: "Related record does not exist." });
      default:
        logger.warn(e);
        return res.status(400).json({ error: "An error occurred with the database!" });
    }
  }
  // The fall-through covers PrismaClientInitializationError (a DB auth failure is a server
  // misconfiguration, so 500 + a log line, never blamed on the caller),
  // PrismaClientValidationError and anything else including non-Error throws.
  logger.error(e);
  return res.status(500).json({ error: "Server Error." });
}
