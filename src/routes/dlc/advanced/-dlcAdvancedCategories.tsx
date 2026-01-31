import { Group, Stack, Text } from '@mantine/core';
import { IconBrush, IconMeteorFilled, IconNumbers, IconTextSize, IconUserScan } from '@tabler/icons-react';
import { type ReactElement, useCallback, useState } from 'react';
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

export type AdvancedFilterCategory = {
  icon: ReactElement;
  filters: AdvancedFilter[];
};
export type AdvancedFilter = {
  key: string;
  title: string;
  description?: string;
  filter?: string | string[];
};

export const dlcAdvancedCategories: Record<string, AdvancedFilterCategory> = {
  identity: {
    icon: <IconUserScan />,
    filters: [
      {
        key: 'type',
        title: 'Typ und Klassifikation',
        description: 'Begriff, der in der Typzeile der Karte steht',
        filter: 'type',
      },
      {
        key: 'ink',
        title: 'Tinte',
        description: 'Sorte der Tinte, gekennzeichnet durch Farbe und Symbol auf der Karte',
        filter: 'ink',
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
      },
      {
        key: 'text',
        title: 'Text',
        description: 'Irgendeine Wortfolge, die im Text der Karte vorkommt',
        filter: 'text',
      },
      {
        key: 'flavortext',
        title: 'Flavortext',
        description: 'Irgendein Wort, das im Flavortext der Karte vorkommt, falls einer existiert',
        filter: 'flavor',
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
      },
      {
        key: 'willpower',
        title: 'Willenskraft',
        description: 'Der Verteidigungswert beginnend von 0, nur für Charaktere',
        filter: 'willpower',
      },
      {
        key: 'movecost',
        title: 'Bewegungskosten',
        description: 'Die Bewegungskosten beginnend von 0, nur für Orte',
        filter: 'movecost',
      },
      {
        key: 'lore',
        title: 'Legendenwert',
        description: 'Der Legendenwert beginnend von 0, falls einer existiert',
        filter: 'lore',
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
      },
      {
        key: 'rarity',
        title: 'Seltenheit',
        description: 'Seltenheit, mit der die Karte in einem Set gedruckt wurde',
        filter: 'rarity',
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
      },
      {
        key: 'franchise',
        title: 'Franchise',
        description: 'Das Franchise, in das die Karte zugeordnet werden kann',
        filter: 'franchise',
      },
    ],
  },
};

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

