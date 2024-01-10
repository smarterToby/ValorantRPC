import {ValorantApiService} from '../services/ValorantApiService';
import {RpcService} from '../services/RpcService';
import {RPCValues} from '../classes/RPCValues';
import {GameStatus} from '../enums/GameStatus';
import {ValorantClient} from '../services/ValorantClient';
import {PartyPlayerResponse} from '../interfacees/Api/PartyPlayerResponse.model';
import {PartyResponse} from '../interfacees/Api/PartyResponse.model';
import {PreGamePlayerResponse} from '../interfacees/Api/PreGamePlayerResponse.model';
import {CurrentGameMatchResponse} from '../interfacees/Api/CurrentGameMatchResponse.model';
import {findMapByMapUrl} from '../enums/Maps';
import {findAgentByUuid} from '../enums/Agents';
import {CurrentGamePlayerResponse} from '../interfacees/Api/CurrentGamePlayerResponse.model';
import {PreGameMatchResponse} from '../interfacees/Api/PreGameMatchResponse.model';
import {
  findGameModeByPath,
  findQueueGameMode,
  GameModes,
} from '../enums/Gamemodes';
import {GameModeModel} from '../interfacees/Gamemode.model';
import {PlayerInfoResponse} from '../interfacees/Api/PlayerInfoResponse';

export class GameStatusHandler {
  private static _instance: GameStatusHandler;

  private apiService!: ValorantApiService | undefined;
  private rpcService!: RpcService | undefined;
  private rpcValues!: RPCValues;

  private gameStatusInterval: NodeJS.Timeout | null = null;
  private partyStatusInterval: NodeJS.Timeout | null = null;

  public static async getInstance(): Promise<GameStatusHandler> {
    if (!this._instance) {
      this._instance = new GameStatusHandler();
    }
    return this._instance;
  }

  private async init() {
    this.apiService = await ValorantApiService.getInstance();
    this.rpcService = await RpcService.getInstance();
    this.rpcValues = RPCValues.getInstance();
    this.rpcValues.trackerNetworkLink = await this.createTrackerNetworkLink();
    await this.rpcService.initialize();
    this.rpcService?.setActivity(this.rpcValues.createActivity());
  }

  public async startMonitoring() {
    await this.init();
    await this.handlePartyStatus();
    await this.handleGameStatus();
    this.partyStatusInterval = setInterval(
      async () => this.handlePartyStatus(),
      10000
    );
    this.setGameStatusInterval();
  }

  private async createTrackerNetworkLink() {
    return this.apiService
      ?.getAccount()
      .then((res: PlayerInfoResponse) => {
        return `https://tracker.gg/valorant/profile/riot/${res.acct.game_name}%23${res.acct.tag_line}/overview`;
      })
      .catch(() => {
        return undefined;
      });
  }

  public stopMonitoring() {
    if (this.gameStatusInterval) {
      clearInterval(this.gameStatusInterval);
    }
    if (this.partyStatusInterval) {
      clearInterval(this.partyStatusInterval);
    }
    if (this.rpcService) {
      this.rpcService.clearActivity();
    }
  }

  private async handlePartyStatus() {
    const partyId: string | void = await this.apiService
      ?.getPartyPlayerByPuuid(ValorantClient.getInstance().puuid!)
      .then((res: PartyPlayerResponse) => res.CurrentPartyID)
      .catch(() => {});
    const partySize: number | void = await this.apiService
      ?.getPartyById(partyId!)
      .then((res: PartyResponse) => res.Members.length)
      .catch(() => {});

    if (partyId && partySize && partySize !== this.rpcValues.partySize) {
      this.rpcValues.partySize = partySize;
      this.rpcService?.setActivity(this.rpcValues.createActivity());
    }
  }

