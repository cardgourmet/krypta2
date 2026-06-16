export type MtgKitchenFormData = {
  type: {
    values: string[];
    exact: boolean;
  };
  color: {
    strictValues: Record<string, boolean>;
    mode: 'contains' | 'exact';
  };
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
  keyword: {
    values: string[];
    exact: boolean;
  };
  cmc: {
    value: number | string;
    operator: '>=' | '>' | '<' | '<=' | '=';
  };
  power: {
    value: number | string;
    operator: '>=' | '>' | '<' | '<=' | '=';
  };
  toughness: {
    value: number | string;
    operator: '>=' | '>' | '<' | '<=' | '=';
  };
  loyalty: {
    value: number | string;
    operator: '>=' | '>' | '<' | '<=' | '=';
  };
  defense: {
    value: number | string;
    operator: '>=' | '>' | '<' | '<=' | '=';
  };
  sets: {
    values: string[];
  };
  rarity: {
    values: string[];
  };
  format: {
    values: string[];
    exact: boolean;
  };
  games: {
    values: string[];
  };
  artist: {
    value: string;
    exact: boolean;
  };
};

export const createDefaultMtgFormData: () => MtgKitchenFormData = () => ({
  artist: { exact: false, value: '' },
  cmc: { operator: '=', value: '' },
  color: {
    mode: 'contains',
    strictValues: {
      colorless: false,
      black: false,
      blue: false,
      red: false,
      white: false,
      green: false,
    },
  },
  defense: { operator: '=', value: '' },
  flavortext: { exact: false, value: '' },
  format: { exact: false, values: [] },
  games: { values: [] },
  keyword: { exact: false, values: [] },
  loyalty: { operator: '=', value: '' },
  name: { exact: false, value: '' },
  power: { operator: '=', value: '' },
  rarity: { values: [] },
  sets: { values: [] },
  text: { exact: false, value: '' },
  toughness: { operator: '=', value: '' },
  type: { exact: false, values: [] },
});
