import * as DiscordRPC from 'discord-rpc';
import {RPC_CONFIG} from './RpcConfig';
import {Presence} from 'discord-rpc';

export class RpcService {
  private rpc: DiscordRPC.Client;
  private static instance: RpcService;
  private CLIENT_ID: string;
  private _currentActivity: DiscordRPC.Presence | null = null;

  private constructor() {
    this.rpc = new DiscordRPC.Client({transport: 'ipc'});
    this.CLIENT_ID = RPC_CONFIG.clientId;
  }

  public static async getInstance(): Promise<RpcService> {
    if (!this.instance) {
      this.instance = new RpcService();
      await this.instance.initialize();
    }
    return this.instance;
  }

  public async initialize() {
    try {
      await this.rpc.login({clientId: this.CLIENT_ID});
      console.log('RPC connection established');
    } catch (error) {
      console.error('Failed to initialize RPC:', error);
    }
  }

  public setActivity(activity: DiscordRPC.Presence): void {
    this._currentActivity = activity;
    this.rpc.setActivity(activity).catch(console.error);
  }

  public clearActivity(): void {
    this.rpc.clearActivity().catch(console.error);
  }

  public destroy(): void {
    this.rpc.destroy().catch(console.error);
  }

  get currentActivity(): Presence | null {
    return this._currentActivity;
  }
}
