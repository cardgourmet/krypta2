import {
  ActionIcon,
  Button,
  Code,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';
import Breadcrumbs from '@/parcels/generic/Breadcrumbs/Breadcrumbs.tsx';
import { franchises, inks, rarities, setNames, typesAndClassifications } from '@/routes/dlc/advanced/dlcValues.ts';
import styles from './index.module.css';

export const Route = createFileRoute('/dlc/advanced/')({
  component: RouteComponent,
});

type InputFilterMeta = {
  inputPlaceholder: string;
};
type AdvancedFilter = {
  key?: string;
  title: string;
  description?: string;
  filter?: string | string[];
  meta?: InputFilterMeta | undefined;
};

function RouteComponent() {
  // const tcg = useTcgByLocation() as Tcg;

  /*

  CGM/DLC
    Card Name
    Text
    Type Line
    Inks
    Stats (Power, etc.)
    Sets
    Rarity
    Artist
    Flavor Text

  */

  const DlcAdvancedFilters: Record<string, AdvancedFilter> = {
    name: {
      title: 'Kartenname',
      description: 'Wähle irgendein Wort, das im Namen der Karte vorkommt',
      filter: 'name',
      meta: {
        inputPlaceholder: `Irgendein Wort im Namen, z.B. "Micky"`,
      },
    },
    text: {
      title: 'Text',
      description: '',
      filter: 'text',
    },
    type: {
      title: 'Typ und Klassifikation',
      description: '',
      filter: 'type',
    },
    ink: {
      title: 'Tinte',
      description: '',
      filter: 'ink',
    },
    stats: {
      title: 'Statuswerte',
      description: '',
      filter: ['strength', 'willpower', 'movecost', 'lore'],
    },
    sets: {
      title: 'Sets',
      description: '',
      filter: 'set',
    },
    rarity: {
      title: 'Seltenheit',
      description: '',
      filter: 'rarity',
    },
    artist: {
      title: 'Künstler:in',
      description: '',
      filter: 'artist',
    },
    franchise: {
      title: 'Franchise',
      description: '',
      filter: 'franchise',
    },
    flavortext: {
      title: 'Flavortext',
      description: '',
      filter: 'flavor',
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
          {Object.entries(DlcAdvancedFilters).map(([key, filter]) => {
            return (
              <Stack gap={'sm'} key={key}>
                <Stack gap={'0.1rem'}>
                  <Group>
                    <Text fz={'h4'} fw={'bold'} c={'var(--gourmet-neutral-8)'}>
                      {filter.title}
                    </Text>
                    {filter.filter !== undefined && typeof filter.filter === 'string' && <Code>{filter.filter}</Code>}
                  </Group>
                  <Text fz={'h5'} c={'var(--gourmet-neutral-6)'}>
                    {filter.description}
                  </Text>
                </Stack>

                <div style={{ maxWidth: '75%' }}>{generateDlcFilterComponents(key, filter)}</div>

                <Divider my={'xl'} />
              </Stack>
            );
          })}
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
    case 'stats': {
      return <FilterComponentMultiNumberCompare />;
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

function FilterComponentMultiNumberCompare() {
  return (
    <Stack>
      <Group>
        <Select />
        <Select />
        <NumberInput />
      </Group>
      <ActionIcon color="gray">
        <IconPlus />
      </ActionIcon>
    </Stack>
  );
}
