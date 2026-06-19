import { Button, Divider, Group, Stack, Text, TextInput, UnstyledButton } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconBowlChopsticks, IconHelpHexagon, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { type RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NewHereModal } from '@/parcels/homepage/Home/NewHereModal/NewHereModal.tsx';
import { TcgSelector } from '@/parcels/search/bar/MobileSearchbar/TcgSelector.tsx';
import { SearchCompletion } from '@/parcels/search/bar/SearchCompletion/SearchCompletion.tsx';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import { SearchRecentSuggestions } from '@/parcels/search/bar/SearchRecent/SearchRecentSuggestions.tsx';
import { FilterGlossary } from '@/parcels/search/glossary/FilterGlossary.tsx';
import { useSearchQuery } from '@/parcels/search/useSearchQuery.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import styles from './MobileSearchbar.module.css';

type MobileSearchbarProps = {
  close: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
};

export function MobileSearchbar({ close, containerRef }: MobileSearchbarProps) {
  const { t } = useTranslation('search');
  const { tcg, setTcg } = useTcg();
  const {
    currentQuery,
    setQueryString,
    setQueryWrapper,
    inputRef,
    selectionIndex,
    setSelectionIndex,
    suggestionIndex,
    setSuggestionIndex,
    startSearch,
  } = useSearchQuery(true, tcg, close);

  const [debouncedQuery] = useDebouncedValue(currentQuery.query, 500);

  const [helpOpened, setHelpOpened] = useState(false);

  return (
    <>
      <NewHereModal opened={helpOpened} setOpened={setHelpOpened} />

      <Stack gap={'xs'}>
        <Group>
          <TextInput
            classNames={{
              root: styles.mantineInputRoot,
              input: styles.mantineInput,
              section: styles.mantineInputSection,
            }}
            ref={inputRef}
            value={currentQuery.query}
            placeholder={t('searchPlaceholder')}
            leftSection={<TcgSelector selectedTcg={tcg} setSelectedTcg={setTcg} />}
            onChange={(event) => {
              const newQuery = event.target.value;
              setQueryString(newQuery);
            }}
          />
          <Button onClick={close} classNames={{ root: styles.closeButton }}>
            <IconX size={18} color={'var(--gourmet-neutral-8)'} />
          </Button>
        </Group>

        <Group ml={'xs'}>
          <div className={styles.help}>
            <UnstyledButton
              onClick={() => {
                setHelpOpened(true);
              }}
            >
              <Group gap={'0.25rem'}>
                <IconHelpHexagon size={16} color={'var(--cgm-sidebar-button-bg)'} />
                <Text>{t('help')}</Text>
              </Group>
            </UnstyledButton>
          </div>
          <div className={styles.kitchen}>
            <Link to={`/$tcg/kitchen`} params={{ tcg: tcg }}>
              <IconBowlChopsticks size={16} color={'var(--cgm-sidebar-button-bg)'} />
              {t('kitchen')}
            </Link>
          </div>
          <FilterGlossary />
        </Group>

        <Stack gap={'sm'}>
          {currentQuery.query.length === 0 && (
            <div className={`${styles.typingInfo}`}>
              <p>{t('startTyping')}</p>
            </div>
          )}
          {currentQuery.query.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />
            </div>
          )}

          <Stack>
            <Button
              fz={'0.85rem'}
              color={'var(--gourmet-blue-1)'}
              onClick={startSearch}
              disabled={currentQuery.query.length === 0}
            >
              {t('start')}
            </Button>
            <Divider my="xs" />
          </Stack>

          {currentQuery.isByUser && currentQuery.query.length > 0 && (
            <SearchCompletion
              tcg={tcg}
              currentQuery={currentQuery.query}
              suggestionIndex={suggestionIndex}
              setSuggestionIndex={setSuggestionIndex}
              isOpened={true}
              setQuery={setQueryWrapper}
              searchInputRef={inputRef}
            />
          )}

          {!currentQuery.isByUser && (
            <SearchRecentSuggestions
              setIsOpened={() => close()}
              selectionIndex={selectionIndex}
              setSelectionIndex={setSelectionIndex}
              setQueryWrapper={setQueryWrapper}
              maxEntries={{
                history: 5,
                saved: 3,
              }}
              searchContainerRef={containerRef}
              searchInputRef={inputRef}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
}
