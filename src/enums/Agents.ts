export const Agents = {
  GEKKO: {
    displayName: 'Gekko',
    uuid: 'e370fa57-4757-3604-3648-499e1f642d3f',
  },
  FADE: {
    displayName: 'Fade',
    uuid: 'dade69b4-4f5a-8528-247b-219e5a1facd6',
  },
  BREACH: {
    displayName: 'Breach',
    uuid: '5f8d3a7f-467b-97f3-062c-13acf203c006',
  },
  DEADLOCK: {
    displayName: 'Deadlock',
    uuid: 'cc8b64c8-4b25-4ff9-6e7f-37b4da43d235',
  },
  RAZE: {
    displayName: 'Raze',
    uuid: 'f94c3b30-42be-e959-889c-5aa313dba261',
  },
  CHAMBER: {
    displayName: 'Chamber',
    uuid: '22697a3d-45bf-8dd7-4fec-84a9e28c69d7',
  },
  KAY_O: {
    displayName: 'KAYO',
    uuid: '601dbbe7-43ce-be57-2a40-4abd24953621',
  },
  SKYE: {
    displayName: 'Skye',
    uuid: '6f2a04ca-43e0-be17-7f36-b3908627744d',
  },
  CYPHER: {
    displayName: 'Cypher',
    uuid: '117ed9e3-49f3-6512-3ccf-0cada7e3823b',
  },
  SOVA_NPE: {
    displayName: 'Sova',
    uuid: 'ded3520f-4264-bfed-162d-b080e2abccf9',
  },
  SOVA: {
    displayName: 'Sova',
    uuid: '320b2a48-4d9b-a075-30f1-1f93a9b638fa',
  },
  KILLJOY: {
    displayName: 'Killjoy',
    uuid: '1e58de9c-4950-5125-93e9-a0aee9f98746',
  },
  HARBOR: {
    displayName: 'Harbor',
    uuid: '95b78ed7-4637-86d9-7e41-71ba8c293152',
  },
  VIPER: {
    displayName: 'Viper',
    uuid: '707eab51-4836-f488-046a-cda6bf494859',
  },
  PHOENIX: {
    displayName: 'Phoenix',
    uuid: 'eb93336a-449b-9c1b-0a54-a891f7921d69',
  },
  ASTRA: {
    displayName: 'Astra',
    uuid: '41fb69c1-4189-7b37-f117-bcaf1e96f1bf',
  },
  BRIMSTONE: {
    displayName: 'Brimstone',
    uuid: '9f0d8ba9-4140-b941-57d3-a7ad57c6b417',
  },
  ISO: {
    displayName: 'Iso',
    uuid: '0e38b510-41a8-5780-5e8f-568b2a4f2d6c',
  },
  NEON: {
    displayName: 'Neon',
    uuid: 'bb2a4828-46eb-8cd1-e765-15848195d751',
  },
  YORU: {
    displayName: 'Yoru',
    uuid: '7f94d92c-4234-0a36-9646-3a87eb8b5c89',
  },
  SAGE: {
    displayName: 'Sage',
    uuid: '569fdd95-4d10-43ab-ca70-79becc718b46',
  },
  REYNA: {
    displayName: 'Reyna',
    uuid: 'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc',
  },
  OMEN: {
    displayName: 'Omen',
    uuid: '8e253930-4c05-31dd-1b6c-968525494517',
  },
  JETT: {
    displayName: 'Jett',
    uuid: 'add6443a-41bd-e414-f6ad-e58d267f4e95',
  },
} as const;

type Agent = (typeof Agents)[keyof typeof Agents];

export const findAgentByUuid = (uuid: string): Agent | undefined => {
  return Object.values(Agents).find(agent => agent.uuid === uuid);
};
