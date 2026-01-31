import { Accordion, Button, Code, Grid, Group, Stack, Text } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import Breadcrumbs from '@/parcels/generic/Breadcrumbs/Breadcrumbs.tsx';
import {
  dlcAdvancedCategories,
  useGenerateDlcFilterComponents,
} from '@/routes/dlc/advanced/-dlcAdvancedCategories.tsx';
import styles from './index.module.css';

export const Route = createFileRoute('/dlc/advanced/')({
  component: RouteComponent,
});

function RouteComponent() {
  // const tcg = useTcgByLocation() as Tcg;

  const generateDlcComponent = useGenerateDlcFilterComponents();

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
            {Object.entries(dlcAdvancedCategories).map(([key, category]) => {
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
                          {category.icon}
                          <Text fz={'h4'} fw={'bold'} ff={'var(--cgm-title-font-family)'} c={'var(--gourmet-blue-1)'}>
                            {key.toUpperCase()}
                          </Text>
                        </Group>
                      </Stack>
                    </Accordion.Control>

                    <Accordion.Panel>
                      <Stack gap={'xl'}>
                        {category.filters.map((filter) => {
                          return (
                            <Grid key={filter.key} gutter={'xl'}>
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
                                <div style={{ maxWidth: '75%' }}>{generateDlcComponent(filter)}</div>
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
