export interface GameSessionDetails {
  isValid: boolean;
  sessionLoopState: string;
  partyOwnerSessionLoopState: string;
  customGameName: string;
  customGameTeam: string;
  partyOwnerMatchMap: string;
  partyOwnerMatchCurrentTeam: string;
  partyOwnerMatchScoreAllyTeam: number;
  partyOwnerMatchScoreEnemyTeam: number;
  partyOwnerProvisioningFlow: string;
  provisioningFlow: string;
  matchMap: string;
  partyId: string;
  isPartyOwner: boolean;
  partyState: string;
  partyAccessibility: string;
  maxPartySize: number;
  queueId: string;
  partyLFM: boolean;
  partyClientVersion: string;
  partySize: number;
  tournamentId: string;
  rosterId: string;
  partyVersion: number;
  queueEntryTime: string;
  playerCardId: string;
  playerTitleId: string;
  preferredLevelBorderId: string;
  accountLevel: number;
  competitiveTier: number;
  leaderboardPosition: number;
  isIdle: boolean;
}