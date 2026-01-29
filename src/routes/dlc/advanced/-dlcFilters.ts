type InputFilterMeta = {
  inputPlaceholder: string;
};
export type AdvancedFilter = {
  key?: string;
  title: string;
  description?: string;
  filter?: string | string[];
  meta?: InputFilterMeta | undefined;
};

export const DlcAdvancedFilters = {
  name: {
    title: 'Kartenname',
    description: 'Irgendein Wort, das im Namen der Karte vorkommt',
    filter: 'name',
    meta: {
      inputPlaceholder: `Irgendein Wort im Namen, z.B. "Micky"`,
    },
  },
  text: {
    title: 'Text',
    description: 'Irgendein Wort, das im Text der Karte vorkommt',
    filter: 'text',
  },
  type: {
    title: 'Typ und Klassifikation',
    description: '',
    filter: 'type',
  },
  ink: {
    title: 'Tinte',
    description: '',
    filter: 'ink',
  },
  strength: {
    title: 'Stärke',
    description: '',
    filter: 'strength',
  },
  willpower: {
    title: 'Willenskraft',
    description: '',
    filter: 'willpower',
  },
  movecost: {
    title: 'Bewegungskosten',
    description: '',
    filter: 'movecost',
  },
  lore: {
    title: 'Legendenwert',
    description: '',
    filter: 'lore',
  },
  sets: {
    title: 'Sets',
    description: '',
    filter: 'set',
  },
  rarity: {
    title: 'Seltenheit',
    description: '',
    filter: 'rarity',
  },
  artist: {
    title: 'Künstler:in',
    description: '',
    filter: 'artist',
  },
  franchise: {
    title: 'Franchise',
    description: '',
    filter: 'franchise',
  },
  flavortext: {
    title: 'Flavortext',
    description: 'Irgendein Wort, das im Flavortext der Karte vorkommt, falls einer existiert.',
    filter: 'flavor',
  },
};
