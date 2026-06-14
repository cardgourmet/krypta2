export type DlcKitchenFormData = {
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
    strictValues: Record<string, boolean>;
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
    strictValues: Record<string, boolean>;
    mode: 'contains' | 'exact';
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

export const createDefaultDlcFormData: () => DlcKitchenFormData = () => ({
  artist: { exact: false, value: '' },
  flavortext: { exact: false, value: '' },
  franchise: { values: [] },
  ink: {
    mode: 'contains',
    strictValues: {
      amber: false,
      amethyst: false,
      emerald: false,
      ruby: false,
      sapphire: false,
      steel: false,
    },
  },
  lore: { operator: '=', value: '' },
  movecost: { operator: '=', value: '' },
  name: { exact: false, value: '' },
  rarity: {
    mode: 'exact',
    strictValues: {
      common: false,
      uncommon: false,
      rare: false,
      super_rare: false,
      legendary: false,
      enchanted: false,
    },
  },
  sets: { values: [] },
  strength: { operator: '=', value: '' },
  text: { exact: false, value: '' },
  type: { exact: false, values: [] },
  willpower: { operator: '=', value: '' },
});
