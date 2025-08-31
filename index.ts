import { scheduledProcess } from "./scheduledJob";
import "dotenv/config";

console.log("Process is starting...");

scheduledProcess();

console.log("Process has been scheduled. The process will keep running.");
