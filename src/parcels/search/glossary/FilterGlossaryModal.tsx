import { Center, Group, Modal, ScrollArea, SimpleGrid, Space, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowLeft, IconNotebook } from '@tabler/icons-react';
import { type Ref, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { TextDropdown } from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import cssStyles from '@/parcels/search/bar/Searchbar/Searchbar.module.css';
import { SimpleSearchbar } from '@/parcels/search/bar/SimpleSearchbar/SimpleSearchbar.tsx';
import { useFilters } from '@/parcels/search/filter/useFilters.ts';
import styles from '@/parcels/search/glossary/FilterGlossary.module.css';
import { useUserLanguage } from '@/parcels/state/useUserLanguage.tsx';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import type { TransSearchQueryExecutorFilter } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function FilterGlossaryModal({
  opened,
  setOpened,
  ref,
}: {
  opened: boolean;
  setOpened: (val: boolean) => void;
  ref?: Ref<HTMLDivElement>;
}) {
  const { tcg: tcg2 } = useTcg();
  const [tcg, setTcg] = useState<Tcg>(tcg2);
  useEffect(() => {
    setTcg(tcg2);
  }, [tcg2]);

  const [lang] = useUserLanguage();
  const { t } = useTranslation('search', { keyPrefix: 'glossary' });

  const [glossarySearch, setGlossarySearch] = useState('');

  const f = useFilters(tcg);
  const [filters, setFilters] = useState<TransSearchQueryExecutorFilter[]>(f);
  useEffect(() => {
    const filteredFilters = f.filter((f) => {
      if (f.filter.keywords.some((k) => k.includes(glossarySearch))) return true;
      const translation = f.translations[lang] ?? f.translations.en;
      return translation.title.includes(glossarySearch) || translation.description.includes(glossarySearch);
    });

    setFilters(filteredFilters);
  }, [f, glossarySearch, lang]);

  const [selectedEntry, setSelectedEntry] = useState<TransSearchQueryExecutorFilter | null>(null);

  const smallerScreen = useMediaQuery('(max-width: 1200px)');
  const smallScreen = useMediaQuery('(max-width: 1000px)');
  const smallestScreen = useMediaQuery('(max-width: 800px)');
  const tinyScreen = useMediaQuery('(max-width: 600px)');

  const showDetails = !smallestScreen || selectedEntry;

  return (
    <Modal
      title={
        <Group gap={'0.25rem'}>
          <IconNotebook size={22} color={'var(--gourmet-neutral-9)'} />
          <GourmetText cgmff={'ui'} fz={'1.25rem'} fw={500} cgmc={'neutral-9'}>
            {t('title')}
          </GourmetText>
          <Space w={'0.35rem'} />

          <TextDropdown
            items={{
              mtg: 'Magic: The Gathering',
              pcg: 'Pokémon Card Game',
              dlc: 'Disney Lorcana',
            }}
            t={t}
            defaultSelected={tcg}
            onSelect={(newTcg) => {
              setTcg(newTcg as Tcg);
            }}
            miw={'14rem'}
            color={'grey'}
          />
        </Group>
      }
      opened={opened}
      onClose={() => {
        setSelectedEntry(null);
        setOpened(false);
      }}
      fullScreen={smallestScreen}
      size={'auto'}
      closeOnClickOutside={false}
      classNames={{
        content: cssStyles.glossaryContent,
        header: cssStyles.glossaryHeader,
      }}
      ref={ref}
    >
      <Group
        wrap={'nowrap'}
        align={'start'}
        style={{
          maxHeight: smallestScreen ? '100vh' : '70vh',
          maxWidth: smallestScreen ? undefined : '70vw',
          width: smallestScreen ? undefined : '70vw',
        }}
        gap={'1.5rem'}
      >
        {showDetails && (
          <Stack
            miw={smallestScreen ? undefined : '18rem'}
            maw={smallestScreen ? undefined : '24rem'}
            mah={smallestScreen ? undefined : '65vh'}
            h={smallestScreen ? '100%' : undefined}
            style={{ overflow: 'hidden' }}
            justify={'space-between'}
          >
            <Stack>
              {selectedEntry && <FilterGlossaryDetails f={selectedEntry} />}
              {!selectedEntry && (
                <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
                  {t('clickForDetails')}
                </GourmetText>
              )}
            </Stack>

            {smallestScreen && (
              <UnstyledButton
                onClick={() => {
                  setSelectedEntry(null);
                }}
              >
                <Group gap={'0.2rem'}>
                  <IconArrowLeft size={18} color={'var(--gourmet-blue-1)'} />
                  <GourmetText fw={500} c={'var(--gourmet-blue-1)'}>
                    {t('goBack')}
                  </GourmetText>
                </Group>
              </UnstyledButton>
            )}
          </Stack>
        )}

        {(!smallestScreen || !showDetails) && (
          <Stack w={'100%'}>
            <Group justify={'end'} w={'100%'}>
              <SimpleSearchbar
                onChange={(q) => {
                  setGlossarySearch(q);
                }}
              />
            </Group>

            <ScrollArea h={smallestScreen ? '80vh' : '60vh'} offsetScrollbars scrollbarSize={8}>
              {filters.length > 0 && (
                <SimpleGrid cols={tinyScreen ? 2 : smallestScreen ? 3 : smallScreen ? 2 : smallerScreen ? 3 : 4}>
                  {filters.map((f, i) => {
                    const { filter, translations } = f;
                    const translation = translations[lang] ?? translations.en;

                    return (
                      <UnstyledButton
                        key={i}
                        onClick={() => {
                          setSelectedEntry(f);
                        }}
                        mih={'6.5rem'}
                        className={styles.glossaryItem}
                        data-selected={selectedEntry === f}
                      >
                        <Stack align={'start'} h={'100%'} justify={'space-between'}>
                          <Stack gap={'0'}>
                            <GourmetText cgmff={'ui'} fz={'1.15rem'} fw={500} c={'var(--gourmet-blue-1)'}>
                              {translation.title && translation.title}
                              {!translation.title && capitalizeFirstLetter(filter.keywords[0])}
                            </GourmetText>
                            <Group gap={'0.65rem'} style={{ rowGap: '0' }}>
                              {filter.keywords.map((keyword) => {
                                return (
                                  <GourmetText key={keyword} cgmff={'monospace'} fz={'0.85rem'}>
                                    {keyword}
                                  </GourmetText>
                                );
                              })}
                            </Group>
                          </Stack>

                          {translation.description && (
                            <GourmetText fz={'0.875rem'} c={'var(--gourmet-neutral-6)'}>
                              {translation.description}
                            </GourmetText>
                          )}
                        </Stack>
                      </UnstyledButton>
                    );
                  })}
                </SimpleGrid>
              )}
              {filters.length === 0 && (
                <Center>
                  <GourmetText cgmff={'ui'} cgmc={'neutral-4'}>
                    {t('noFilters')}
                  </GourmetText>
                </Center>
              )}
            </ScrollArea>
          </Stack>
        )}
      </Group>
    </Modal>
  );
}

export function FilterGlossaryDetails({ f }: { f: TransSearchQueryExecutorFilter }) {
  const { t } = useTranslation('search', { keyPrefix: 'glossary' });

  const [lang] = useUserLanguage();
  const { filter, translations } = f;
  const translation = translations[lang] ?? translations.en;
  const operators = [...new Set(filter.properties.flatMap((p) => p.operators))];

  return (
    <Stack>
      <Stack gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fz={'1.25rem'} fw={500} c={'var(--gourmet-blue-1)'}>
          {translation.title && translation.title}
          {!translation.title && capitalizeFirstLetter(filter.keywords[0])}
        </GourmetText>

        <Group gap={'0.5rem'}>
          {filter.strictValues && (
            <Tooltip label={'This filter only allow predefined auto-complete values'}>
              <GourmetText
                className={styles.glossaryItemTag}
                data-color={'red'}
                fz={'0.75rem'}
                c={'var(--gourmet-red-01)'}
                cgmff={'monospace'}
                fw={500}
              >
                {t('strict')}
              </GourmetText>
            </Tooltip>
          )}
          {filter.inverted && (
            <Tooltip label={'This filter is inverted by default'}>
              <GourmetText
                className={styles.glossaryItemTag}
                data-color={'orange'}
                fz={'0.75rem'}
                c={'var(--gourmet-orange-1)'}
                cgmff={'monospace'}
                fw={500}
              >
                {t('inverted')}
              </GourmetText>
            </Tooltip>
          )}
        </Group>
      </Stack>

      <Stack gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} cgmc={'neutral-7'}>
          {t('keywordsTitle')}
        </GourmetText>
        <Stack gap={'0.25rem'}>
          {filter.keywords.map((keyword) => {
            return (
              <GourmetText key={keyword} cgmff={'monospace'} cgmc={'neutral-9'}>
                {keyword}
              </GourmetText>
            );
          })}
        </Stack>
      </Stack>

      <Stack gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} cgmc={'neutral-7'}>
          {t('descriptionTitle')}
        </GourmetText>
        {translation.description && <GourmetText cgmc={'neutral-9'}>{translation.description}</GourmetText>}
        {!translation.description && <GourmetText cgmc={'neutral-6'}>&mdash;</GourmetText>}
      </Stack>

      <Stack gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} cgmc={'neutral-7'}>
          {t('operatorTitle')}
        </GourmetText>
        <Stack gap={'0.25rem'}>
          <GourmetText cgmff={'monospace'} cgmc={'neutral-9'}>
            {operators.join(', ')}
          </GourmetText>
        </Stack>
      </Stack>
    </Stack>
  );
}
