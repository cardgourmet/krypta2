import {
  Accordion,
  Button,
  Code,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconBrush, IconMeteorFilled, IconNumbers, IconTextSize, IconUserScan } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';
import Breadcrumbs from '@/parcels/generic/Breadcrumbs/Breadcrumbs.tsx';
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
    release: {
      icon: <IconMeteorFilled />,
      filters: ['sets', 'rarity'],
    },
    stats: {
      icon: <IconNumbers />,
      filters: ['strength', 'willpower', 'movecost', 'lore'],
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
      return <FilterComponentText />;
    }
    case 'text': {
      return <FilterComponentText />;
    }
    case 'type': {
      return <FilterComponentDropdown data={typesAndClassifications.data.values.map((d) => d.value)} />;
    }
    case 'ink': {
      return <FilterComponentList data={inks.data.values.map((d) => d.value)} />;
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
      return <FilterComponentDropdown data={setNames.data.values.map((d) => d.value)} />;
    }
    case 'rarity': {
      return <FilterComponentList data={rarities.data.values.map((d) => d.value)} />;
    }
    case 'artist': {
      return <FilterComponentText />;
    }
    case 'franchise': {
      return <FilterComponentDropdown data={franchises.data.values.map((d) => d.value)} />;
    }
    case 'flavortext': {
      return <FilterComponentText />;
    }
  }
  return <div></div>;
}

function FilterComponentText() {
  return <TextInput />;
}

function FilterComponentDropdown({ data }: { data: string[] }) {
  return <MultiSelect data={data} searchable />;
}

function FilterComponentList({ data }: { data: string[] }) {
  return <MultiSelect data={data} />;
}

function FilterComponentNumberCompare() {
  return (
    <Stack>
      <Group>
        <Select />
        <NumberInput />
      </Group>
    </Stack>
  );
}
