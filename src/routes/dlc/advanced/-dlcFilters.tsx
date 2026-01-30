import { Group, Stack, Text } from '@mantine/core';
import { IconBrush, IconMeteorFilled, IconNumbers, IconTextSize, IconUserScan } from '@tabler/icons-react';
import type { ReactElement } from 'react';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentDropdown } from '@/parcels/search/advanced/FilterComponentDropdown.tsx';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import { FilterComponentNumberCompare } from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';
import { FilterComponentText } from '@/parcels/search/advanced/FilterComponentText.tsx';
import { DlcInkAmber } from '@/parcels/tcg/dlc/icons/DlcInkAmber.tsx';
import { DlcInkAmethyst } from '@/parcels/tcg/dlc/icons/DlcInkAmethyst.tsx';
import { DlcInkEmerald } from '@/parcels/tcg/dlc/icons/DlcInkEmerald.tsx';
import { DlcInkRuby } from '@/parcels/tcg/dlc/icons/DlcInkRuby.tsx';
import { DlcInkSapphire } from '@/parcels/tcg/dlc/icons/DlcInkSapphire.tsx';
import { DlcInkSteel } from '@/parcels/tcg/dlc/icons/DlcInkSteel.tsx';
import { DlcRarityCommon } from '@/parcels/tcg/dlc/icons/DlcRarityCommon.tsx';
import { DlcRarityEnchanted } from '@/parcels/tcg/dlc/icons/DlcRarityEnchanted.tsx';
import { DlcRarityLegendary } from '@/parcels/tcg/dlc/icons/DlcRarityLegendary.tsx';
import { DlcRarityRare } from '@/parcels/tcg/dlc/icons/DlcRarityRare.tsx';
import { DlcRaritySuperRare } from '@/parcels/tcg/dlc/icons/DlcRaritySuperRare.tsx';
import { DlcRarityUncommon } from '@/parcels/tcg/dlc/icons/DlcRarityUncommon.tsx';
import { franchises, inks, rarities, setNames, typesAndClassifications } from '@/parcels/tcg/dlc/raw/apiValues.ts';

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

export const categories: Record<string, { icon?: ReactElement; filters: (keyof typeof DlcAdvancedFilters)[] }> = {
  identity: {
    icon: <IconUserScan />,
    filters: ['type', 'ink'],
  },
  text: {
    icon: <IconTextSize />,
    filters: ['name', 'text', 'flavortext'],
  },
  stats: {
    icon: <IconNumbers />,
    filters: ['strength', 'willpower', 'movecost', 'lore'],
  },
  release: {
    icon: <IconMeteorFilled />,
    filters: ['sets', 'rarity'],
  },
  artwork: {
    icon: <IconBrush />,
    filters: ['artist', 'franchise'],
  },
};

