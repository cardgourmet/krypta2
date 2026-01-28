import { Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import Breadcrumbs from '@/parcels/generic/Breadcrumbs/Breadcrumbs.tsx';
import styles from './index.module.css';

export const Route = createFileRoute('/dlc/advanced/')({
  component: RouteComponent,
});

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

  type InputFilterMeta = {
    inputPlaceholder: string;
  };

  type AdvancedFilter = {
    title: string;
    description: string;
    type: 'text' | 'toggle';
    meta?: InputFilterMeta | undefined;
  };

  const DlcAdvancedFilters: Record<string, AdvancedFilter> = {
    name: {
      title: 'Kartenname',
      description: 'Wähle irgendein Wort, das im Namen der Karte vorkommt',
      type: 'text',
      meta: {
        inputPlaceholder: `Irgendein Wort im Namen, z.B. "Micky"`,
      },
    },
    text: {
      title: 'Text',
      description: '',
      type: 'text',
    },
    type: {
      title: 'Typ und Klassifikation',
      description: '',
      type: 'text',
    },
    ink: {
      title: 'Tinte',
      description: '',
      type: 'text',
    },
    stats: {
      title: 'Statuswerte',
      description: '',
      type: 'text',
    },
    sets: {
      title: 'Sets',
      description: '',
      type: 'text',
    },
    rarity: {
      title: 'Seltenheit',
      description: '',
      type: 'text',
    },
    artist: {
      title: 'Künstler:in',
      description: '',
      type: 'text',
    },
    flavortext: {
      title: 'Flavortext',
      description: '',
      type: 'text',
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
                  <Text fz={'h4'} fw={'bold'} c={'var(--gourmet-neutral-8)'}>
                    {filter.title}
                  </Text>
                  <Text fz={'h5'} c={'var(--gourmet-neutral-6)'}>
                    {filter.description}
                  </Text>
                </Stack>

                {filter.type === 'text' && (
                  <TextInput w={'50%'} placeholder={(filter.meta as InputFilterMeta)?.inputPlaceholder ?? ''} />
                )}

                <Divider my={'xl'} />
              </Stack>
            );
          })}
        </div>
      </div>
    </div>
  );
}
