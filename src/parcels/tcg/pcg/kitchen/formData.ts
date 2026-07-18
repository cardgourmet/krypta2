import type { TcgFilterOperator } from '@/parcels/tcg/types.ts';

export type PcgKitchenFormData = {
  /* IDENTITY */
  basetype: {
    strictValues: Record<string, boolean>;
    mode: 'contains' | 'exact';
  };
  energy: {
    strictValues: Record<string, boolean>;
    mode: 'contains' | 'exact';
  };
  subtype: {
    values: string[];
    mode: 'contains' | 'exact';
  };
  stage: {
    values: string[];
  };
  evolves: {
    values: string[];
    mode: 'contains' | 'exact';
  };

  /* TEXT */
  name: {
    value: string;
    exact: boolean;
  };
  text: {
    value: string;
    exact: boolean;
  };
  flavortext: {
    value: string;
    exact: boolean;
  };

  /* EFFECT */
  ability: {
    values: string[];
    mode: 'contains' | 'exact';
  };
  attack: {
    // name
    value: string;
    exact: boolean;
  };
  effect: {
    values: string[];
    mode: 'contains' | 'exact';
  };

  /* STATS */
  hp: {
    value: number | string;
    operator: Exclude<TcgFilterOperator, ':'>;
  };
  retreat: {
    value: number | string;
    operator: Exclude<TcgFilterOperator, ':'>;
  };

  /* RELEASE */
  sets: {
    values: string[];
  };
  rarity: {
    values: string[];
  };

  /* ARTWORK */
  artist: {
    value: string;
    exact: boolean;
  };
};

export const createDefaultPcgFormData: () => PcgKitchenFormData = () => ({
  ability: { mode: 'contains', values: [] },
  artist: { exact: false, value: '' },
  attack: { exact: false, value: '' },
  basetype: {
    strictValues: {
      energy: false,
      pokemon: false,
      trainer: false,
    },
    mode: 'exact',
  },
  effect: { mode: 'contains', values: [] },
  energy: {
    mode: 'contains',
    strictValues: {
      colorless: false,
      darkness: false,
      dragon: false,
      fairy: false,
      fighting: false,
      fire: false,
      grass: false,
      lightning: false,
      metal: false,
      psychic: false,
      water: false,
    },
  },
  evolves: { mode: 'contains', values: [] },
  flavortext: { exact: false, value: '' },
  hp: { operator: '=', value: '' },
  name: { exact: false, value: '' },
  rarity: { values: [] },
  retreat: { operator: '=', value: '' },
  sets: { values: [] },
  stage: { values: [] },
  subtype: { mode: 'contains', values: [] },
  text: { exact: false, value: '' },
});
