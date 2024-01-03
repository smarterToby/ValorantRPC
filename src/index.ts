import { GameStatusHandler } from "./handler/GameStatusHandler";
import { exec } from "node:child_process";

const main = async (): Promise<void> => {
  while (await !isValorantRunning()) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log("Valorant is running, starting monitoring");
  GameStatusHandler.getInstance().then(handler => {
    handler.startMonitoring();
  });
};

const isValorantRunning = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    exec("tasklist", (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout.toLowerCase().includes("valorant.exe"));
    });
  });
};

main().catch(console.error);
