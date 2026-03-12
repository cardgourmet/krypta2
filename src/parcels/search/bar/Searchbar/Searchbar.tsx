import {useClickOutside, useDebouncedValue, useFocusTrap, useMergedRef} from '@mantine/hooks';
import {IconDeviceVisionPro, IconQuestionMark, IconX} from '@tabler/icons-react';
import {Link, useNavigate, useRouter} from '@tanstack/react-router';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TcgSelector} from '@/parcels/search/bar/MobileSearchbar/TcgSelector.tsx';
import {handleKeydown} from '@/parcels/search/bar/Searchbar/handleKeydown.ts';
import SearchFooter from '@/parcels/search/bar/Searchbar/SearchFooter.tsx';
import {SearchCompletion} from '@/parcels/search/bar/SearchCompletion/SearchCompletion.tsx';
import {SearchQueryExplanation} from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import {useSearchHistory} from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import SearchRecent from '@/parcels/search/bar/SearchRecent/SearchRecent.tsx';
import {useSearchQuery} from '@/parcels/search/useSearchQuery.ts';
import {useTcg} from '@/parcels/tcg/TcgProvider.tsx';
import styles from './Searchbar.module.css';

export default function Searchbar() {
  const { tcg, setTcg } = useTcg();
  const { t } = useTranslation('search');

  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const history = useSearchHistory(tcg);
  const recentQueries = history?.pastQueries ?? [];

  const [historyIndex, setHistoryIndex] = useState(0);
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
    });

    document.addEventListener('keydown', handle);
    return () => {
      // Detach listener when component unmounts
      document.removeEventListener('keydown', handle);
    };
  }, [tcg, isOpened, currentQuery.query, navigate, hasActiveSuggestion]);

  const focusTrapRef = useFocusTrap(isOpened);
  const clickOutsideRef = useClickOutside(() => setIsOpened(false));
  const mergedSearchRef = useMergedRef(searchContainerRef, clickOutsideRef, focusTrapRef);

  const router = useRouter();
  router.subscribe('onLoad', () => {
    requestAnimationFrame(() => {
      setIsOpened(false);
    });
  });

  return (
    <>
      <div className={`${styles.searchOverlay} ${!isOpened ? styles.hidden : ''}`} />

      <div className={styles.searchbar} ref={mergedSearchRef}>
        <div className={styles.searchIcon}>
          <TcgSelector selectedTcg={tcg} setSelectedTcg={setTcg} />
        </div>
        <input
          className={styles.searchInput}
          type="text"
          ref={searchInputRef}
          value={currentQuery.query}
          placeholder={t('search-placeholder')}
          onFocus={() => setIsOpened(true)}
          onClick={() => setIsOpened(true)}
          onChange={(event) => {
            const newQuery = event.target.value;
            if (isCaptainOfTheShip && newQuery.length === 0) {
              setHistoryIndex(0);
              setCurrentQuery({ query: '', isByUser: false });
            } else if (!isCaptainOfTheShip && newQuery.length === 0) {
              setHistoryIndex(0);
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
        />
        <button
          className={`${styles.deleteSearchIcon} ${currentQuery.query.length === 0 ? styles.hidden : ''}`}
          type={'button'}
          onClick={() => {
            setCurrentQuery({ query: '', isByUser: false });
            searchInputRef.current?.focus();
          }}
        >
          <IconX size={16} color={'var(--gourmet-neutral-8)'} />
        </button>

        <button type="button" className={styles.helpButton}>
          <IconQuestionMark size={18} color={'var(--gourmet-neutral-8)'} />
        </button>

        <div className={`${styles.searchModal} ${!isOpened ? styles.hidden : ''}`}>
          <div className={styles.content}>
            <div className={styles.advancedSearch}>
              <Link to={`/$tcg/advanced`} params={{ tcg: tcg }}>
                <IconDeviceVisionPro size={16} color={'var(--cgm-sidebar-button-bg)'} />
                {t('advanced')}
              </Link>
            </div>

            <div className={`${styles.typingInfo} ${isCaptainOfTheShip ? styles.hidden : ''}`}>
              <p>Beginne zu tippen, um Vorschläge für Filter und Werte zu erhalten.</p>
            </div>

            {!isCaptainOfTheShip && recentQueries.length > 0 && (
              <SearchRecent
                tcg={tcg}
                close={() => {
                  setIsOpened(false);
                }}
                setQuery={setQueryWrapper}
                historyIndex={historyIndex}
                setHistoryIndex={setHistoryIndex}
                searchContainerRef={searchContainerRef}
                searchInputRef={searchInputRef}
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
