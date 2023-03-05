import { ExtendedContext } from "18h/dist/@types/method";
import { verify } from "argon2";
import { getAccessToken } from "../actions/access-token";
import { deconstructAccessToken } from "../utils/access-token";

export const ensureAuthenticated = async (context: ExtendedContext, next: () => Promise<void>) => {
  const { authorization } = context.headers;
  
  const setUnauthorized = () => {
    context.status = 403;
  }
  
  if (!authorization) return setUnauthorized();

  const { id, secret } = deconstructAccessToken(authorization);
  const { argon2 } = await getAccessToken(id, false) ?? {};
  if (!argon2) return setUnauthorized();

  const isAuthenticated = await verify(argon2, secret);
  if (!isAuthenticated) return setUnauthorized();
  else return next();
};