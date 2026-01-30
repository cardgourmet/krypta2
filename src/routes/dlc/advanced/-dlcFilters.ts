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
    description: 'Irgendeine Wortfolge, die im Text der Karte vorkommt',
    filter: 'text',
  },
  type: {
    title: 'Typ und Klassifikation',
    description: 'Begriff, der in der Typzeile der Karte steht',
    filter: 'type',
  },
  ink: {
    title: 'Tinte',
    description: 'Sorte der Tinte, gekennzeichnet durch Farbe und Symbol auf der Karte',
    filter: 'ink',
  },
  strength: {
    title: 'Stärke',
    description: 'Der Stärkewert beginnend von 0, nur für Charaktere',
    filter: 'strength',
  },
  willpower: {
    title: 'Willenskraft',
    description: 'Der Verteidigungswert beginnend von 0, nur für Charaktere',
    filter: 'willpower',
  },
  movecost: {
    title: 'Bewegungskosten',
    description: 'Die Bewegungskosten beginnend von 0, nur für Orte',
    filter: 'movecost',
  },
  lore: {
    title: 'Legendenwert',
    description: 'Der Legendenwert beginnend von 0, falls einer existiert',
    filter: 'lore',
  },
  sets: {
    title: 'Sets',
    description: 'Sets, in der die Karte gedruckt wurde',
    filter: 'set',
  },
  rarity: {
    title: 'Seltenheit',
    description: 'Seltenheit, mit der die Karte in einem Set gedruckt wurde',
    filter: 'rarity',
  },
  artist: {
    title: 'Künstler:in',
    description: 'Irgendein Wort, das im Namen der Künstler:in der Karte vorkommt',
    filter: 'artist',
  },
  franchise: {
    title: 'Franchise',
    description: 'Das Franchise, in das die Karte zugeordnet werden kann',
    filter: 'franchise',
  },
  flavortext: {
    title: 'Flavortext',
    description: 'Irgendein Wort, das im Flavortext der Karte vorkommt, falls einer existiert',
    filter: 'flavor',
  },
};
