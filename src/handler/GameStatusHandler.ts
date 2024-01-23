import {LocalApi} from '../services/LocalApi';
import {RpcService} from '../rpc/RpcService';
import {RpcDisplayValues} from '../rpc/RpcDisplayValues';
import {ValorantClientConfig} from '../config/ValorantClientConfig';
import {GameStatus} from '../enums/GameStatus';
import {ValPresence} from '../interfaces/api/ValPresence.model';
import {GameSessionDetails} from '../interfaces/GameSessionDetails.model';
import {
  convertStringToSessionLoopState,
  SessionLoopState,
} from '../enums/SessionLoopState';
import {GameModes, getGameModeByQueueId} from '../enums/Gamemodes';
import {findMapByMapUrl} from '../enums/Maps';
import {ValorantApi} from '../services/ValorantApi';

export class GameStatusHandler {
  private static _instance: GameStatusHandler;

  private _localApi!: LocalApi;
  private _valApi!: ValorantApi;
  private _rpcService!: RpcService;
  private _rpcDisplayValues!: RpcDisplayValues;
  private _valorantClientConfig!: ValorantClientConfig;

  private _gameStatus: GameStatus = GameStatus.IN_LOBBY;
  private _puuid!: string;

  private _gameStatusInterval: NodeJS.Timeout | null = null;

  private agentCount = 0;

  public static async getInstance(): Promise<GameStatusHandler> {
    if (!this._instance) {
      this._instance = new GameStatusHandler();
    }
    return this._instance;
  }

  public async startMonitoring() {
    await this.init();
    this._gameStatusInterval = setInterval(async () => {
      await this.handleGameStatus();
      this.agentCount++;
      if (this.agentCount === 30) this.agentCount = 0;
    }, 2000);
  }

  public stopMonitoring() {
    if (this._gameStatusInterval) {
      clearInterval(this._gameStatusInterval);
      this._gameStatusInterval = null;
    }
  }

  private async init() {
    this._valorantClientConfig = ValorantClientConfig.getInstance();
    this._localApi = LocalApi.getInstance();
    this._valApi = ValorantApi.getInstance();
    this._rpcService = await RpcService.getInstance();
    this._rpcDisplayValues = RpcDisplayValues.getInstance();
    this._puuid = this._valorantClientConfig.puuid!;

    await this._rpcService.initialize();
    this._rpcService.setActivity(
      this._rpcDisplayValues.createActivity(this._gameStatus)
    );
  }

  private async handleGameStatus() {
    const presence: ValPresence | undefined | void = await this._localApi
      .getPresence(this._puuid)
      .catch(err => console.error(err));
    if (!presence) return;
    const gameStatus: GameSessionDetails =
      this.decodeBase64ToGameSessionDetails(presence.private!);

    this._rpcDisplayValues.partySize = gameStatus.partySize;

    switch (convertStringToSessionLoopState(gameStatus.sessionLoopState)) {
      case SessionLoopState.MENUS:
        this.handleInMenu(gameStatus);
        break;
      case SessionLoopState.PREGAME:
        this._gameStatus = GameStatus.AGENT_SELECT;
        this._rpcDisplayValues.map = findMapByMapUrl(gameStatus.matchMap);
        this.setGameModeByProvisioningFlow(gameStatus);
        break;
      case SessionLoopState.INGAME:
        await this.handleInGame(gameStatus);
        break;
    }

    this._rpcService.setActivity(
      RpcDisplayValues.getInstance().createActivity(this._gameStatus)
    );
  }

  private decodeBase64ToGameSessionDetails(
    base64String: string
  ): GameSessionDetails {
    try {
      const decodedString = atob(base64String);

      const parsedObject = JSON.parse(decodedString);

      return parsedObject as GameSessionDetails;
    } catch (error) {
      return {} as GameSessionDetails;
    }
  }

  private handleInMenu(gameStatus: GameSessionDetails) {
    if (gameStatus.partyState === 'MATCHMAKING') {
      this._gameStatus = GameStatus.IN_QUEUE;
      this._rpcDisplayValues.queueGameMode = getGameModeByQueueId(
        gameStatus.queueId
      )!;
    } else {
      this._gameStatus = GameStatus.IN_LOBBY;
    }
  }

  private async handleInGame(gameStatus: GameSessionDetails) {
    this._gameStatus = GameStatus.IN_PROGRESS;
    this.setGameModeByProvisioningFlow(gameStatus);
    if (this.agentCount === 30 || this.agentCount === 0) {
      this._rpcDisplayValues.agent = await this._valApi.getSelectedAgent(
        this._valorantClientConfig.puuid!
      );
    }
    this._rpcDisplayValues.map = findMapByMapUrl(gameStatus.matchMap);
    this._rpcDisplayValues.matchScoreAlly =
      gameStatus.partyOwnerMatchScoreAllyTeam;
    this._rpcDisplayValues.matchScoreEnemy =
      gameStatus.partyOwnerMatchScoreEnemyTeam;
  }

  private setGameModeByProvisioningFlow(gameStatus: GameSessionDetails) {
    if (gameStatus.provisioningFlow === 'CustomGame') {
      this._rpcDisplayValues.isTheRange = false;
      this._rpcDisplayValues.gamemode = GameModes.CUSTOM;
    } else if (gameStatus.provisioningFlow === 'ShootingRange') {
      this._rpcDisplayValues.isTheRange = true;
    } else {
      this._rpcDisplayValues.isTheRange = false;
      this._rpcDisplayValues.gamemode = getGameModeByQueueId(
        gameStatus.queueId
      )!;
    }
  }
}
