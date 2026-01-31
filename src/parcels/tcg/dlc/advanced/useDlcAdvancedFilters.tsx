import { IconBrush, IconMeteorFilled, IconNumbers, IconTextSize, IconUserScan } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import type { AdvancedFilterCategory } from '@/parcels/search/advanced/types.ts';
import { constructDlcQuery } from '@/parcels/tcg/dlc/advanced/constructDlcQuery.ts';
import { DlcArtistFilter } from '@/parcels/tcg/dlc/advanced/DlcArtistFilter.tsx';
import { DlcFlavortextFilter } from '@/parcels/tcg/dlc/advanced/DlcFlavortextFilter.tsx';
import { DlcFranchiseFilter } from '@/parcels/tcg/dlc/advanced/DlcFranchiseFilter.tsx';
import { DlcInkFilter } from '@/parcels/tcg/dlc/advanced/DlcInkFilter.tsx';
import { DlcLoreFilter } from '@/parcels/tcg/dlc/advanced/DlcLoreFilter.tsx';
import { DlcMovecostFilter } from '@/parcels/tcg/dlc/advanced/DlcMovecostFilter.tsx';
import { DlcNameFilter } from '@/parcels/tcg/dlc/advanced/DlcNameFilter.tsx';
import { DlcRarityFilter } from '@/parcels/tcg/dlc/advanced/DlcRarityFilter.tsx';
import { DlcSetsFilter } from '@/parcels/tcg/dlc/advanced/DlcSetsFilter.tsx';
import { DlcStrengthFilter } from '@/parcels/tcg/dlc/advanced/DlcStrengthFilter.tsx';
import { DlcTextFilter } from '@/parcels/tcg/dlc/advanced/DlcTextFilter.tsx';
import { DlcTypeFilter } from '@/parcels/tcg/dlc/advanced/DlcTypeFilter.tsx';
import { DlcWillpowerFilter } from '@/parcels/tcg/dlc/advanced/DlcWillpowerFilter.tsx';

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
    exact: boolean;
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

const createDefaultFormData: () => DlcAdvancedFilterFormData = () => ({
  artist: { exact: false, value: '' },
  flavortext: { exact: false, value: '' },
  franchise: { values: [] },
  ink: { exact: false, values: {} },
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

export function useDlcAdvancedFilters() {
  const [formData, setFormData] = useState<DlcAdvancedFilterFormData>(createDefaultFormData());
  const constructedQueryFilters = useMemo(() => {
    console.log(`re-memoize constructed query: ${JSON.stringify(formData)}`);

    return constructDlcQuery(formData);
  }, [formData]);
  const resetFilters = () => {
    setFormData(createDefaultFormData());
  };

  const filtersByCategory = useMemo<Record<string, AdvancedFilterCategory>>(() => {
    return {
      identity: {
        icon: <IconUserScan />,
        filters: [
          {
            key: 'type',
            title: 'Typ und Klassifikation',
            description: 'Begriff, der in der Typzeile der Karte steht',
            filter: 'type',
            component: <DlcTypeFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'ink',
            title: 'Tinte',
            description: 'Sorte der Tinte, gekennzeichnet durch Farbe und Symbol auf der Karte',
            filter: 'ink',
            component: <DlcInkFilter formData={formData} setFormData={setFormData} />,
          },
        ],
      },
      text: {
        icon: <IconTextSize />,
        filters: [
          {
            key: 'name',
            title: 'Kartenname',
            description: 'Irgendein Wort, das im Namen der Karte vorkommt',
            filter: 'name',
            component: <DlcNameFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'text',
            title: 'Text',
            description: 'Irgendeine Wortfolge, die im Text der Karte vorkommt',
            filter: 'text',
            component: <DlcTextFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'flavortext',
            title: 'Flavortext',
            description: 'Irgendein Wort, das im Flavortext der Karte vorkommt, falls einer existiert',
            filter: 'flavor',
            component: <DlcFlavortextFilter formData={formData} setFormData={setFormData} />,
          },
        ],
      },
      stats: {
        icon: <IconNumbers />,
        filters: [
          {
            key: 'strength',
            title: 'Stärke',
            description: 'Der Stärkewert beginnend von 0, nur für Charaktere',
            filter: 'strength',
            component: <DlcStrengthFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'willpower',
            title: 'Willenskraft',
            description: 'Der Verteidigungswert beginnend von 0, nur für Charaktere',
            filter: 'willpower',
            component: <DlcWillpowerFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'movecost',
            title: 'Bewegungskosten',
            description: 'Die Bewegungskosten beginnend von 0, nur für Orte',
            filter: 'movecost',
            component: <DlcMovecostFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'lore',
            title: 'Legendenwert',
            description: 'Der Legendenwert beginnend von 0, falls einer existiert',
            filter: 'lore',
            component: <DlcLoreFilter formData={formData} setFormData={setFormData} />,
          },
        ],
      },
      release: {
        icon: <IconMeteorFilled />,
        filters: [
          {
            key: 'sets',
            title: 'Sets',
            description: 'Sets, in der die Karte gedruckt wurde',
            filter: 'set',
            component: <DlcSetsFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'rarity',
            title: 'Seltenheit',
            description: 'Seltenheit, mit der die Karte in einem Set gedruckt wurde',
            filter: 'rarity',
            component: <DlcRarityFilter formData={formData} setFormData={setFormData} />,
          },
        ],
      },
      artwork: {
        icon: <IconBrush />,
        filters: [
          {
            key: 'artist',
            title: 'Künstler:in',
            description: 'Irgendein Wort, das im Namen der Künstler:in der Karte vorkommt',
            filter: 'artist',
            component: <DlcArtistFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'franchise',
            title: 'Franchise',
            description: 'Das Franchise, in das die Karte zugeordnet werden kann',
            filter: 'franchise',
            component: <DlcFranchiseFilter formData={formData} setFormData={setFormData} />,
          },
        ],
      },
    };
  }, [formData]);

  return { filters: filtersByCategory, constructedQueryFilters, resetFilters };
}
