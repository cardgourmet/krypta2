import {
  Accordion,
  Button,
  Checkbox,
  type CheckboxProps,
  Code,
  Grid,
  Group,
  MultiSelect,
  type MultiSelectProps,
  NumberInput,
  Select,
  type SelectProps,
  Stack,
  Text,
  TextInput,
  type TextInputProps,
} from '@mantine/core';
import { IconBrush, IconMeteorFilled, IconNumbers, IconTextSize, IconUserScan } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';
import Breadcrumbs from '@/parcels/generic/Breadcrumbs/Breadcrumbs.tsx';
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
import { type AdvancedFilter, DlcAdvancedFilters } from '@/routes/dlc/advanced/-dlcFilters.ts';
import { franchises, inks, rarities, setNames, typesAndClassifications } from '@/routes/dlc/advanced/-dlcValues.ts';
import styles from './index.module.css';

export const Route = createFileRoute('/dlc/advanced/')({
  component: RouteComponent,
});

function RouteComponent() {
  // const tcg = useTcgByLocation() as Tcg;

  const categories: Record<string, { icon?: ReactElement; filters: (keyof typeof DlcAdvancedFilters)[] }> = {
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

  return (
    <div className={styles.mainContent}>
      <Breadcrumbs subpage={'Erweiterte Suche'} />

      <div className={styles.advancedSearch}>
        <div className={styles.header}>
          <Group justify={'space-between'}>
            <Text fs={'italic'}>Benutze die Filter unten, um dir die Suche zusammenzubauen.</Text>
            <Button color={'var(--gourmet-blue-2)'}>Suche starten</Button>
          </Group>
        </div>

        <div className={styles.searchOptions}>
          <Stack gap={'xs'}>
            {Object.entries(categories).map(([key, value]) => {
              return (
                <Accordion
                  chevronPosition="right"
                  key={key}
                  defaultValue={key}
                  classNames={{
                    item: styles.accordionItem,
                    panel: styles.accordionPanel,
                    control: styles.accordionControl,
                  }}
                >
                  <Accordion.Item value={key}>
                    <Accordion.Control>
                      <Stack gap={'0.5rem'}>
                        <Group style={{ color: 'var(--gourmet-blue-1)' }}>
                          {value.icon}
                          <Text fz={'h4'} fw={'bold'} ff={'var(--cgm-title-font-family)'} c={'var(--gourmet-blue-1)'}>
                            {key.toUpperCase()}
                          </Text>
                        </Group>
                      </Stack>
                    </Accordion.Control>

                    <Accordion.Panel>
                      <Stack gap={'xl'}>
                        {value.filters
                          .map((v) => [v as string, DlcAdvancedFilters[v]] as const)
                          .map(([key, filter]) => {
                            return (
                              <Grid key={key} gutter={'xl'}>
                                <Grid.Col span={4}>
                                  <Stack gap={'0.25rem'}>
                                    <Group gap={'xs'}>
                                      <Text fz={'h5'} c={'var(--gourmet-neutral-8)'}>
                                        {filter.title}
                                      </Text>
                                      {filter.filter !== undefined && <Code>{filter.filter}</Code>}
                                    </Group>
                                    <Text fz={'h6'} c={'var(--gourmet-neutral-6)'}>
                                      {filter.description}
                                    </Text>
                                  </Stack>
                                </Grid.Col>
                                <Grid.Col span={8}>
                                  <div style={{ maxWidth: '75%' }}>{generateDlcFilterComponents(key, filter)}</div>
                                </Grid.Col>
                              </Grid>
                            );
                          })}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              );
            })}
          </Stack>
        </div>
      </div>
    </div>
  );
}

function generateDlcFilterComponents(key: string, filter: AdvancedFilter): ReactElement {
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

function FilterComponentText(props: TextInputProps) {
  return (
    <TextInput
      classNames={{
        root: styles.textInputRoot,
        input: styles.textInputInput,
      }}
      {...props}
    />
  );
}

function FilterComponentCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      classNames={{
        root: styles.checkboxRoot,
        input: styles.checkboxInput,
        label: styles.checkboxLabel,
      }}
      {...props}
    />
  );
}

function FilterComponentMultiDropdown(props: MultiSelectProps) {
  return (
    <MultiSelect
      classNames={{
        root: styles.multiSelectRoot,
        input: styles.multiSelectInput,
        pill: styles.multiSelectPill,
        option: styles.multiSelectOption,
      }}
      {...props}
    />
  );
}

function FilterComponentDropdown(props: SelectProps) {
  return (
    <Select
      classNames={{
        root: styles.selectRoot,
        input: styles.selectInput,
        option: styles.selectOption,
      }}
      {...props}
    />
  );
}

function FilterComponentNumberCompare() {
  return (
    <Stack>
      <Group>
        <FilterComponentDropdown
          data={['gleich', 'kleiner als', 'kleiner oder gleich', 'größer als', 'größer oder gleich']}
          defaultValue={'gleich'}
          allowDeselect={false}
          withCheckIcon={false}
          style={{ width: '12rem' }}
        />
        <NumberInput classNames={{ input: styles.numberInputInput }} allowNegative={false} />
      </Group>
    </Stack>
  );
}

function capitalizeFirstLetter(str: string): string {
  if (str.includes('_')) {
    const spl = str.split('_');
    return spl.map((s) => capitalizeFirstLetter(s)).join(' ');
  }

  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
