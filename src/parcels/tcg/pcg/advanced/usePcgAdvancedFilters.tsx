import {
  IconBrush,
  IconMeteorFilled,
  IconNumbers,
  IconSparkles,
  IconTextSize,
  IconUserScan,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { AdvancedMultiSelectFilter, AdvancedTextFilter } from '@/parcels/search/advanced/advancedFilters.tsx';
import type { AdvancedFilterCategory } from '@/parcels/search/advanced/types.ts';
import { constructPcgQuery } from '@/parcels/tcg/pcg/advanced/constructPcgQuery.ts';
import { PcgBasetypeFilter } from '@/parcels/tcg/pcg/advanced/PcgBasetypeFilter.tsx';
import { PcgEnergyFilter } from '@/parcels/tcg/pcg/advanced/PcgEnergyFilter.tsx';
import { PcgEvolvesFilter } from '@/parcels/tcg/pcg/advanced/PcgEvolvesFilter.tsx';
import { PcgStageFilter } from '@/parcels/tcg/pcg/advanced/PcgStageFilter.tsx';
import { subTypes } from '@/parcels/tcg/pcg/raw/apiValues.ts';
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
            title: 'Basistyp',
            description: 'Art der Karte',
            filter: 'basetype',
            component: <PcgBasetypeFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'energy',
            title: 'Energie',
            description: 'Sorte der Energie, gekennzeichnet durch ein Symbol auf der Karte',
            filter: 'energy',
            component: <PcgEnergyFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'subtype',
            title: 'Subtyp',
            description: 'Unterart des Basistypen für speziellere Karten',
            filter: 'subtype',
            component: (
              <AdvancedMultiSelectFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'subtype'}
                data={subTypes.data.values.map((d) => {
                  return { value: d.value, label: capitalizeFirstLetter(d.value) };
                })}
                dropdownPlaceholder={'Gib einen Subtypen ein oder wähle einen'}
              />
            ),
          },
          {
            key: 'stage',
            title: 'Entwicklungsstufe',
            description: 'Die Entwicklungsstufe der Karte',
            filter: 'stage',
            component: <PcgStageFilter formData={formData} setFormData={setFormData} />,
          },
          {
            key: 'evolves',
            title: 'Entwicklung',
            description: 'Name der Karte, aus der sich diese Karte entwickeln kann, falls vorhanden',
            filter: 'evolves',
            component: <PcgEvolvesFilter formData={formData} setFormData={setFormData} />,
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
            component: (
              <AdvancedTextFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'name'}
                withExactCheckbox
                dropdownPlaceholder={`Irgendein Wort wie "tuff"`}
                checkboxLabel={'Genaue Übereinstimmung'}
              />
            ),
          },
          {
            key: 'text',
            title: 'Text',
            description: 'Irgendeine Wortfolge, die im Text der Karte vorkommt',
            filter: 'text',
            component: (
              <AdvancedTextFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'text'}
                withExactCheckbox
                dropdownPlaceholder={`Irgendein Wort wie "Round"`}
                checkboxLabel={'Genaue Übereinstimmung'}
              />
            ),
          },
          {
            key: 'flavortext',
            title: 'Flavortext',
            description: 'Irgendein Wort, das im Flavortext der Karte vorkommt, falls einer existiert',
            filter: 'flavortext',
            component: (
              <AdvancedTextFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'flavortext'}
                withExactCheckbox
                dropdownPlaceholder={`Irgendein Wort wie "fine fur"`}
                checkboxLabel={'Genaue Übereinstimmung'}
              />
            ),
          },
        ],
      },
      effect: {
        icon: <IconSparkles />,
        filters: [
          {
            key: 'ability',
            title: 'Fähigkeit',
            description: '',
            filter: 'ability',
            component: <div></div>,
          },
          {
            key: 'attack',
            title: 'Angriff',
            description: '',
            filter: 'attack',
            component: <div></div>,
          },
          {
            key: 'effect',
            title: 'Effekt',
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
            title: 'Lebenspunkte',
            description: '',
            filter: 'hp',
            component: <div></div>,
          },
          {
            key: 'retreat',
            title: 'Rückzugskosten',
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
            title: 'Sets',
            description: 'Sets, in der die Karte gedruckt wurde',
            filter: 'set',
            component: <div></div>,
          },
          {
            key: 'rarity',
            title: 'Seltenheit',
            description: 'Seltenheit, mit der die Karte in einem Set gedruckt wurde',
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
            title: 'Künstler:in',
            description: 'Irgendein Wort, das im Namen der Künstler:in der Karte vorkommt',
            filter: 'artist',
            component: (
              <AdvancedTextFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'artist'}
                withExactCheckbox
                dropdownPlaceholder={`Irgendein Wort wie "Dunce"`}
                checkboxLabel={'Genaue Übereinstimmung'}
              />
            ),
          },
        ],
      },
    }),
    [formData],
  );

  return { filters: filtersByCategory, constructedQueryFilters, resetFilters };
}

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
  basetype: { values: {} },
  effect: { exact: false, values: [] },
  energy: { exact: false, values: {} },
  evolves: { exact: false, values: [] },
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
