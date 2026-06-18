import { Group, Space } from '@mantine/core';
import { useDebouncedValue, useFocusTrap, useMergedRef } from '@mantine/hooks';
import { IconBowlChopsticks, IconQuestionMark, IconX } from '@tabler/icons-react';
import { Link, useLocation, useNavigate, useRouter } from '@tanstack/react-router';
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { NewHereModal } from '@/parcels/homepage/Home/NewHereModal/NewHereModal.tsx';
import { TcgSelector } from '@/parcels/search/bar/MobileSearchbar/TcgSelector.tsx';
import { handleKeydown } from '@/parcels/search/bar/Searchbar/handleKeydown.ts';
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

  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [selectionIndex, setSelectionIndex] = useState(0);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const hasActiveSuggestion = suggestionIndex > 0;

  const [currentQuery, setCurrentQuery] = useSearchQuery();
  const [debouncedQuery] = useDebouncedValue(currentQuery.query, 500);
  const isCaptainOfTheShip = currentQuery.isByUser ?? false;
  const setQueryWrapper = useCallback(
    (query: string, isByUser?: boolean) => {
      setCurrentQuery({ query: query, isByUser: isByUser !== undefined ? isByUser : false });

      if (isOpened && searchInputRef.current) {
        searchInputRef.current.focus();

        const length = query.length;
        searchInputRef.current.setSelectionRange(length, length);

        // hacky, I'm so sorry (LG zurück)
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.scrollLeft = searchInputRef.current.scrollWidth;
          }
        }, 10);
      }
    },
    [setCurrentQuery, isOpened],
  );

  const location = useLocation();
  useEffect(() => {
    if (!searchContainerRef.current) return;

    const handle = handleKeydown({
      tcg: tcg,
      searchInputRef: searchInputRef,
      isOpened: isOpened,
      setIsOpened: setIsOpened,
      currentQuery: currentQuery.query,
      navigate: navigate,
      hasActiveSuggestion: hasActiveSuggestion,
      locationHref: location.href,
    });

    document.addEventListener('keydown', handle);
    return () => {
      // Detach listener when component unmounts
      document.removeEventListener('keydown', handle);
    };
  }, [tcg, isOpened, currentQuery.query, navigate, hasActiveSuggestion, location.href]);

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
            ref={searchInputRef}
            value={currentQuery.query}
            placeholder={t('searchPlaceholder')}
            onFocus={() => setIsOpened(true)}
            onClick={() => setIsOpened(true)}
            onChange={(event) => {
              const newQuery = event.target.value;
              if (isCaptainOfTheShip && newQuery.length === 0) {
                setSelectionIndex(0);
                setCurrentQuery({ query: '', isByUser: false });
              } else if (!isCaptainOfTheShip && newQuery.length === 0) {
                setSelectionIndex(0);
                setCurrentQuery({ query: '', isByUser: false });
              } else if (!isCaptainOfTheShip && newQuery.length > 0) {
                setSuggestionIndex(0);
                setCurrentQuery({ query: event.target.value, isByUser: true });
              } else if (isCaptainOfTheShip && newQuery.length > 0) {
                setSuggestionIndex(0);
                setCurrentQuery({ query: event.target.value, isByUser: true });
              }
            }}
            data-autofocus
            style={inputStyles}
          />
          <button
            className={`${cssStyles.deleteSearchIcon} ${currentQuery.query.length === 0 ? cssStyles.hidden : ''}`}
            type={'button'}
            onClick={() => {
              setCurrentQuery({ query: '', isByUser: false });
              searchInputRef.current?.focus();
            }}
          >
            <IconX size={omitHelp ? 18 : 16} color={'var(--gourmet-neutral-8)'} />
          </button>
        </div>

        {!omitHelp && (
          <button type="button" className={cssStyles.helpButton} onClick={() => setHelpOpened(true)}>
            <IconQuestionMark size={18} color={'var(--gourmet-neutral-8)'} />
          </button>
        )}

        <div className={`${cssStyles.searchModal} ${!isOpened ? cssStyles.hidden : ''}`} style={modalStyles}>
          <div className={cssStyles.content}>
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
                      {t('cuisine')}
                    </GourmetText>
                  </Group>
                </Link>
              </Group>
            )}

            {omitHelp && <Space h={'0.25rem'} />}

            <div className={`${cssStyles.typingInfo} ${isCaptainOfTheShip ? cssStyles.hidden : ''}`}>
              <p>{t('startTyping')}</p>
            </div>

            {!isCaptainOfTheShip && (
              <SearchRecentSuggestions
                setIsOpened={setIsOpened}
                selectionIndex={selectionIndex}
                setSelectionIndex={setSelectionIndex}
                setQueryWrapper={setQueryWrapper}
                maxEntries={{
                  saved: 3,
                  history: 5,
                }}
                registerRef={registerRef}
                searchInputRef={searchInputRef}
                searchContainerRef={searchContainerRef}
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
                  searchInputRef={searchInputRef}
                />
              </>
            )}
          </div>

          <SearchFooter />
        </div>
      </div>
    </>
  );
}
