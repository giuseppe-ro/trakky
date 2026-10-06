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
    res.send(await func(parsed.data));
  } catch (e) {
    sendError(res, e);
  }
}

// Never answer 401 from here: the client retries the request once on an unauthorised response
// (trakky-client/src/infrastructure/remote/base.ts), so a database problem must not look like an
// expired login.
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
  logger.error(e);
  return res.status(500).json({ error: "Server Error." });
}
