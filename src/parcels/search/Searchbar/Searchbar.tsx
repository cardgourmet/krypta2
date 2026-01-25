import { useClickOutside, useMergedRef } from '@mantine/hooks';
import { IconCaretDownFilled, IconQuestionMark, IconX } from '@tabler/icons-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Dropdown from '@/parcels/overview/Dropdown/Dropdown.tsx';
import { getFocusableElements } from '@/parcels/search/getFocusableElements.ts';
import { handleKeydown } from '@/parcels/search/Searchbar/handleKeydown.ts';
import SearchFooter from '@/parcels/search/Searchbar/SearchFooter.tsx';
import { SearchCompletion } from '@/parcels/search/SearchCompletion/SearchCompletion.tsx';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider/SearchHistoryProvider.tsx';
import SearchRecent from '@/parcels/search/SearchRecent/SearchRecent.tsx';
import { useSearchQuery } from '@/parcels/search/useSearchQuery.ts';
import { DLCIcon } from '@/parcels/tcg/dlc/Icon.tsx';
import { MTGIcon } from '@/parcels/tcg/mtg/Icon.tsx';
import { PCGIcon } from '@/parcels/tcg/pcg/Icon.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './Searchbar.module.css';

export default function Searchbar() {
  const tcg = useTcgByLocation();
  const [currentTcg, setCurrentTcg] = useState<'dlc' | 'mtg' | 'pcg'>(tcg ?? 'dlc');
  useEffect(() => {
    setCurrentTcg(tcg ?? 'dlc');
  }, [tcg]);
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const history = useSearchHistory(currentTcg);
  const recentQueries = history?.pastQueries ?? [];
  const [currentQuery, setCurrentQuery] = useSearchQuery();
  const isCaptainOfTheShip = currentQuery.isByUser ?? false;

  const [historyIndex, setHistoryIndex] = useState(0);

  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const hasActiveSuggestion = suggestionIndex > 0;

  const setQueryWrapper = useCallback(
    (query: string, isByUser: boolean) => {
      setCurrentQuery({ query, isByUser });

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
    const focusableElements = getFocusableElements(searchContainerRef.current);

    const handle = handleKeydown({
      tcg: currentTcg,
      searchInputRef: searchInputRef,
      isOpened: isOpened,
      setIsOpened: setIsOpened,
      focusableElements: focusableElements,
      currentQuery: currentQuery.query,
      navigate: navigate,
      hasActiveSuggestion: hasActiveSuggestion,
    });

    document.addEventListener('keydown', handle);
    return () => {
      // Detach listener when component unmounts
      document.removeEventListener('keydown', handle);
    };
  }, [currentTcg, isOpened, currentQuery, navigate, hasActiveSuggestion]);

  const clickOutsideRef = useClickOutside(() => setIsOpened(false));
  const mergedSearchRef = useMergedRef(searchContainerRef, clickOutsideRef);

  return (
    <>
      <div className={`${styles.searchOverlay} ${!isOpened ? styles.hidden : ''}`} />

      <div className={styles.searchbar} ref={mergedSearchRef}>
        <div className={styles.searchIcon}>
          <Dropdown
            items={{
              dlc: 'Disney Lorcana',
              mtg: 'Magic: The Gathering',
              pcg: 'Pokémon Card Game',
            }}
            selected={tcg}
            renderButtonContent={(selected) => (
              <>
                {selected === 'dlc' && <DLCIcon width={20} height={20} color={'var(--gourmet-neutral-dark-9)'} />}
                {selected === 'mtg' && <MTGIcon width={20} height={20} color={'var(--gourmet-neutral-dark-9)'} />}
                {selected === 'pcg' && <PCGIcon width={20} height={20} color={'var(--gourmet-neutral-dark-9)'} />}
                <IconCaretDownFilled size={12} color={'var(--gourmet-neutral-dark-9)'} />
              </>
            )}
            onSelect={(selected) => {
              setCurrentTcg(selected as Tcg);
            }}
          />
        </div>
        <input
          className={styles.searchInput}
          type="text"
          ref={searchInputRef}
          value={currentQuery.query}
          placeholder={'Suche nach Karten..'}
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
        />
        <button
          className={`${styles.deleteSearchIcon} ${currentQuery.query.length === 0 ? styles.hidden : ''}`}
          type={'button'}
          onClick={() => {
            setCurrentQuery({ query: '', isByUser: false });
            searchInputRef.current?.focus();
          }}
        >
          <IconX size={16} color={'var(--gourmet-neutral-dark-9)'} />
        </button>

        <button type="button">
          <IconQuestionMark size={18} color={'var(--gourmet-neutral-dark-9)'} />
        </button>

        <div className={`${styles.searchModal} ${!isOpened ? styles.hidden : ''}`}>
          <div className={styles.content}>
            <div className={styles.advancedSearch}>
              <Link to={`/${tcg as Tcg}/advanced`}>Advanced Search</Link>
            </div>

            <div className={`${styles.typingInfo} ${isCaptainOfTheShip ? styles.hidden : ''}`}>
              <p>Beginne zu tippen, um Vorschläge für Filter und Werte zu erhalten.</p>
            </div>

            {!isCaptainOfTheShip && recentQueries.length > 0 && (
              <SearchRecent
                tcg={currentTcg}
                setIsOpened={setIsOpened}
                setQuery={setQueryWrapper}
                historyIndex={historyIndex}
                setHistoryIndex={setHistoryIndex}
                searchContainerRef={searchContainerRef}
                searchInputRef={searchInputRef}
              />
            )}

            {isCaptainOfTheShip && currentQuery.query.length > 0 && (
              <SearchCompletion
                tcg={currentTcg}
                currentQuery={currentQuery.query}
                suggestionIndex={suggestionIndex}
                setSuggestionIndex={setSuggestionIndex}
                isOpened={isOpened}
                setQuery={setQueryWrapper}
                searchInputRef={searchInputRef}
              />
            )}
          </div>

          <SearchFooter />
        </div>
      </div>
    </>
  );
}
