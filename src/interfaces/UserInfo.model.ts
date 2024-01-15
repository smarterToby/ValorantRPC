export type UserInfo = {
  country: string;
  sub: string;
  lol_account: null;
  email_verified: boolean;
  player_plocale: null;
  country_at: number;
  pw: PasswordInfo;
  lol: LOLInfo;
  original_platform_id: string;
  original_account_id: number;
  phone_number_verified: boolean;
  photo: null;
  preferred_username: string;
  ban: BanInfo;
  ppid: null;
  lol_region: LOLRegionInfo[];
  player_locale: string;
  pvpnet_account_id: number;
  region: null;
  acct: AccountInfo;
  jti: string;
  username: string;
};

type PasswordInfo = {
  cng_at: number;
  reset: boolean;
  must_reset: boolean;
};

type LOLInfo = {
  cuid: number;
  cpid: string;
  uid: number;
  pid: string;
  apid: null;
  ploc: string;
  lp: boolean;
  active: boolean;
};

type BanInfo = {
  restrictions: any[];
};

type LOLRegionInfo = {
  cuid: number;
  cpid: string;
  uid: number;
  pid: string;
  lp: boolean;
  active: boolean;
};

type AccountInfo = {
  type: number;
  state: string;
  adm: boolean;
  game_name: string;
  tag_line: string;
  created_at: number;
};
