import * as DiscordRPC from 'discord-rpc';
import {GameStatus} from '../enums/GameStatus';
import {Agent} from '../interfaces/Agent.model';
import {GameModeModel} from '../interfaces/Gamemode.model';
import {GameMap} from '../interfaces/Map.model';

export class RpcDisplayValues {
  private static _instance: RpcDisplayValues;
  private _startTimestamp: number | undefined;
  private _agent: Agent | undefined;
  private _map: GameMap | undefined;
  private _partySize: number | undefined;
  private _gamemode: GameModeModel | undefined;
  private _queueGameMode: GameModeModel | undefined;
  private _matchScoreAlly: number | undefined;
  private _matchScoreEnemy: number | undefined;
  private _trackerNetworkLink: string | undefined;

  private _isTheRange = false;

  private _isIdle = false;

  public static getInstance(): RpcDisplayValues {
    if (!RpcDisplayValues._instance) {
      RpcDisplayValues._instance = new RpcDisplayValues();
    }
    if (!this._instance._startTimestamp) {
      this._instance._startTimestamp = +new Date();
    }
    return RpcDisplayValues._instance;
  }

  public createActivity(gameStatus: GameStatus): DiscordRPC.Presence {
    let activity: DiscordRPC.Presence;

    switch (gameStatus) {
      case GameStatus.IN_LOBBY:
        activity = this.createLobbyActivity();
        break;
      case GameStatus.IN_QUEUE:
        activity = this.createQueueActivity();
        break;
      case GameStatus.AGENT_SELECT:
        activity = this.createAgentSelectActivity();
        break;
      case GameStatus.IN_PROGRESS:
        activity = this.createInProgressActivity();
        break;
      default:
        activity = {};
        break;
    }

    activity.startTimestamp = this._startTimestamp;
    activity.largeImageKey = 'valorant_logo';
    activity.largeImageText = 'Made by @smartertoby';
    activity.instance = false;

    if (this._trackerNetworkLink) {
      activity.buttons = [
        {
          label: 'Tracker Network Profile',
          url: this._trackerNetworkLink,
        },
      ];
    }
    return activity;
  }

  private createLobbyActivity(): DiscordRPC.Presence {
    const presence: DiscordRPC.Presence = {
      details: 'In Lobby',
    };

    if (this._isIdle) {
      presence.details += ' (Idle)';
      presence.smallImageKey = 'icon_idle';
      presence.smallImageText = 'Idle';
    }

    return presence;
  }

  private createQueueActivity(): DiscordRPC.Presence {
    return {
      details: `In Queue ${this._queueGameMode?.displayName}`,
    };
  }

  private createAgentSelectActivity(): DiscordRPC.Presence {
    if (this._map?.displayName) {
      return {
        details: `Selecting Agent${' for ' + this._gamemode?.displayName}`,
        state:
          this.partySize === 1
            ? `Playing Solo on ${this._map?.displayName}`
            : `Playing in a party of ${this._partySize} on ${this._map?.displayName}`,
      };
    }
    return {
      details: 'Selecting Agent',
      state:
        this._partySize === 1
          ? 'Playing Solo'
          : `Playing in a party of ${this._partySize}`,
    };
  }

  private createInProgressActivity(): DiscordRPC.Presence {
    const presence: DiscordRPC.Presence = {
      smallImageKey: `agent_${this._agent?.displayName.toLowerCase()}`,
      smallImageText: `${this._agent?.displayName}`,
    };
    if (!this._isTheRange) {
      presence.details = `Playing ${this._gamemode?.displayName} | ${this._matchScoreAlly} - ${this._matchScoreEnemy}`;
      presence.state =
        this._partySize === 1
          ? `Playing Solo on ${this._map?.displayName}`
          : `Playing in a party of ${this._partySize} on ${this._map?.displayName}`;
    } else {
      presence.state = 'In The Range';
    }
    return presence;
  }

  public setTrackerNetworkLink(gameName: string, tagLine: string): void {
    this._trackerNetworkLink = `https://tracker.gg/valorant/profile/riot/${gameName}%23${tagLine}/overview`;
  }

  set isIdle(value: boolean) {
    this._isIdle = value;
  }

  set agent(value: Agent | undefined) {
    this._agent = value;
  }

  set map(value: GameMap | undefined) {
    this._map = value;
  }

  get partySize(): number | undefined {
    return this._partySize;
  }

  set partySize(value: number | undefined) {
    this._partySize = value;
  }

  set gamemode(value: GameModeModel | undefined) {
    this._gamemode = value;
  }

  set matchScoreAlly(value: number | undefined) {
    this._matchScoreAlly = value;
  }

  set matchScoreEnemy(value: number | undefined) {
    this._matchScoreEnemy = value;
  }

  set queueGameMode(value: GameModeModel | undefined) {
    this._queueGameMode = value;
  }

  set isTheRange(value: boolean) {
    this._isTheRange = value;
  }
}