export function useGenerateDlcFilterComponents(): (filter: AdvancedFilter) => ReactElement {
  const [formData, setFormData] = useState<DlcAdvancedFilterFormData>({
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
    type: { values: [] },
    willpower: { operator: '=', value: '' },
  });
  console.log(JSON.stringify(formData));

  // TODO: button to reset form data (contains number of changes)

  const getComponentByFilter = (filter: AdvancedFilter) => {
    switch (filter.key) {
      case 'name': {
        return (
          <Stack>
            <FilterComponentText
              placeholder={`Irgendein Wort wie "Fire"`}
              value={formData.name.value}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setFormData((prev) => ({
                  ...prev,
                  name: { ...prev.name, value: value },
                }));
              }}
            />
            <FilterComponentCheckbox
              label={'Genaue Übereinstimmung'}
              checked={formData.name.exact}
              onChange={(event) => {
                const value = event.currentTarget.checked;
                setFormData((prev) => ({
                  ...prev,
                  name: { ...prev.name, exact: value },
                }));
              }}
            />
          </Stack>
        );
      }
      case 'text': {
        return (
          <Stack>
            <FilterComponentText
              placeholder={`Irgendeine Wortfolge wie "Draw a card"`}
              value={formData.text.value}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setFormData((prev) => ({
                  ...prev,
                  text: { ...prev.text, value: value },
                }));
              }}
            />
            <FilterComponentCheckbox
              label={'Genaue Übereinstimmung'}
              checked={formData.text.exact}
              onChange={(event) => {
                const value = event.currentTarget.checked;
                setFormData((prev) => ({
                  ...prev,
                  text: { ...prev.text, exact: value },
                }));
              }}
            />
          </Stack>
        );
      }
      case 'type': {
        const types = typesAndClassifications.data.values
          .filter((d) => d.type === 'type')
          .map((d) => {
            return { value: d.value, label: capitalizeFirstLetter(d.value) };
          });
        const classifications = typesAndClassifications.data.values
          .filter((d) => d.type === 'classification')
          .map((d) => {
            return { value: d.value, label: capitalizeFirstLetter(d.value) };
          });

        return (
          <FilterComponentMultiDropdown
            data={[
              { group: 'Types', items: types },
              { group: 'Classifications', items: classifications },
            ]}
            placeholder={'Gib einen Typ ein oder wähle einen'}
            searchable
            value={formData.type.values}
            onChange={(values) => {
              setFormData((prev) => ({
                ...prev,
                type: { ...prev.type, values },
              }));
            }}
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
                      <FilterComponentCheckbox
                        checked={formData.ink.values[d.value] ?? false}
                        onChange={(event) => {
                          const value = event.currentTarget.checked;

                          setFormData((prev) => {
                            const values = prev.ink.values;
                            values[d.value] = value;
                            return {
                              ...prev,
                              ink: { ...prev.ink, values },
                            };
                          });
                        }}
                      />
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
              defaultValue={'contains'}
              data={[
                { value: 'exact', label: 'Genau diese Tinten' },
                { value: 'contains', label: 'Enthält eine dieser Tinten' },
              ]}
              value={formData.ink.exact ? 'exact' : 'contains'}
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  ink: { ...prev.ink, exact: value === 'exact' },
                }));
              }}
            />
          </Stack>
        );
      }
      case 'strength': {
        return (
          <FilterComponentNumberCompare
            operator={formData.strength.operator}
            onOperatorChange={(operator) => {
              setFormData((prev) => ({
                ...prev,
                strength: { ...prev.strength, operator },
              }));
            }}
            value={formData.strength.value}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                strength: { ...prev.strength, value },
              }));
            }}
          />
        );
      }
      case 'willpower': {
        return (
          <FilterComponentNumberCompare
            operator={formData.willpower.operator}
            onOperatorChange={(operator) => {
              setFormData((prev) => ({
                ...prev,
                willpower: { ...prev.willpower, operator },
              }));
            }}
            value={formData.willpower.value}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                willpower: { ...prev.willpower, value },
              }));
            }}
          />
        );
      }
      case 'movecost': {
        return (
          <FilterComponentNumberCompare
            operator={formData.movecost.operator}
            onOperatorChange={(operator) => {
              setFormData((prev) => ({
                ...prev,
                movecost: { ...prev.movecost, operator },
              }));
            }}
            value={formData.movecost.value}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                movecost: { ...prev.movecost, value },
              }));
            }}
          />
        );
      }
      case 'lore': {
        return (
          <FilterComponentNumberCompare
            operator={formData.lore.operator}
            onOperatorChange={(operator) => {
              setFormData((prev) => ({
                ...prev,
                lore: { ...prev.lore, operator },
              }));
            }}
            value={formData.lore.value}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                lore: { ...prev.lore, value },
              }));
            }}
          />
        );
      }
      case 'sets': {
        return (
          <FilterComponentMultiDropdown
            data={setNames.data.values.map((d) => d.value)}
            searchable
            placeholder={`Gib einen Setnamen ein oder wähle eins`}
            value={formData.sets.values}
            onChange={(values) => {
              setFormData((prev) => ({
                ...prev,
                sets: { ...prev.sets, values },
              }));
            }}
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
                    <FilterComponentCheckbox
                      checked={formData.rarity.values[d.value] ?? false}
                      onChange={(event) => {
                        const value = event.currentTarget.checked;

                        setFormData((prev) => {
                          const values = prev.rarity.values;
                          values[d.value] = value;
                          return {
                            ...prev,
                            rarity: { ...prev.rarity, values },
                          };
                        });
                      }}
                    />
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
            <FilterComponentText
              placeholder={`Irgendein Teil eines Namens wie "Magali"`}
              value={formData.artist.value}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setFormData((prev) => ({
                  ...prev,
                  artist: { ...prev.artist, value: value },
                }));
              }}
            />
            <FilterComponentCheckbox
              label={'Genaue Übereinstimmung'}
              checked={formData.artist.exact}
              onChange={(event) => {
                const value = event.currentTarget.checked;
                setFormData((prev) => ({
                  ...prev,
                  artist: { ...prev.artist, exact: value },
                }));
              }}
            />
          </Stack>
        );
      }
      case 'franchise': {
        const franchiseNames = franchises.data.values
          .filter((d) => d.type === 'name')
          .map((d) => {
            return { value: d.value, label: capitalizeFirstLetter(d.value) };
          });

        return (
          <FilterComponentMultiDropdown
            data={franchiseNames}
            searchable
            placeholder={`Gib ein Franchise ein oder wähle eins`}
            value={formData.franchise.values}
            onChange={(values) => {
              setFormData((prev) => ({
                ...prev,
                franchise: { ...prev.franchise, values },
              }));
            }}
          />
        );
      }
      case 'flavortext': {
        return (
          <Stack>
            <FilterComponentText
              placeholder={`Irgendeine Wortfolge wie "Why did Urza"`}
              value={formData.flavortext.value}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setFormData((prev) => ({
                  ...prev,
                  flavortext: { ...prev.flavortext, value: value },
                }));
              }}
            />
            <FilterComponentCheckbox
              label={'Genaue Übereinstimmung'}
              checked={formData.flavortext.exact}
              onChange={(event) => {
                const value = event.currentTarget.checked;
                setFormData((prev) => ({
                  ...prev,
                  flavortext: { ...prev.flavortext, exact: value },
                }));
              }}
            />
          </Stack>
        );
      }
    }
    throw `No component found for ${filter.key}`;
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  return useCallback(getComponentByFilter, [formData]);
}
