import "dotenv/config";

import { router } from "18h";
import { join } from "path";
import signale from "signale";

const { API_PORT } = process.env;

if (!API_PORT)
  throw Error("The `API_PORT` environment variable is not set.");

const numericalApiPort = parseInt(API_PORT);
if (isNaN(numericalApiPort))
  throw Error("The `API_PORT` environment variable is not valid.");
  
const notifyProcessStarted = () => {
  signale.success("The 18h service is running on port %d", numericalApiPort);
};

const registerWellKnown = ({ app }: Awaited<ReturnType<typeof router>>) => {
  app.use((context, next) => {
    if (context.url === "/.well-known/appspecific/com.tesla.3p.public-key.pem") {
      context.body = process.env.VEHICLE_PUBLIC_KEY!;
    } else next();
  })
}

router({
  port: numericalApiPort,
  routesFolder: join(__dirname, "routes"),
  hostname: "0.0.0.0"
})
  .then(registerWellKnown)
  .then(notifyProcessStarted);
