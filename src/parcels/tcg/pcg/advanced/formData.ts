import type { TcgFilterOperator } from '@/parcels/tcg/types.ts';

export type PcgAdvancedFilterFormData = {
  /* IDENTITY */
  basetype: {
    values: Record<string, boolean>;
  };
  energy: {
    values: Record<string, boolean>;
    exact: boolean;
  };
  subtype: {
    values: string[];
    exact: boolean;
  };
  stage: {
    values: string[];
  };
  evolves: {
    values: string[];
    exact: boolean;
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
    exact: boolean;
  };
  attack: {
    // name
    value: string;
    exact: boolean;
  };
  effect: {
    values: string[];
    exact: boolean;
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

export const createDefaultFormData: () => PcgAdvancedFilterFormData = () => ({
  ability: { exact: false, values: [] },
  artist: { exact: false, value: '' },
  attack: { exact: false, value: '' },
  basetype: { values: {} },
  effect: { exact: false, values: [] },
  energy: { exact: false, values: {} },
  evolves: { exact: false, values: [] },
  flavortext: { exact: false, value: '' },
  hp: { operator: '=', value: '' },
  name: { exact: false, value: '' },
  rarity: { values: [] },
  retreat: { operator: '=', value: '' },
  sets: { values: [] },
  stage: { values: [] },
  subtype: { exact: false, values: [] },
  text: { exact: false, value: '' },
});
