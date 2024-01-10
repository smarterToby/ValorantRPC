export type PreGameMatchResponse = {
  /** Pre-Game Match ID */
  ID: string;
  Version: number;
  Teams: {
    TeamID: ('Blue' | 'Red') | string;
    Players: {
      /** Player UUID */
      Subject: string;
      /** Character ID */
      CharacterID: string;
      CharacterSelectionState: '' | 'selected' | 'locked';
      PregamePlayerState: 'joined';
      CompetitiveTier: number;
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
      IsCaptain: boolean;
    }[];
  }[];
  AllyTeam: {
    TeamID: ('Blue' | 'Red') | string;
    Players: {
      /** Player UUID */
      Subject: string;
      /** Character ID */
      CharacterID: string;
      CharacterSelectionState: '' | 'selected' | 'locked';
      PregamePlayerState: 'joined';
      CompetitiveTier: number;
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
      IsCaptain: boolean;
    }[];
  } | null;
  EnemyTeam: {
    TeamID: ('Blue' | 'Red') | string;
    Players: {
      /** Player UUID */
      Subject: string;
      /** Character ID */
      CharacterID: string;
      CharacterSelectionState: '' | 'selected' | 'locked';
      PregamePlayerState: 'joined';
      CompetitiveTier: number;
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
      IsCaptain: boolean;
    }[];
  } | null;
  ObserverSubjects: unknown[];
  MatchCoaches: unknown[];
  EnemyTeamSize: number;
  EnemyTeamLockCount: number;
  PregameState: 'character_select_active' | 'provisioned';
  /** Date in ISO 8601 format */
  LastUpdated: string;
  /** Map ID */
  MapID: string;
  MapSelectPool: unknown[];
  BannedMapIDs: unknown[];
  CastedVotes?: unknown;
  MapSelectSteps: unknown[];
  MapSelectStep: number;
  Team1: ('Blue' | 'Red') | string;
  GamePodID: string;
  /** Game Mode */
  Mode: string;
  VoiceSessionID: string;
  MUCName: string;
  /** JWT containing match ID and player IDs */
  TeamMatchToken: string;
  QueueID: string | '';
  ProvisioningFlowID: 'Matchmaking' | 'CustomGame';
  IsRanked: boolean;
  PhaseTimeRemainingNS: number;
  StepTimeRemainingNS: number;
  altModesFlagADA: boolean;
  TournamentMetadata: null;
  RosterMetadata: null;
};
