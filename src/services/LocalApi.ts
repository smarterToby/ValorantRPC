import {RSOUserInfoResponse} from '../interfaces/api/RsoUserInfoRes.model';
import {UserInfo} from '../interfaces/UserInfo.model';
import axios from 'axios';
import {EntitlementsTokenRes} from '../interfaces/api/EntitlementRes.model';
import {ValorantClientConfig} from '../config/ValorantClientConfig';
import {BasicAuthHeader} from '../interfaces/api/BasicAuthHeader.model';
import * as https from 'https';
import {PresenceRes} from '../interfaces/api/PresenceRes.model';
import {ValPresence} from '../interfaces/api/ValPresence.model';

export class LocalApi {
  private static instance: LocalApi;
  private vc: ValorantClientConfig = ValorantClientConfig.getInstance();

  private port?: number;

  private agent = new https.Agent({
    rejectUnauthorized: false,
  });

  public static getInstance(): LocalApi {
    if (!this.instance) {
      this.instance = new LocalApi();
    }
    return this.instance;
  }

  public async getUserInfo(): Promise<UserInfo> {
    const basicAuthHeaders: BasicAuthHeader = {
      username: 'riot',
      password: this.vc.lockFilePassword!,
    };

    return axios
      .get<RSOUserInfoResponse>(
        `https://127.0.0.1:${this.vc.lockfilePort}/rso-auth/v1/authorization/userinfo`,
        {
          auth: basicAuthHeaders,
          httpsAgent: this.agent,
        }
      )
      .then(res => {
        return this.parseUserInfo(res.data);
      })
      .catch(err => {
        console.error('Error getting user info', err);
        throw err;
      });
  }

  public async getEntitlements(): Promise<EntitlementsTokenRes> {
    const basicAuthHeaders: BasicAuthHeader = {
      username: 'riot',
      password: this.vc.lockFilePassword!,
    };

    return axios
      .get<EntitlementsTokenRes>(
        `https://127.0.0.1:${this.vc.lockfilePort}/entitlements/v1/token`,
        {
          auth: basicAuthHeaders,
          httpsAgent: this.agent,
        }
      )
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.error('Error getting entitlements', err);
        throw err;
      });
  }

  public async getPresence(puuid: string) {
    const vc: ValorantClientConfig = ValorantClientConfig.getInstance();

    const authHeaders: BasicAuthHeader = {
      username: 'riot',
      password: vc.lockFilePassword!,
    };

    return axios
      .get<PresenceRes>(
        `https://127.0.0.1:${vc.lockfilePort}/chat/v4/presences`,
        {
          auth: authHeaders,
          httpsAgent: this.agent,
        }
      )
      .then(res => {
        return res.data.presences.find(
          (presence: ValPresence) => presence.puuid === puuid
        );
      })
      .catch(err => {
        console.error('Error getting entitlements', err);
        throw err;
      });
  }

  private parseUserInfo(userInfoObj: RSOUserInfoResponse): UserInfo {
    try {
      return JSON.parse(userInfoObj.userInfo);
    } catch (error) {
      console.error('Error parsing userInfo', error);
      throw error;
    }
  }
}
