export const Maps = {
  ASCENT: {
    displayName: 'Ascent',
    uuid: '7eaecc1b-4337-bbf6-6ab9-04b8f06b3319',
    mapUrl: '/Game/Maps/Ascent/Ascent',
  },
  SPLIT: {
    displayName: 'Split',
    uuid: 'd960549e-485c-e861-8d71-aa9d1aed12a2',
    mapUrl: '/Game/Maps/Bonsai/Bonsai',
  },
  FRACTURE: {
    displayName: 'Fracture',
    uuid: 'b529448b-4d60-346e-e89e-00a4c527a405',
    mapUrl: '/Game/Maps/Canyon/Canyon',
  },
  BIND: {
    displayName: 'Bind',
    uuid: '2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba',
    mapUrl: '/Game/Maps/Duality/Duality',
  },
  BREEZE: {
    displayName: 'Breeze',
    uuid: '2fb9a4fd-47b8-4e7d-a969-74b4046ebd53',
    mapUrl: '/Game/Maps/Foxtrot/Foxtrot',
  },
  DISTRICT: {
    displayName: 'District',
    uuid: '690b3ed2-4dff-945b-8223-6da834e30d24',
    mapUrl: '/Game/Maps/HURM/HURM_Alley/HURM_Alley',
  },
  KASBAH: {
    displayName: 'Kasbah',
    uuid: '12452a9d-48c3-0b02-e7eb-0381c3520404',
    mapUrl: '/Game/Maps/HURM/HURM_Bowl/HURM_Bowl',
  },
  DRIFT: {
    displayName: 'Drift',
    uuid: '2c09d728-42d5-30d8-43dc-96a05cc7ee9d',
    mapUrl: '/Game/Maps/HURM/HURM_Helix/HURM_Helix',
  },
  PIAZZA: {
    displayName: 'Piazza',
    uuid: 'de28aa9b-4cbe-1003-320e-6cb3ec309557',
    mapUrl: '/Game/Maps/HURM/HURM_Yard/HURM_Yard',
  },
  LOTUS: {
    displayName: 'Lotus',
    uuid: '2fe4ed3a-450a-948b-6d6b-e89a78e680a9',
    mapUrl: '/Game/Maps/Jam/Jam',
  },
  SUNSET: {
    displayName: 'Sunset',
    uuid: '92584fbe-486a-b1b2-9faa-39b0f486b498',
    mapUrl: '/Game/Maps/Juliett/Juliett',
  },
  PEARL: {
    displayName: 'Pearl',
    uuid: 'fd267378-4d1d-484f-ff52-77821ed10dc2',
    mapUrl: '/Game/Maps/Pitt/Pitt',
  },
  ICEBOX: {
    displayName: 'Icebox',
    uuid: 'e2ad5c54-4114-a870-9641-8ea21279579a',
    mapUrl: '/Game/Maps/Port/Port',
  },
  THE_RANGE: {
    displayName: 'The Range',
    uuid: 'ee613ee9-28b7-4beb-9666-08db13bb2244',
    mapUrl: '/Game/Maps/Poveglia/Range',
  },
  HAVEN: {
    displayName: 'Haven',
    uuid: '2bee0dc9-4ffe-519b-1cbd-7fbe763a6047',
    mapUrl: '/Game/Maps/Triad/Triad',
  },
} as const;

type Map = (typeof Maps)[keyof typeof Maps];

export const findMapByUuid = (uuid: string): Map | undefined => {
  return Object.values(Maps).find(map => map.uuid === uuid);
};

export const findMapByMapUrl = (mapUrl: string): Map | undefined => {
  return Object.values(Maps).find(map => map.mapUrl === mapUrl);
};
