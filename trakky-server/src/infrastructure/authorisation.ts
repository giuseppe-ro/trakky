import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { skipAuth } from "../constants";
import { logger } from "../logger";
import { User } from "../models/user";

const DEFAULT_CACHE_TTL_MS = 60_000;
const MAX_CACHED_USERS = 500;

// in-process only: needs a shared store if the API ever runs multi-instance
const userCache = new Map<string, { user: User; expiresAt: number }>();
let discoveredUserinfoUrl: string | null | undefined;

const cacheTtlMs = () => {
  const ttl = Number(process.env.AUTH_CACHE_TTL_MS);
  return Number.isFinite(ttl) && ttl >= 0 ? ttl : DEFAULT_CACHE_TTL_MS;
};

export function clearUserCache(): void {
  userCache.clear();
  discoveredUserinfoUrl = undefined;
}

async function userinfoUrl(): Promise<string | null> {
  const configured = process.env.AUTH_USERINFO_URL;
  if (configured) {
    return configured;
  }

  if (discoveredUserinfoUrl !== undefined) {
    return discoveredUserinfoUrl;
  }

  const issuer = process.env.AUTH_ISSUER;
  if (!issuer) {
    return null;
  }

  try {
    const { data } = await axios.get<{ userinfo_endpoint?: string }>(
      `${issuer.replace(/\/+$/, "")}/.well-known/openid-configuration`
    );
    discoveredUserinfoUrl = data.userinfo_endpoint ?? null;
  } catch (e) {
    logger.error(`openid discovery failed: ${String(e)}`);
    discoveredUserinfoUrl = null;
  }

  return discoveredUserinfoUrl;
}

export async function fetchUser(token: string): Promise<User | null> {
  const cached = userCache.get(token);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.user;
  }
  userCache.delete(token);

  const url = await userinfoUrl();
  if (!url) {
    return null;
  }

  try {
    const { status, data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (status !== 200 || typeof data !== "object" || data === null || !data.sub) {
      return null;
    }

    const user = data as User;

    if (userCache.size >= MAX_CACHED_USERS) {
      userCache.delete(userCache.keys().next().value as string);
    }
    userCache.set(token, { user, expiresAt: Date.now() + cacheTtlMs() });

    return user;
  } catch (e) {
    logger.error(`userinfo lookup failed: ${String(e)}`);
    return null;
  }
}

export async function openIdAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (skipAuth) {
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  const user = token ? await fetchUser(token) : null;

  if (!user) {
    return res.status(401).send();
  }

  req.user = user;

  return next();
}
