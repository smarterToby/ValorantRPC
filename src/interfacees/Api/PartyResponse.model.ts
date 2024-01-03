export type PartyResponse = {
  /** Party ID */
  ID: string;
  MUCName: string;
  VoiceRoomID: string;
  Version: number;
  ClientVersion: string;
  Members: {
    /** Player UUID */
    Subject: string;
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
      PreferredLevelBorderID: string | "";
      Incognito: boolean;
      HideAccountLevel: boolean;
    };
    SeasonalBadgeInfo: null;
    IsOwner?: boolean | undefined;
    QueueEligibleRemainingAccountLevels: number;
    Pings: {
      Ping: number;
      GamePodID: string;
    }[];
    IsReady: boolean;
    IsModerator: boolean;
    UseBroadcastHUD: boolean;
    PlatformType: "PC";
  }[];
  State: string;
  PreviousState: string;
  StateTransitionReason: string;
  Accessibility: "OPEN" | "CLOSED";
  CustomGameData: {
    Settings: {
      /** Map ID */
      Map: string;
      /** Game Mode */
      Mode: string;
      UseBots: boolean;
      GamePod: string;
      GameRules: {
        AllowGameModifiers?: string | undefined;
        IsOvertimeWinByTwo?: string | undefined;
        PlayOutAllRounds?: string | undefined;
        SkipMatchHistory?: string | undefined;
        TournamentMode?: string | undefined;
      } | null;
    };
    Membership: {
      teamOne: {
        /** Player UUID */
        Subject: string;
      }[] | null;
      teamTwo: {
        /** Player UUID */
        Subject: string;
      }[] | null;
      teamSpectate: {
        /** Player UUID */
        Subject: string;
      }[] | null;
      teamOneCoaches: {
        /** Player UUID */
        Subject: string;
      }[] | null;
      teamTwoCoaches: {
        /** Player UUID */
        Subject: string;
      }[] | null;
    };
    MaxPartySize: number;
    AutobalanceEnabled: boolean;
    AutobalanceMinPlayers: number;
    HasRecoveryData: boolean;
  };
  MatchmakingData: {
    /** Queue ID */
    QueueID: string;
    PreferredGamePods: string[];
    SkillDisparityRRPenalty: number;
  };
  Invites: null;
  Requests: unknown[];
  /** Date in ISO 8601 format */
  QueueEntryTime: string;
  ErrorNotification: {
    ErrorType: string;
    ErroredPlayers: {
      /** Player UUID */
      Subject: string;
    }[] | null;
  };
  RestrictedSeconds: number;
  EligibleQueues: string[];
  QueueIneligibilities: string[];
  CheatData: {
    GamePodOverride: string;
    ForcePostGameProcessing: boolean;
  };
  XPBonuses: unknown[];
  InviteCode: string;
};
