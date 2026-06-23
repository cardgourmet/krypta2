import { Center, Group, ScrollArea, Space, UnstyledButton } from '@mantine/core';
import { useDebouncedValue, useFocusTrap, useMediaQuery, useMergedRef } from '@mantine/hooks';
import {
  IconArrowBigRightFilled,
  IconArrowsShuffle,
  IconBowlChopsticks,
  IconQuestionMark,
  IconX,
} from '@tabler/icons-react';
import { Link, useRouter } from '@tanstack/react-router';
import { type CSSProperties, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { NewHereModal } from '@/parcels/homepage/Home/NewHereModal/NewHereModal.tsx';
import { TcgSelector } from '@/parcels/search/bar/MobileSearchbar/TcgSelector.tsx';
import SearchFooter from '@/parcels/search/bar/Searchbar/SearchFooter.tsx';
import { SearchCompletion } from '@/parcels/search/bar/SearchCompletion/SearchCompletion.tsx';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import { SearchRecentSuggestions } from '@/parcels/search/bar/SearchRecent/SearchRecentSuggestions.tsx';
import { useClickOutsideWithRegistry } from '@/parcels/search/bar/useClickOutsideWithRegistry.ts';
import { FilterGlossary } from '@/parcels/search/glossary/FilterGlossary.tsx';
import { useSearchQuery } from '@/parcels/search/useSearchQuery.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import cssStyles from './Searchbar.module.css';

export default function Searchbar({
  styles,
  inputWrapperStyles,
  inputStyles,
  modalStyles,
  omitHelp,
  iconSize,
  caretIconSize,
}: {
  styles?: CSSProperties;
  inputWrapperStyles?: CSSProperties;
  inputStyles?: CSSProperties;
  modalStyles?: CSSProperties;
  omitHelp?: boolean;
  iconSize?: number;
  caretIconSize?: number;
}) {
  const { tcg, setTcg } = useTcg();
  const { t } = useTranslation('search');

  const [isOpened, setIsOpened] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
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
  } = useSearchQuery(isOpened, tcg, () => setIsOpened(false), doRandomize);

  const [debouncedQuery] = useDebouncedValue(currentQuery.query, 500);
  const isCaptainOfTheShip = currentQuery.isByUser ?? false;

  const registerRef = useClickOutsideWithRegistry(() => setIsOpened(false), isOpened);

  const focusTrapRef = useFocusTrap(isOpened);
  const mergedSearchRef = useMergedRef(searchContainerRef, focusTrapRef, registerRef);

  const router = useRouter();
  router.subscribe('onLoad', () => {
    requestAnimationFrame(() => {
      setIsOpened(false);
    });
  });

  const [helpOpened, setHelpOpened] = useState(false);

  const thinScreen = useMediaQuery('(max-height: 825px)');

  return (
    <>
      <NewHereModal opened={helpOpened} setOpened={setHelpOpened} />

      <div className={`${cssStyles.searchOverlay} ${!isOpened ? cssStyles.hidden : ''}`} />

      <div className={cssStyles.searchbar} ref={mergedSearchRef} style={styles}>
        <div className={cssStyles.searchInputWrapper} style={inputWrapperStyles}>
          <div
            className={cssStyles.searchIcon}
            style={{
              '--height': omitHelp ? '2.25rem' : '1.75rem',
            }}
          >
            <TcgSelector selectedTcg={tcg} setSelectedTcg={setTcg} iconSize={iconSize} iconCaretSize={caretIconSize} />
          </div>
          <input
            className={cssStyles.searchInput}
            type="text"
            ref={inputRef}
            value={currentQuery.query}
            placeholder={t('searchPlaceholder')}
            onFocus={() => setIsOpened(true)}
            onClick={() => setIsOpened(true)}
            onChange={(event) => {
              const newQuery = event.target.value;
              setQueryString(newQuery);
            }}
            data-autofocus
            style={inputStyles}
          />
          <Group className={cssStyles.rightSide} gap={'0.25rem'}>
            <button
              className={`${cssStyles.deleteSearchIcon} ${currentQuery.query.length === 0 ? cssStyles.hidden : ''}`}
              type={'button'}
              title={'Clear search'}
              onClick={() => {
                setQueryWrapper({ query: '', isByUser: false });
                inputRef.current?.focus();
              }}
            >
              <Center>
                <IconX
                  size={omitHelp ? 18 : 16}
                  color={isOpened ? 'var(--gourmet-neutral-7)' : 'var(--gourmet-neutral-5)'}
                />
              </Center>
            </button>
            <button
              className={`${cssStyles.sendItSearchIcon} ${currentQuery.query.length === 0 ? cssStyles.hidden : ''}`}
              type={'button'}
              title={'Send it'}
              onClick={() => {
                startSearch();
              }}
            >
              <Center>
                <IconArrowBigRightFilled
                  size={omitHelp ? 18 : 16}
                  color={isOpened ? 'var(--gourmet-blue-1)' : 'var(--gourmet-neutral-5)'}
                />
              </Center>
            </button>
          </Group>
        </div>

        {!omitHelp && (
          <button type="button" className={cssStyles.helpButton} onClick={() => setHelpOpened(true)}>
            <IconQuestionMark size={18} color={'var(--gourmet-neutral-8)'} />
          </button>
        )}

        <div className={`${cssStyles.searchModal} ${!isOpened ? cssStyles.hidden : ''}`} style={modalStyles}>
          <div className={cssStyles.content}>
            <Group justify={'space-between'} align={'center'}>
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
                    Randomize
                  </GourmetText>
                </Group>
              </UnstyledButton>

              {!omitHelp && (
                <Group justify={'end'} align={'center'}>
                  <FilterGlossary ref={registerRef} />

                  <Link
                    to={`/$tcg/kitchen`}
                    params={{ tcg: tcg }}
                    style={{ textDecoration: 'none', marginRight: omitHelp ? '0' : '3rem' }}
                  >
                    <Group gap={'0.15rem'}>
                      <IconBowlChopsticks size={16} color={'var(--cgm-sidebar-button-bg)'} />
                      <GourmetText cgmff={'ui'} fz={'0.875rem'} c={'var(--cgm-sidebar-button-bg)'}>
                        {t('kitchen')}
                      </GourmetText>
                    </Group>
                  </Link>
                </Group>
              )}
            </Group>

            {omitHelp && <Space h={'0.25rem'} />}

            <div className={`${cssStyles.typingInfo} ${isCaptainOfTheShip ? cssStyles.hidden : ''}`}>
              <p>{t('startTyping')}</p>
            </div>

            <ScrollArea.Autosize mah={thinScreen ? 300 : 500} scrollbarSize={4}>
              {!isCaptainOfTheShip && (
                <SearchRecentSuggestions
                  setIsOpened={setIsOpened}
                  selectionIndex={selectionIndex}
                  setSelectionIndex={setSelectionIndex}
                  maxEntries={{
                    saved: 3,
                    history: 5,
                  }}
                  registerRef={registerRef}
                  searchInputRef={inputRef}
                  searchContainerRef={searchContainerRef}
                  setQueryWrapper={setQueryWrapper}
                />
              )}

              {isCaptainOfTheShip && currentQuery.query.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />
                  </div>
                  <SearchCompletion
                    tcg={tcg}
                    currentQuery={currentQuery.query}
                    suggestionIndex={suggestionIndex}
                    setSuggestionIndex={setSuggestionIndex}
                    isOpened={isOpened}
                    setQuery={setQueryWrapper}
                    searchInputRef={inputRef}
                  />
                </>
              )}
            </ScrollArea.Autosize>
          </div>

          <SearchFooter />
        </div>
      </div>
    </>
  );
}
