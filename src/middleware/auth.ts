import { verify } from "argon2";
import { getAccessToken } from "../actions/access-token";
import { deconstructAccessToken } from "../utils/access-token";
import type { ParameterizedContext } from "koa";

const { ADMIN_ARGON2 } = process.env;

export const ensureAuthenticated = async (context: ParameterizedContext, next: () => Promise<void>) => {
  const { authorization } = context.headers;
  const setUnauthorized = () => context.status = 403;
  
  if (!authorization) return setUnauthorized();

  const { id, secret } = deconstructAccessToken(authorization);
  const { argon2 } = await getAccessToken(id, true) ?? {};
  if (!argon2) return setUnauthorized();

  const isAuthenticated = await verify(argon2, secret);
  if (!isAuthenticated) return setUnauthorized();
  else return next();
};

export const ensureAdministrator = async (context: ParameterizedContext, next: () => Promise<void>) => {
  const { authorization } = context.headers;
  const setUnauthorized = () => context.status = 403;
  
  if (!authorization || !ADMIN_ARGON2) return setUnauthorized();

  const isAdmin = await verify(ADMIN_ARGON2, authorization);
  if (!isAdmin) return setUnauthorized();
  
  return next();
}