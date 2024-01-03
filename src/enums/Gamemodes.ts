import { GameModeModel } from "../interfacees/Gamemode.model";

export const GameModes: { [key: string]: GameModeModel } = {
  STANDARD: {
    displayName: "Competitive",
    uuid: "96bd3920-4f36-d026-2b28-c683eb0bcac5",
    assetPath: "/Game/GameModes/Bomb/BombGameMode.BombGameMode_C",
    queueId: "competitive"
  },
  STANDARD_UNRATED: {
    displayName: "Unrated",
    uuid: "96bd3920-4f36-d026-2b28-c683eb0bcac5",
    assetPath: "/Game/GameModes/Bomb/BombGameMode.BombGameMode_C",
    queueId: "unrated"
  },
  STANDARD_COMPETITIVE: {
    displayName: "Competitive",
    uuid: "96bd3920-4f36-d026-2b28-c683eb0bcac5",
    assetPath: "/Game/GameModes/Bomb/BombGameMode.BombGameMode_C",
    queueId: "competitive"
  },
  DEATHMATCH: {
    displayName: "Deathmatch",
    uuid: "a8790ec5-4237-f2f0-e93b-08a8e89865b2",
    assetPath: "/Game/GameModes/Deathmatch/DeathmatchGameMode.DeathmatchGameMode_C",
    queueId: "deathmatch"
  },
  ESCALATION: {
    displayName: "Escalation",
    uuid: "a4ed6518-4741-6dcb-35bd-f884aecdc859",
    assetPath: "/Game/GameModes/GunGame/GunGameTeamsGameMode.GunGameTeamsGameMode_C",
    queueId: "ggteam"
  },
  TEAM_DEATHMATCH: {
    displayName: "Team Deathmatch",
    uuid: "e086db66-47fd-e791-ca81-06a645ac7661",
    assetPath: "/Game/GameModes/HURM/HURMGameMode.HURMGameMode_C",
    queueId: "hurm"
  },
  ONBOARDING: {
    displayName: "Onboarding",
    uuid: "d2b4e425-4cab-8d95-eb26-bb9b444551dc",
    assetPath: "/Game/GameModes/NewPlayerExperience/NPEGameMode_PrimaryAsset",
    queueId: "newplayerexp"
  },
  REPLICATION: {
    displayName: "Replication",
    uuid: "4744698a-4513-dc96-9c22-a9aa437e4a58",
    assetPath: "/Game/GameModes/OneForAll/OneForAll_GameMode.OneForAll_GameMode_C",
    queueId: "oneforallsr"
  },
  SPIKE_RUSH: {
    displayName: "Spike Rush",
    uuid: "e921d1e6-416b-c31f-1291-74930c330b7b",
    assetPath: "/Game/GameModes/QuickBomb/QuickBombGameMode.QuickBombGameMode_C",
    queueId: "spikerush"
  },
  PRACTICE: {
    displayName: "Practice Range",
    uuid: "e2dc3878-4fe5-d132-28f8-3d8c259efcc6",
    assetPath: "/Game/GameModes/ShootingRange/ShootingRangeGameMode.ShootingRangeGameMode_C",
    queueId: "range"
  },
  SNOWBALL_FIGHT: {
    displayName: "Snowball Fight",
    uuid: "57038d6d-49b1-3a74-c5ef-3395d9f23a97",
    assetPath: "/Game/GameModes/SnowballFight/SnowballFightGameMode.SnowballFightGameMode_C",
    queueId: "snowball"
  },
  SWIFTPLAY: {
    displayName: "Swiftplay",
    uuid: "5d0f264b-4ebe-cc63-c147-809e1374484b",
    assetPath: "/Game/GameModes/_Development/Swiftplay_EndOfRoundCredits/Swiftplay_EoRCredits_GameMode.Swiftplay_EoRCredits_GameMode_C",
    queueId: "swiftplay"
  }
} as const;

type Gamemode = (typeof GameModes)[keyof typeof GameModes];


export const findGameModeByPath = (inputPath: string): GameModeModel | null => {
  return (
    Object.values(GameModes).find(gameMode =>
      gameMode.assetPath.toLowerCase().includes(inputPath.toLowerCase())
    ) || null
  );
};

export const findQueueGameMode = (queueId: string) => {
  for (const key in GameModes) {
    if (GameModes[key].queueId.toLowerCase().includes(queueId.toLowerCase())) {
      return GameModes[key];
    }
  }
  return null;
};
