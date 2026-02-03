export type DlcAdvancedFilterFormData = {
  name: {
    value: string;
    exact: boolean;
  };
  text: {
    value: string;
    exact: boolean;
  };
  type: {
    values: string[];
    exact: boolean;
  };
  ink: {
    values: Record<string, boolean>;
    mode: 'contains' | 'exact';
  };
  strength: {
    value: number | string;
    operator: '>=' | '>' | '<' | '<=' | '=';
  };
  willpower: {
    value: number | string;
    operator: '>=' | '>' | '<' | '<=' | '=';
  };
  movecost: {
    value: number | string;
    operator: '>=' | '>' | '<' | '<=' | '=';
  };
  lore: {
    value: number | string;
    operator: '>=' | '>' | '<' | '<=' | '=';
  };
  sets: {
    values: string[];
  };
  rarity: {
    values: Record<string, boolean>;
  };
  artist: {
    value: string;
    exact: boolean;
  };
  franchise: {
    values: string[];
  };
  flavortext: {
    value: string;
    exact: boolean;
  };
};

export const createDefaultDlcFormData: () => DlcAdvancedFilterFormData = () => ({
  artist: { exact: false, value: '' },
  flavortext: { exact: false, value: '' },
  franchise: { values: [] },
  ink: { mode: 'contains', values: {} },
  lore: { operator: '=', value: '' },
  movecost: { operator: '=', value: '' },
  name: { exact: false, value: '' },
  rarity: { values: {} },
  sets: { values: [] },
  strength: { operator: '=', value: '' },
  text: { exact: false, value: '' },
  type: { exact: false, values: [] },
  willpower: { operator: '=', value: '' },
});
