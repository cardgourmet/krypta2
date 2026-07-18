import { Button, Divider, Group, Stack, Text, TextInput, UnstyledButton } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconArrowsShuffle, IconBowlChopsticks, IconHelpHexagon, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { type RefObject, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { NewHereModal } from '@/parcels/homepage/Home/NewHereModal/NewHereModal.tsx';
import { useNavbarStore } from '@/parcels/homepage/Navbar/Navbar.tsx';
import { TcgSelector } from '@/parcels/search/bar/MobileSearchbar/TcgSelector.tsx';
import cssStyles from '@/parcels/search/bar/Searchbar/Searchbar.module.css';
import { SearchRecentSuggestions } from '@/parcels/search/bar/SearchRecent/SearchRecentSuggestions.tsx';
import { SearchCompletion } from '@/parcels/search/completion/SearchCompletion.tsx';
import { SearchQueryExplanation } from '@/parcels/search/completion/SearchQueryExplanation.tsx';
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

  const [doRandomize, setDoRandomize] = useState(false);
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
  } = useSearchQuery(true, tcg, close, doRandomize);

  const [debouncedQuery] = useDebouncedValue(currentQuery.query, 500);

  const [helpOpened, setHelpOpened] = useState(false);

  const mobileSearchOpen = useNavbarStore((s) => s.mobileSearchOpen);
  useEffect(() => {
    requestAnimationFrame(() => {
      if (mobileSearchOpen) inputRef.current?.focus();
    });
  }, [mobileSearchOpen, inputRef]);

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
            <Link to={`/$tcg/kitchen`} params={{ tcg: tcg }} onClick={close}>
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
              <SearchQueryExplanation tcg={tcg} query={debouncedQuery} fontSize={'0.9rem'} />
            </div>
          )}

          <Stack gap={'0.5rem'}>
            <Button
              fz={'0.85rem'}
              color={'var(--gourmet-blue-1)'}
              onClick={startSearch}
              disabled={currentQuery.query.length === 0}
            >
              <GourmetText
                cgmff={'ui'}
                c={currentQuery.query.length === 0 ? 'var(--gourmet-neutral-6)' : 'var(--gourmet-neutral-1)'}
                fw={500}
              >
                {t('start')}
              </GourmetText>
            </Button>
            <Group>
              <UnstyledButton
                className={cssStyles.randomizeButton}
                onClick={() => {
                  setDoRandomize(!doRandomize);
                }}
                data-selected={doRandomize}
              >
                <Group gap={'0.25rem'}>
                  <IconArrowsShuffle
                    size={16}
                    color={doRandomize ? 'var(--gourmet-neutral-1)' : 'var(--gourmet-neutral-6)'}
                  />
                  <GourmetText
                    cgmff={'ui'}
                    fz={'0.875rem'}
                    c={doRandomize ? 'var(--gourmet-neutral-1)' : 'var(--gourmet-neutral-6)'}
                    fw={doRandomize ? 500 : undefined}
                  >
                    {t('randomize')}
                  </GourmetText>
                </Group>
              </UnstyledButton>
            </Group>
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