  private async handleGameStatus() {
    let matchId;
    let errorCount = 0;

    await this.apiService
      ?.getPreGamePlayer(ValorantClient.getInstance().puuid!)
      .then((res: PreGamePlayerResponse) => {
        this.rpcValues.gameStatus = GameStatus.AGENT_SELECT;
        matchId = res.MatchID;
        this.resetGameStatusInterval(1500);
      })
      .catch(() => {
        errorCount++;
      });

    await this.apiService
      ?.getCurrentGamePlayer(ValorantClient.getInstance().puuid!)
      .then((res: CurrentGamePlayerResponse) => {
        this.rpcValues.gameStatus = GameStatus.IN_PROGRESS;
        matchId = res.MatchID;
        this.resetGameStatusInterval(15000);
      })
      .catch(() => {
        errorCount++;
      });

    if (
      this.rpcValues.gameStatus === GameStatus.IN_LOBBY ||
      this.rpcValues.gameStatus === GameStatus.IN_QUEUE
    ) {
      await this.apiService
        ?.getPartyPlayerByPuuid(ValorantClient.getInstance().puuid!)
        .then(async (res: PartyPlayerResponse) => {
          await this.apiService
            ?.getPartyById(res.CurrentPartyID)
            .then((res: PartyResponse) => {
              if (res.State.toLowerCase() === 'matchmaking') {
                this.rpcValues.queueGameMode = findQueueGameMode(
                  res.MatchmakingData.QueueID
                )!;
                this.rpcValues.gameStatus = GameStatus.IN_QUEUE;
              } else {
                this.rpcValues.gameStatus = GameStatus.IN_LOBBY;
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    }

    if (errorCount === 2 && this.rpcValues.gameStatus !== GameStatus.IN_QUEUE) {
      this.rpcValues.gameStatus = GameStatus.IN_LOBBY;
      this.resetGameStatusInterval(1500);
    } else {
      const gameStatus: GameStatus = this.rpcValues.gameStatus;

      switch (gameStatus) {
        case GameStatus.AGENT_SELECT:
          this.apiService
            ?.getPreGameMatch(matchId!)
            .then((res: PreGameMatchResponse) => {
              this.rpcValues.map = findMapByMapUrl(res.MapID);
              this.rpcValues.gamemode = this.getGameMode(
                res.Mode,
                res.IsRanked
              )!;
            })
            .catch(() => {});
          break;
        case GameStatus.IN_PROGRESS:
          await this.apiService
            ?.getCurrentGameMatch(matchId!)
            .then((res: CurrentGameMatchResponse) => {
              const valorantClientPuuid = ValorantClient.getInstance().puuid;
              const player = res.Players.find(
                player => player.Subject === valorantClientPuuid
              );
              const selectedAgent = findAgentByUuid(player!.CharacterID!);
              this.rpcValues.map = findMapByMapUrl(res.MapID);
              this.rpcValues.gamemode = this.getGameMode(
                res.ModeID,
                res.MatchmakingData?.IsRanked
              )!;
              this.rpcValues.agent = selectedAgent;
              this.rpcValues.isCustomGame =
                res.ProvisioningFlow === 'CustomGame';
            })
            .catch(() => {});
          break;
        case GameStatus.IN_QUEUE:
          break;
        default:
          this.rpcValues.gameStatus = GameStatus.IN_LOBBY;
          break;
      }
    }
    if (
      await RpcService.getInstance().then(
        rpcService =>
          rpcService.currentActivity !== this.rpcValues.createActivity()
      )
    ) {
      this.rpcService?.setActivity(this.rpcValues.createActivity());
    }
  }

  private setGameStatusInterval() {
    this.resetGameStatusInterval(5000);
  }

  private resetGameStatusInterval(interval: number) {
    if (this.gameStatusInterval) {
      clearInterval(this.gameStatusInterval);
    }
    this.gameStatusInterval = setInterval(
      () => this.handleGameStatus(),
      interval
    );
  }

  private getGameMode(mapId: string, isRanked?: boolean): GameModeModel | null {
    if (isRanked) {
      return GameModes.STANDARD_COMPETITIVE;
    }

    const tmpGameMode = findGameModeByPath(mapId);
    if (tmpGameMode === GameModes.STANDARD) {
      return GameModes.STANDARD_UNRATED;
    }
    return tmpGameMode;
  }
}