export function generateDlcFilterComponents(key: string, filter: AdvancedFilter): ReactElement {
  if (filter.key === undefined) {
    filter.key = key;
  }

  switch (filter.key) {
    case 'name': {
      return (
        <Stack>
          <FilterComponentText placeholder={`Irgendein Wort wie "Fire"`} />
          <FilterComponentCheckbox label={'Genaue Übereinstimmung'} />
        </Stack>
      );
    }
    case 'text': {
      return (
        <Stack>
          <FilterComponentText placeholder={`Irgendeine Wortfolge wie "Draw a card"`} />
          <FilterComponentCheckbox label={'Genaue Übereinstimmung'} />
        </Stack>
      );
    }
    case 'type': {
      const types = typesAndClassifications.data.values.filter((d) => d.type === 'type').map((d) => d.value);
      const classifications = typesAndClassifications.data.values
        .filter((d) => d.type === 'classification')
        .map((d) => d.value);

      return (
        <FilterComponentMultiDropdown
          data={[
            { group: 'Types', items: types },
            { group: 'Classifications', items: classifications },
          ]}
          placeholder={'Gib einen Typ ein oder wähle einen'}
          searchable
        />
      );
    }
    case 'ink': {
      const iconSize = 32;
      return (
        <Stack>
          <Group>
            {inks.data.values
              .filter((d) => d.value !== 'none')
              .map((d) => {
                return (
                  <Group gap={'0.25rem'} key={d.value}>
                    <FilterComponentCheckbox />
                    <Group gap={'0.1rem'}>
                      {d.value === 'amber' && <DlcInkAmber size={iconSize} color={'#f0b11d'} />}
                      {d.value === 'amethyst' && <DlcInkAmethyst size={iconSize} color={'#80397b'} />}
                      {d.value === 'emerald' && <DlcInkEmerald size={iconSize} color={'#2b8a42'} />}
                      {d.value === 'ruby' && <DlcInkRuby size={iconSize} color={'#d02031'} />}
                      {d.value === 'sapphire' && <DlcInkSapphire size={iconSize} color={'#0b87c1'} />}
                      {d.value === 'steel' && <DlcInkSteel size={iconSize} color={'#9da7b1'} />}
                      <Text fs={'1rem'}>{capitalizeFirstLetter(d.value)}</Text>
                    </Group>
                  </Group>
                );
              })}
          </Group>
          <FilterComponentDropdown
            withCheckIcon={false}
            allowDeselect={false}
            defaultValue={'Enthält eine dieser Tinten'}
            data={['Genau diese Tinten', 'Enthält eine dieser Tinten']}
          />
        </Stack>
      );
    }
    case 'strength': {
      return <FilterComponentNumberCompare />;
    }
    case 'willpower': {
      return <FilterComponentNumberCompare />;
    }
    case 'movecost': {
      return <FilterComponentNumberCompare />;
    }
    case 'lore': {
      return <FilterComponentNumberCompare />;
    }
    case 'sets': {
      return (
        <FilterComponentMultiDropdown
          data={setNames.data.values.map((d) => d.value)}
          searchable
          placeholder={`Gib einen Setnamen ein oder wähle eins`}
        />
      );
    }
    case 'rarity': {
      const iconSize = 20;
      return (
        <Stack>
          <Group>
            {rarities.data.values.map((d) => {
              return (
                <Group gap={'0.5rem'} key={d.value}>
                  <FilterComponentCheckbox />
                  <Group gap={'0.2rem'}>
                    {d.value === 'common' && <DlcRarityCommon size={iconSize} />}
                    {d.value === 'uncommon' && <DlcRarityUncommon size={iconSize} />}
                    {d.value === 'rare' && <DlcRarityRare size={iconSize} />}
                    {d.value === 'super_rare' && <DlcRaritySuperRare size={iconSize} />}
                    {d.value === 'legendary' && <DlcRarityLegendary size={iconSize} />}
                    {d.value === 'enchanted' && <DlcRarityEnchanted size={iconSize} />}
                    <Text fs={'1rem'}>{capitalizeFirstLetter(d.value)}</Text>
                  </Group>
                </Group>
              );
            })}
          </Group>
        </Stack>
      );
    }
    case 'artist': {
      return (
        <Stack>
          <FilterComponentText placeholder={`Irgendein Teil eines Namens wie "Magali"`} />
          <FilterComponentCheckbox label={'Genaue Übereinstimmung'} />
        </Stack>
      );
    }
    case 'franchise': {
      const franchiseNames = franchises.data.values.filter((d) => d.type === 'name').map((d) => d.value);
      const franchiseSlugs = franchises.data.values.filter((d) => d.type === 'slug').map((d) => d.value);

      return (
        <FilterComponentMultiDropdown
          data={[
            { group: 'Names', items: franchiseNames },
            { group: 'Slugs', items: franchiseSlugs },
          ]}
          searchable
          placeholder={`Gib ein Franchise ein oder wähle eins`}
        />
      );
    }
    case 'flavortext': {
      return (
        <Stack>
          <FilterComponentText placeholder={`Irgendeine Wortfolge wie "Why did Urza"`} />
          <FilterComponentCheckbox label={'Genaue Übereinstimmung'} />
        </Stack>
      );
    }
  }
  return <div></div>;
}
