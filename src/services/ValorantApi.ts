import {ValorantClientConfig} from '../config/ValorantClientConfig';
import {CurrentGamePlayerResponse} from '../interfaces/api/CurrentGamePlayerResponse.model';
import axios from 'axios';
import {CurrentGameMatchResponse} from '../interfaces/api/CurrentGameMatchResponse.model';
import {findAgentByUuid} from '../enums/Agents';
import * as https from 'https';

export class ValorantApi {
  private static _instance: ValorantApi;
  private vc: ValorantClientConfig = ValorantClientConfig.getInstance();

  private agent: https.Agent = new https.Agent({
    rejectUnauthorized: false,
  });

  public static getInstance(): ValorantApi {
    if (!ValorantApi._instance) {
      ValorantApi._instance = new ValorantApi();
    }
    return ValorantApi._instance;
  }

  public async getSelectedAgent(puuid: string): Promise<any> {
    const matchId: string | undefined = await this.getCurrentMatchPlayer(
      puuid,
      this.vc.shard!,
      this.vc.clientRegion!
    ).then(res => {
      return res?.MatchID;
    });
    if (!matchId) {
      return;
    }
    return await this.getCurrentMatch(
      matchId!,
      this.vc.shard!,
      this.vc.clientRegion!
    )
      .then((res: CurrentGameMatchResponse | null) => {
        const characterId: string = res?.Players.find(p => p.Subject === puuid)
          ?.CharacterID!;
        return findAgentByUuid(characterId!);
      })
      .catch(() => {});
  }

  public async getCurrentMatchPlayer(
    puuid: string,
    shard: string,
    region: string
  ): Promise<CurrentGamePlayerResponse | null> {
    const authHeader = {
      Authorization: `Bearer ${this.vc.accessToken}`,
      'X-Riot-Entitlements-JWT': this.vc.entitlementToken!,
    };
    return await axios
      .get(
        `https://glz-${region}-1.${shard}.a.pvp.net/core-game/v1/players/${puuid}`,
        {httpsAgent: this.agent, headers: authHeader}
      )
      .then(res => {
        return res.data;
      })
      .catch(() => {});
  }

  public async getCurrentMatch(
    matchId: string,
    shard: string,
    region: string
  ): Promise<CurrentGameMatchResponse | null> {
    const authHeader = {
      Authorization: `Bearer ${this.vc.accessToken}`,
      'X-Riot-Entitlements-JWT': this.vc.entitlementToken!,
    };

    return await axios
      .get(
        `https://glz-${region}-1.${shard}.a.pvp.net/core-game/v1/matches/${matchId}`,
        {httpsAgent: this.agent, headers: authHeader}
      )
      .then(res => {
        return res.data;
      })
      .catch(() => {});
  }
}
