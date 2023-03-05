import { ExtendedContext } from "18h/dist/@types/method";
import signale from "signale";


export const logRequest = async ({ path, ip, headers }: ExtendedContext, next: () => Promise<void>) => {
  const contentLength = headers["content-length"] ?? "0";
  signale.log("(%s) Request by %s made with 'content-length' of %s", path, ip, contentLength);
  return next();
};