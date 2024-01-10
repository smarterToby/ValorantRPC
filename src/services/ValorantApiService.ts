import { ValorantClient } from "./ValorantClient";
import axios from "axios";
import { PreGamePlayerResponse } from "../interfacees/Api/PreGamePlayerResponse.model";
import { CurrentGameMatchResponse } from "../interfacees/Api/CurrentGameMatchResponse.model";
import { VersionResponse } from "../interfacees/Api/VersionResponse.model";
import { PartyPlayerResponse } from "../interfacees/Api/PartyPlayerResponse.model";
import { PartyResponse } from "../interfacees/Api/PartyResponse.model";
import { CurrentGamePlayerResponse } from "../interfacees/Api/CurrentGamePlayerResponse.model";
import { PreGameMatchResponse } from "../interfacees/Api/PreGameMatchResponse.model";
import { PlayerInfoResponse } from "../interfacees/Api/PlayerInfoResponse";

export class ValorantApiService {
  private static instance: ValorantApiService;
  private _accessToken: string | undefined;
  private _entitlementToken: string | undefined;
  private _puuid: string | undefined;
  private _region: string | undefined;
  private _shard: string | undefined;
  private _clientVersion: string | undefined;
  private _currentGameMatchId: string | undefined;


  get currentGameMatchId(): string | undefined {
    return this._currentGameMatchId;
  }

  public static async getInstance(): Promise<ValorantApiService> {
    const vc: ValorantClient = ValorantClient.getInstance();
    await vc.waitForInitialization();
    if (!this.instance) {
      this.instance = new ValorantApiService();
      this.instance._accessToken = vc.accessToken;
      this.instance._entitlementToken = vc.entitlementToken;
      this.instance._puuid = vc.puuid;
      this.instance._region = vc.clientRegion;
      this.instance._shard = vc.shard;
      this.instance._clientVersion = vc.clientVersion;
    }

    return this.instance;
  }

  public getPreGamePlayer(puuid: string): Promise<PreGamePlayerResponse> {
    const URI = `https://glz-${this._region}-1.${this._shard}.a.pvp.net/pregame/v1/players/${puuid}`;

    const headers = {
      Authorization: `Bearer ${this._accessToken}`,
      "X-Riot-Entitlements-JWT": this._entitlementToken
    };

    return new Promise((resolve, reject) => {
      axios
        .get<PreGamePlayerResponse>(URI, { headers })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public getPreGameMatch(matchId: string): Promise<PreGameMatchResponse> {
    const URI = `https://glz-${this._region}-1.${this._shard}.a.pvp.net/pregame/v1/matches/${matchId}`;

    const headers = {
      Authorization: `Bearer ${this._accessToken}`,
      "X-Riot-Entitlements-JWT": this._entitlementToken
    };

    return new Promise((resolve, reject) => {
      axios
        .get<PreGameMatchResponse>(URI, { headers })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public getCurrentGamePlayer(puuid: string): Promise<CurrentGamePlayerResponse> {
    if (!puuid) {
      return Promise.reject("Puuid is undefined");
    }
    const URI = `https://glz-${this._region}-1.${this._shard}.a.pvp.net/core-game/v1/players/${puuid}`;

    const headers = {
      Authorization: `Bearer ${this._accessToken}`,
      "X-Riot-Entitlements-JWT": this._entitlementToken
    };

    return new Promise((resolve, reject) => {
      axios
        .get<CurrentGamePlayerResponse>(URI, { headers })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public getCurrentGameMatch(matchId: string): Promise<CurrentGameMatchResponse> {
    const URI = `https://glz-${this._region}-1.${this._shard}.a.pvp.net/core-game/v1/matches/${matchId}`;

    const headers = {
      Authorization: `Bearer ${this._accessToken}`,
      "X-Riot-Entitlements-JWT": this._entitlementToken
    };

    return new Promise((resolve, reject) => {
      axios
        .get<CurrentGameMatchResponse>(URI, { headers })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public getVersion(): Promise<VersionResponse> {
    const URI = "https://valorant-api.com/v1/version";
    return axios
      .get<any>(URI)
      .then(res => res.data.data)
      .catch(err => {
        throw err;
      });
  }

  public async getPartyPlayerByPuuid(puuid: string): Promise<PartyPlayerResponse> {
    const URI = `https://glz-${this._region}-1.${this._shard}.a.pvp.net/parties/v1/players/${puuid}`;

    if (!this._clientVersion) {
      this._clientVersion = await this.getVersion().then((res: VersionResponse) => res.version);
    }

    const headers = {
      Authorization: `Bearer ${this._accessToken}`,
      "X-Riot-Entitlements-JWT": this._entitlementToken,
      "X-Riot-ClientVersion": this._clientVersion
    };

    return new Promise((resolve, reject) => {
      axios
        .get<PartyPlayerResponse>(URI, { headers })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public getPartyById(partyId: string): Promise<PartyResponse> {
    const URI = `https://glz-${this._region}-1.${this._shard}.a.pvp.net/parties/v1/parties/${partyId}`;

    const headers = {
      Authorization: `Bearer ${this._accessToken}`,
      "X-Riot-Entitlements-JWT": this._entitlementToken
    };

    return new Promise((resolve, reject) => {
      axios
        .get<PartyResponse>(URI, { headers })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public getAccount(): Promise<PlayerInfoResponse> {
    const URI: string = "https://auth.riotgames.com/userinfo";

    const headers = {
      Authorization: `Bearer ${this._accessToken}`
    };

    return new Promise((resolve, reject) => {
      axios
        .get<PlayerInfoResponse>(URI, { headers })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

}
