import { randomBytes } from "crypto";

export const stripUuid = (uuid: string) => {
  return uuid.replace(/-/g, "");
};

export const unstripUuid = (uuid: string) => {
  return uuid.replace(
    /^(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/,
    '$1-$2-$3-$4-$5'
  );
};

export const createAccessSecret = () => {
  return randomBytes(16).toString("hex");
};

export const createAccessToken = (uuid: string, secret: string) => {
  return stripUuid(uuid) + secret;
};

export const deconstructAccessToken = (accessToken: string) => {
  const id = unstripUuid(accessToken.substring(0, 32));
  const secret = accessToken.substring(32, 64);
  
  return { id, secret };
}
