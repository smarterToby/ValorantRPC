import {LocalApi} from '../services/LocalApi';
import {UserInfo} from '../interfaces/UserInfo.model';
import {readFile} from 'fs/promises';
import * as path from 'node:path';
import {EntitlementsTokenRes} from '../interfaces/api/EntitlementRes.model';
import {RpcDisplayValues} from '../rpc/RpcDisplayValues';

export class ValorantClientConfig {
  private static _instance: ValorantClientConfig;

  private _accessToken: string | undefined;
  private _entitlementToken: string | undefined;

  private _puuid: string | undefined;

  private _lockfilePort: number | undefined;
  private _lockFilePassword: string | undefined;

  private _clientRegion: string | undefined;
  private _shard: string | undefined;

  public static getInstance(): ValorantClientConfig {
    if (!this._instance) {
      this._instance = new ValorantClientConfig();
      this.init().then(() => {
        console.log('ValorantClientConfig initialized');
      });
    }
    return this._instance;
  }

  private static async init() {
    await this.getInstance()
      .setLockfileConfig()
      .then(() => {
        console.log('Lockfile config set');
      })
      .catch(err => {
        console.error('Error setting lockfile config', err);
      });
    const userInfo: UserInfo = await LocalApi.getInstance().getUserInfo();
    this._instance._puuid = userInfo.sub;
    const entitlements: EntitlementsTokenRes =
      await LocalApi.getInstance().getEntitlements();
    RpcDisplayValues.getInstance().setTrackerNetworkLink(
      userInfo.acct.game_name,
      userInfo.acct.tag_line
    );
    this._instance._accessToken = entitlements.accessToken;
    this._instance._entitlementToken = entitlements.token;

    await this._instance.setRegionShard();
  }

  private async setLockfileConfig() {
    const lockfile = await this.getLockfile();
    if (!lockfile) {
      return;
    }
    const lockfileConfig = lockfile.split(':');
    this._lockfilePort = parseInt(lockfileConfig[2], 10);
    this._lockFilePassword = lockfileConfig[3];
  }

  private async getLockfile() {
    try {
      const localAppData = process.env.LOCALAPPDATA;
      if (!localAppData) {
        throw new Error('LOCALAPPDATA is not defined');
      }

      const lockFilePath = path.join(
        localAppData,
        'Riot Games',
        'Riot Client',
        'Config',
        'lockfile'
      );
      return await readFile(lockFilePath, 'utf8');
    } catch (error) {
      console.error('Error reading Lockfile', error);
      return undefined;
    }
  }

  private async setRegionShard() {
    try {
      const localAppData = process.env.LOCALAPPDATA;
      if (!localAppData) {
        throw new Error('LOCALAPPDATA is not defined');
      }

      const logFilePath = path.join(
        localAppData,
        'VALORANT',
        'Saved',
        'Logs',
        'ShooterGame.log'
      );
      const fileContent = await readFile(logFilePath, 'utf8');
      const regex = /https:\/\/glz-(.+?)-1\.(.+?)\.a\.pvp\.net/;
      const match = fileContent.match(regex);

      if (match && match[1] && match[2]) {
        this._clientRegion = match[1];
        this._shard = match[2];
      }
    } catch (error) {
      console.error('Error setting region and shard', error);
    }
  }

  get accessToken(): string | undefined {
    return this._accessToken;
  }

  get entitlementToken(): string | undefined {
    return this._entitlementToken;
  }

  get puuid(): string | undefined {
    return this._puuid;
  }

  get lockfilePort(): number | undefined {
    return this._lockfilePort;
  }

  get lockFilePassword(): string | undefined {
    return this._lockFilePassword;
  }

  get shard(): string | undefined {
    return this._shard;
  }

  get clientRegion(): string | undefined {
    return this._clientRegion;
  }
}
