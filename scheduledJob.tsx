import * as cron from "node-cron";
import { integralProcess } from "./tasks/integral-process";

export const scheduledProcess = async () => {
  cron.schedule("*/15 * * * *", integralProcess);
};
