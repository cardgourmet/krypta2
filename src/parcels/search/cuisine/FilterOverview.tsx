import { Accordion, Button, Code, Grid, Group, Stack, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useMemo } from 'react';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import type { CuisineFilterCategory } from '@/parcels/search/cuisine/types.ts';
import { useStartSearch } from '@/parcels/search/startSearch.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './FilterOverview.module.css';

type FilterOverviewProps = {
  tcg: Tcg;
  filtersByCategory: Record<string, CuisineFilterCategory>;
  constructedQueryFilters: string[];
  resetFilters: () => void;
};

export function FilterOverview({ tcg, filtersByCategory, constructedQueryFilters, resetFilters }: FilterOverviewProps) {
  const constructedQuery = useMemo<string>(() => {
    if (constructedQueryFilters.length === 1) {
      return constructedQueryFilters[0];
    }
    return constructedQueryFilters.map((f) => `(${f})`).join(' ');
  }, [constructedQueryFilters]);
  const [debouncedQuery] = useDebouncedValue(constructedQuery, 500);

  const startSearch = useStartSearch(tcg, constructedQuery);

  return (
    <div className={styles.mainContent}>
      <Breadcrumbs subpage={'Erweiterte Suche'} />

      <div className={styles.cuisine}>
        <div className={styles.header}>
          <Group justify={'space-between'}>
            <div style={{ width: '50%' }}>
              {constructedQueryFilters.length === 0 && (
                <Text fs={'italic'}>Benutze die Filter unten, um dir die Suche zusammenzubauen.</Text>
              )}
              {constructedQueryFilters.length > 0 && <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />}
            </div>
            <Group>
              {constructedQueryFilters.length > 0 && (
                <Button color={'var(--gourmet-neutral-3)'} onClick={resetFilters}>
                  {constructedQueryFilters.length} Filter zurücksetzen
                </Button>
              )}
              <Button
                color={'var(--gourmet-blue-2)'}
                disabled={constructedQueryFilters.length === 0}
                leftSection={<IconSearch size={18} />}
                onClick={startSearch}
              >
                Suche starten
              </Button>
            </Group>
          </Group>
        </div>

        <div className={styles.searchOptions}>
          <Stack gap={'xs'}>
            {Object.entries(filtersByCategory).map(([key, category]) => {
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
                                <div style={{ maxWidth: '75%' }}>{filter.component}</div>
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
