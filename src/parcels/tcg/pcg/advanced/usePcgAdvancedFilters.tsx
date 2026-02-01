import {
  IconBrush,
  IconMeteorFilled,
  IconNumbers,
  IconSparkles,
  IconTextSize,
  IconUserScan,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import type { AdvancedFilterCategory } from '@/parcels/search/advanced/types.ts';
import { constructPcgQuery } from '@/parcels/tcg/pcg/advanced/constructPcgQuery.ts';
import type { TcgFilterOperator } from '@/parcels/tcg/types.ts';

export function usePcgAdvancedFilters() {
  const [formData, setFormData] = useState<PcgAdvancedFilterFormData>(createDefaultFormData());
  const constructedQueryFilters = useMemo(() => {
    return constructPcgQuery(formData);
  }, [formData]);
  const resetFilters = () => {
    setFormData(createDefaultFormData());
  };

  const filtersByCategory = useMemo<Record<string, AdvancedFilterCategory>>(
    () => ({
      identity: {
        icon: <IconUserScan />,
        filters: [
          {
            key: 'basetype',
            title: '',
            description: '',
            filter: 'basetype',
            component: <div></div>,
          },
          {
            key: 'energy',
            title: '',
            description: '',
            filter: 'energy',
            component: <div></div>,
          },
          {
            key: 'subtype',
            title: '',
            description: '',
            filter: 'subtype',
            component: <div></div>,
          },
          {
            key: 'stage',
            title: '',
            description: '',
            filter: 'stage',
            component: <div></div>,
          },
          {
            key: 'evolves',
            title: '',
            description: '',
            filter: 'evolves',
            component: <div></div>,
          },
        ],
      },
      text: {
        icon: <IconTextSize />,
        filters: [
          {
            key: 'name',
            title: '',
            description: '',
            filter: 'name',
            component: <div></div>,
          },
          {
            key: 'text',
            title: '',
            description: '',
            filter: 'text',
            component: <div></div>,
          },
          {
            key: 'flavortext',
            title: '',
            description: '',
            filter: 'flavortext',
            component: <div></div>,
          },
        ],
      },
      effect: {
        icon: <IconSparkles />,
        filters: [
          {
            key: 'ability',
            title: '',
            description: '',
            filter: 'ability',
            component: <div></div>,
          },
          {
            key: 'attack',
            title: '',
            description: '',
            filter: 'attack',
            component: <div></div>,
          },
          {
            key: 'effect',
            title: '',
            description: '',
            filter: 'effect',
            component: <div></div>,
          },
        ],
      },
      stats: {
        icon: <IconNumbers />,
        filters: [
          {
            key: 'hp',
            title: '',
            description: '',
            filter: 'hp',
            component: <div></div>,
          },
          {
            key: 'retreat',
            title: '',
            description: '',
            filter: 'retreat',
            component: <div></div>,
          },
        ],
      },
      release: {
        icon: <IconMeteorFilled />,
        filters: [
          {
            key: 'set',
            title: '',
            description: '',
            filter: 'set',
            component: <div></div>,
          },
          {
            key: 'rarity',
            title: '',
            description: '',
            filter: 'rarity',
            component: <div></div>,
          },
        ],
      },
      artwork: {
        icon: <IconBrush />,
        filters: [
          {
            key: 'artist',
            title: '',
            description: '',
            filter: 'artist',
            component: <div></div>,
          },
        ],
      },
    }),
    [],
  );

  return { filters: filtersByCategory, constructedQueryFilters, resetFilters };
}

export type PcgAdvancedFilterFormData = {
  /* IDENTITY */
  basetype: {
    values: string[];
    exact: boolean;
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
    value: string;
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
    values: Record<string, boolean>;
  };

  /* ARTWORK */
  artist: {
    value: string;
    exact: boolean;
  };
};

const createDefaultFormData: () => PcgAdvancedFilterFormData = () => ({
  ability: { exact: false, values: [] },
  artist: { exact: false, value: '' },
  attack: { exact: false, value: '' },
  basetype: { exact: false, values: [] },
  effect: { exact: false, values: [] },
  energy: { exact: false, values: {} },
  evolves: { exact: false, value: '' },
  flavortext: { exact: false, value: '' },
  hp: { operator: '=', value: '' },
  name: { exact: false, value: '' },
  rarity: { values: {} },
  retreat: { operator: '=', value: '' },
  sets: { values: [] },
  stage: { values: [] },
  subtype: { exact: false, values: [] },
  text: { exact: false, value: '' },
});
