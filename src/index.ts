import {GameStatusHandler} from './handler/GameStatusHandler';
import {RpcService} from './services/RpcService';

import {exec} from 'child_process'; // Importieren Sie 'exec' aus dem 'child_process'-Modul

const main = async (): Promise<void> => {
  console.log('Waiting for Valorant to start');
  await ensureValorantIsRunning();
  setTimeout(() => {}, 5000);

  console.log('Valorant is running, starting monitoring');
  startMonitoring();

  checkIfValorantIsStillRunning();
};

const ensureValorantIsRunning = async () => {
  while (!(await isValorantRunning())) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
};

const startMonitoring = () => {
  GameStatusHandler.getInstance().then(handler => {
    handler.startMonitoring();
  });
};

const isValorantRunning = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    exec('tasklist', (err: any, stdout: string) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout.toLowerCase().includes('valorant.exe'));
    });
  });
};
const checkIfValorantIsStillRunning = async () => {
  let valorantRunning = true;

  while (true) {
    await new Promise(resolve => setTimeout(resolve, 10000));

    const isRunning = await isValorantRunning();
    if (!isRunning && valorantRunning) {
      console.log('Valorant has stopped running, stopping monitoring');
      GameStatusHandler.getInstance().then(handler => {
        handler.stopMonitoring();
        RpcService.getInstance().then(service => {
          service.clearActivity();
        });
      });
      valorantRunning = false;
    } else if (isRunning && !valorantRunning) {
      console.log('Valorant is running again, starting monitoring');
      startMonitoring();
      valorantRunning = true;
    }
  }
};

main().catch(console.error);
