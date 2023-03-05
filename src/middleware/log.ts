import { ExtendedContext } from "18h/dist/@types/method";
import signale from "signale";


export const logRequest = ({ path, ip, headers }: ExtendedContext) => {
  const contentLength = headers["content-length"] ?? "0";
  signale.log("(%s) Request by %s made with 'content-length' of %s", path, ip, contentLength);
};