export interface CurrentGameMatchResponse {
  /** Current Game Match ID */
  MatchID: string;
  Version: number;
  State: 'IN_PROGRESS';
  /** Map ID */
  MapID: string;
  /** Game Mode */
  ModeID: string;
  ProvisioningFlow: 'Matchmaking' | 'CustomGame';
  GamePodID: string;
  /** Chat room ID for "all" chat */
  AllMUCName: string;
  /** Chat room ID for "team" chat */
  TeamMUCName: string;
  TeamVoiceID: string;
  /** JWT containing match ID, participant IDs, and match region */
  TeamMatchToken: string;
  IsReconnectable: boolean;
  ConnectionDetails: {
    GameServerHosts: string[];
    GameServerHost: string;
    GameServerPort: number;
    GameServerObfuscatedIP: number;
    GameClientHash: number;
    PlayerKey: string;
  };
  PostGameDetails: null;
  Players: {
    /** Player UUID */
    Subject: string;
    TeamID: ('Blue' | 'Red') | string;
    /** Agents ID */
    CharacterID: string;
    PlayerIdentity: {
      /** Player UUID */
      Subject: string;
      /** Card ID */
      PlayerCardID: string;
      /** Title ID */
      PlayerTitleID: string;
      AccountLevel: number;
      /** Preferred Level Border ID */
      PreferredLevelBorderID: string | '';
      Incognito: boolean;
      HideAccountLevel: boolean;
    };
    SeasonalBadgeInfo: {
      SeasonID: string | '';
      NumberOfWins: number;
      WinsByTier: null;
      Rank: number;
      LeaderboardRank: number;
    };
    IsCoach: boolean;
    IsAssociated: boolean;
  }[];
  MatchmakingData: null | {
    QueueID: string;
    IsRanked: boolean;
  };
}
