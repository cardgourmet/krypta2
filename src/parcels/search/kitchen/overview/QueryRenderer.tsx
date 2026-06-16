import { Button, Container, Group, Modal, Stack, UnstyledButton } from '@mantine/core';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { IconMessage, IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import type { TcgKitchenFormData } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';
import { useKitchenFilterStore } from '@/parcels/search/kitchen/useKitchenFilterStore.ts';
import { useStartSearch } from '@/parcels/search/startSearch.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export function QueryRenderer({ form2 }: { form2: UseFormReturn<TcgKitchenFormData> }) {
  const { t } = useTranslation('kitchen');
  const tcg = useTcgByLocation() as Tcg;

  const constructedQueryFilters = useKitchenFilterStore((state) => state.constructedQueryFilters);
  const constructedQuery = useMemo<string>(() => {
    if (constructedQueryFilters.length === 1) {
      return constructedQueryFilters[0];
    }
    return constructedQueryFilters.map((f) => `(${f})`).join(' ');
  }, [constructedQueryFilters]);
  const [debouncedQuery] = useDebouncedValue(constructedQuery, 300);

  const startSearch = useStartSearch(tcg, constructedQuery);

  const smallerScreen = useMediaQuery('(max-width: 1000px)');
  const smallestScreen = useMediaQuery('(max-width: 600px)');
  const showExplanation = constructedQueryFilters.length > 0 && !smallestScreen;

  const [explanationModalOpen, setExplanationModalOpen] = useState(false);

  return (
    <>
      <Modal
        title={'Query Explanation'}
        opened={explanationModalOpen}
        onClose={() => setExplanationModalOpen(false)}
        size={'md'}
      >
        <Stack>
          <GourmetText cgmff={'ui'} cgmc={'neutral-9'}>
            {constructedQuery}
          </GourmetText>
          <SearchQueryExplanation tcg={tcg} query={debouncedQuery} fontSize={'0.9rem'} />
        </Stack>
      </Modal>

      <Group justify={'space-between'}>
        <Stack w={smallerScreen ? '100%' : '65%'} gap={'0.25rem'}>
          {constructedQuery && (
            <Group gap={'0.5rem'}>
              <GourmetText cgmff={'ui'} cgmc={'neutral-9'}>
                {constructedQuery}

                {smallestScreen && (
                  <UnstyledButton
                    style={{
                      marginLeft: '0.25rem',
                    }}
                    onClick={() => setExplanationModalOpen(true)}
                  >
                    <IconMessage size={20} color={'var(--gourmet-neutral-7)'} />
                  </UnstyledButton>
                )}
              </GourmetText>
            </Group>
          )}
          <Container ml={'0.15rem'}>
            {constructedQueryFilters.length === 0 && (
              <GourmetText fs={'italic'} cgmff={'ui'} cgmc={'neutral-7'}>
                {t('subtitle')}
              </GourmetText>
            )}
            {showExplanation && <SearchQueryExplanation tcg={tcg} query={debouncedQuery} fontSize={'0.9rem'} />}
          </Container>
        </Stack>
        <Group w={smallerScreen ? '100%' : undefined} justify={'end'}>
          {constructedQueryFilters.length > 0 && (
            <Button
              color={'var(--gourmet-neutral-3)'}
              onClick={() => {
                form2.reset();
              }}
            >
              {t('resetButton', { count: constructedQueryFilters.length })}
            </Button>
          )}
          <Button
            color={'var(--gourmet-blue-2)'}
            disabled={constructedQueryFilters.length === 0}
            leftSection={<IconSearch size={18} />}
            onClick={startSearch}
          >
            {t('startSearch')}
          </Button>
        </Group>
      </Group>
    </>
  );
}
