import * as path from "path";
import { readFile } from "fs/promises";
import axios from "axios";
import { EntitlementsTokenResponse } from "../interfacees/EntitlementResponse.model";
import { ValorantApiService } from "./ValorantApiService";
import { VersionResponse } from "../interfacees/Api/VersionResponse.model";
import * as https from "https";

export class ValorantClient {
  private static _instance: ValorantClient;
  private _isInitialized = false;

  private _accessToken: string | undefined;
  private _entitlementToken: string | undefined;
  private _puuid: string | undefined;
  private _clientRegion: string | undefined;
  private _shard: string | undefined;
  private _clientVersion: string | undefined;

  private constructor() {
    this.initializeAsync();
  }

  static get instance(): ValorantClient {
    return this._instance;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  get clientVersion(): string | undefined {
    return this._clientVersion;
  }

  set clientVersion(clientVersion: string | undefined) {
    this._clientVersion = clientVersion;
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

  get clientRegion(): string | undefined {
    return this._clientRegion;
  }

  get shard(): string | undefined {
    return this._shard;
  }

  public static getInstance(): ValorantClient {
    if (!ValorantClient._instance) {
      ValorantClient._instance = new ValorantClient();
    }
    return ValorantClient._instance;
  }

  private async initializeAsync() {
    await this.setTokens();
    await this.setRegionShard();
    this._isInitialized = true;
    console.log("ValorantClient initialized");
  }

  public async waitForInitialization(): Promise<void> {
    while (!this._isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async setClientVersion() {
    console.log("in setclientversion");
    await ValorantApiService.getInstance().then(async apiService => {
      this._clientVersion = await apiService
        .getVersion()
        .then((res: VersionResponse) => res.version);
    });
    console.log(this.clientVersion);
  }

  private async getLockfile(): Promise<string | undefined> {
    try {
      const localAppData = process.env.LOCALAPPDATA;
      if (!localAppData) {
        throw new Error("LOCALAPPDATA Umgebungsvariable ist nicht definiert.");
      }

      const lockFilePath = path.join(
        localAppData,
        "Riot Games",
        "Riot Client",
        "Config",
        "lockfile"
      );
      return await readFile(lockFilePath, "utf8");
    } catch (error) {
      console.error("Fehler beim Lesen der Datei:", error);
      return undefined;
    }
  }

  private async setTokens(): Promise<void> {
    const lockfile = await this.getLockfile();

    const tokens: string[] = lockfile!.split(":");
    const port: string = tokens[2];
    const lockfilePassword = tokens[3];
    this.requestTokens(port, lockfilePassword);
  }

  private async setRegionShard() {
    try {
      const localAppData = process.env.LOCALAPPDATA;
      if (!localAppData) {
        throw new Error("LOCALAPPDATA Umgebungsvariable ist nicht definiert.");
      }

      const logFilePath = path.join(
        localAppData,
        "VALORANT",
        "Saved",
        "Logs",
        "ShooterGame.log"
      );
      const fileContent = await readFile(logFilePath, "utf8");
      const regex = /https:\/\/glz-(.+?)-1\.(.+?)\.a\.pvp\.net/;
      const match = fileContent.match(regex);

      if (match && match[1] && match[2]) {
        this._clientRegion = match[1];
        this._shard = match[2];
      } else {
        console.log("Keine Übereinstimmung gefunden.");
      }
    } catch (error) {
      console.error("Fehler beim Lesen der Datei:", error);
    }
  }

  private requestTokens(port: string, lockfilePassword: string) {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    const base64Credentials = Buffer.from(`riot:${lockfilePassword}`).toString(
      "base64"
    );

    axios
      .get<EntitlementsTokenResponse>(
        `https://127.0.0.1:${port}/entitlements/v1/token`,
        {
          headers: {
            Authorization: `Basic ${base64Credentials}`
          },
          httpsAgent: agent
        }
      )
      .then(response => {
        this._accessToken = response.data.accessToken;
        this._entitlementToken = response.data.token;
        this._puuid = response.data.subject;
      })
      .catch(error => {

      });
  }
}
