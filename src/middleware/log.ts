import { ParameterizedContext } from "koa";
import signale from "signale";


export const logRequest = async ({ path, ip, headers }: ParameterizedContext, next: () => Promise<void>) => {
  const contentLength = headers["content-length"] ?? "0";
  signale.log("(%s) Request by %s made with 'content-length' of %s", path, ip, contentLength);
  return next();
};