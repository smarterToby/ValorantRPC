import {Agent} from '../interfacees/Agent.model';
import {Map} from '../interfacees/Map.model';
import {GameModeModel} from '../interfacees/Gamemode.model';
import * as DiscordRPC from 'discord-rpc';
import {GameStatus} from '../enums/GameStatus';

export class RPCValues {
  private static _instance: RPCValues;
  private _startTimestamp: number | undefined;
  private _agent: Agent | undefined;
  private _map: Map | undefined;
  private _partySize: number | undefined;
  private _gamemode: GameModeModel | undefined;
  private _queueGameMode: GameModeModel | undefined;
  private _myTeamWonRounds: number | undefined;
  private _enemyTeamWonRounds: number | undefined;
  private _gameStatus: GameStatus = GameStatus.UNKNOWN;
  private _trackerNetworkLink: string | undefined;

  private _currentMatchId: string | undefined;

  private _isCustomGame = false;

  public static getInstance(): RPCValues {
    if (!RPCValues._instance) {
      RPCValues._instance = new RPCValues();
      this._instance._gameStatus = GameStatus.UNKNOWN;
    }
    if (!this._instance._startTimestamp) {
      this._instance._startTimestamp = +new Date();
    }
    return RPCValues._instance;
  }

  public createActivity(): DiscordRPC.Presence {
    let activity: DiscordRPC.Presence;

    switch (this._gameStatus) {
      case GameStatus.UNKNOWN:
        activity = this.createUnknownActivity();
        break;
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
        activity = this.createUnknownActivity();
        break;
    }

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

  private createUnknownActivity(): DiscordRPC.Presence {
    return {
      startTimestamp: this._startTimestamp,
      largeImageKey: 'valorant_logo',
      largeImageText: 'Made by @smartertoby',
      instance: false,
    };
  }

  private createLobbyActivity(): DiscordRPC.Presence {
    return {
      details: 'In Lobby',
      startTimestamp: this._startTimestamp,
      largeImageKey: 'valorant_logo',
      largeImageText: 'Made by @smartertoby',
      instance: false,
    };
  }

  private createQueueActivity(): DiscordRPC.Presence {
    return {
      details: `In Queue ${this.queueGameMode?.displayName}`,
      startTimestamp: this._startTimestamp,
      largeImageKey: 'valorant_logo',
      largeImageText: 'Made by @smartertoby',
      instance: false,
    };
  }

  private createAgentSelectActivity(): DiscordRPC.Presence {
    if (this.map?.displayName) {
      return {
        details: 'Selecting Agent',
        state:
          this.partySize === 1
            ? `Playing Solo on ${this.map?.displayName}`
            : `Playing in a party of ${this.partySize} on ${this.map?.displayName}`,
        startTimestamp: this._startTimestamp,
        largeImageKey: 'valorant_logo',
        largeImageText: 'Made by @smartertoby',
        instance: false,
      };
    }
    return {
      details: 'Selecting Agent',
      state:
        this.partySize === 1
          ? 'Playing Solo'
          : `Playing in a party of ${this.partySize}`,
      startTimestamp: this._startTimestamp,
      largeImageKey: 'valorant_logo',
      largeImageText: 'Made by @smartertoby',
      instance: false,
    };
  }

  private createInProgressActivity(): DiscordRPC.Presence {
    return {
      details: `Playing ${this.isCustomGame ? 'Custom ' : ''}${this.gamemode
        ?.displayName}`,
      state:
        this.partySize === 1
          ? `Playing Solo on ${this.map?.displayName}`
          : `Playing in a party of ${this.partySize} on ${this.map?.displayName}`,
      startTimestamp: this._startTimestamp,
      largeImageKey: 'valorant_logo',
      largeImageText: 'Made by @smartertoby',
      smallImageKey: `agent_${this.agent?.displayName.toLowerCase()}`,
      smallImageText: `${this.agent?.displayName}`,
      instance: false,
    };
  }

  public toString(): string {
    return `RPCValues {
  startTimestamp: ${this._startTimestamp},
  agent: ${this._agent},
  map: ${this._map},
  partySize: ${this._partySize},
  gamemode: ${this._gamemode},
  myTeamWonRounds: ${this._myTeamWonRounds},
  enemyTeamWonRounds: ${this._enemyTeamWonRounds},
  gameStatus: ${this._gameStatus},
  currentMatchId: ${this._currentMatchId},
  queueGameMode: ${this._queueGameMode},
  isCustomGame: ${this._isCustomGame}
}`;
  }

  set trackerNetworkLink(value: string | undefined) {
    this._trackerNetworkLink = value;
  }

  get startTimestamp(): number | undefined {
    return this._startTimestamp;
  }

  get agent(): Agent | undefined {
    return this._agent;
  }

  set agent(value: Agent | undefined) {
    this._agent = value;
  }

  get map(): Map | undefined {
    return this._map;
  }

  set map(value: Map | undefined) {
    this._map = value;
  }

  get partySize(): number | undefined {
    return this._partySize;
  }

  set partySize(value: number | undefined) {
    this._partySize = value;
  }

  get gamemode(): GameModeModel | undefined {
    return this._gamemode;
  }

  set gamemode(value: GameModeModel | undefined) {
    this._gamemode = value;
  }

  get myTeamWonRounds(): number | undefined {
    return this._myTeamWonRounds;
  }

  set myTeamWonRounds(value: number | undefined) {
    this._myTeamWonRounds = value;
  }

  get enemyTeamWonRounds(): number | undefined {
    return this._enemyTeamWonRounds;
  }

  set enemyTeamWonRounds(value: number | undefined) {
    this._enemyTeamWonRounds = value;
  }

  get gameStatus(): GameStatus {
    return this._gameStatus;
  }

  set gameStatus(value: GameStatus) {
    this._gameStatus = value;
  }

  get currentMatchId(): string | undefined {
    return this._currentMatchId;
  }

  set currentMatchId(value: string | undefined) {
    this._currentMatchId = value;
  }

  get queueGameMode(): GameModeModel | undefined {
    return this._queueGameMode;
  }

  set queueGameMode(value: GameModeModel | undefined) {
    this._queueGameMode = value;
  }

  get isCustomGame(): boolean {
    return this._isCustomGame;
  }

  set isCustomGame(value: boolean) {
    this._isCustomGame = value;
  }
}
