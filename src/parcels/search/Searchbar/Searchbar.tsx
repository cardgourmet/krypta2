import { useClickOutside, useMergedRef } from '@mantine/hooks';
import { IconQuestionMark, IconSearch, IconX } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getFocusableElements } from '@/parcels/search/getFocusableElements.ts';
import { GameSelector } from '@/parcels/search/Searchbar/GameSelector.tsx';
import { handleKeydown } from '@/parcels/search/Searchbar/handleKeydown.ts';
import { SearchCompletion } from '@/parcels/search/Searchbar/SearchCompletion.tsx';
import SearchFooter from '@/parcels/search/Searchbar/SearchFooter.tsx';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider.tsx';
import SearchRecent from '@/parcels/search/SearchRecent/SearchRecent.tsx';
import { useSearchQuery } from '@/parcels/search/useSearchQuery.ts';
import { useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
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

  const setQueryWrapper = useCallback(
    (query: string, isByUser: boolean) => {
      setCurrentQuery({ query, isByUser });

      if (searchInputRef.current) {
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
    [setCurrentQuery],
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
    });

    document.addEventListener('keydown', handle);
    return () => {
      // Detach listener when component unmounts
      document.removeEventListener('keydown', handle);
    };
  }, [currentTcg, isOpened, currentQuery, navigate]);

  const clickOutsideRef = useClickOutside(() => setIsOpened(false));
  const mergedSearchRef = useMergedRef(searchContainerRef, clickOutsideRef);

  return (
    <>
      <div className={`${styles.searchOverlay} ${!isOpened ? styles.hidden : ''}`} />

      <div className={styles.searchbar} ref={mergedSearchRef}>
        <IconSearch size={18} color={'#9ba6b1'} className={styles.searchIcon} />
        <input
          type="text"
          ref={searchInputRef}
          value={currentQuery.query}
          placeholder={'Suche nach Karten..'}
          onFocus={() => setIsOpened(true)}
          onClick={() => setIsOpened(true)}
          onChange={(event) => {
            const newQuery = event.target.value;
            if (isCaptainOfTheShip && newQuery.length === 0) {
              setCurrentQuery({ query: '', isByUser: false });
            } else if (!isCaptainOfTheShip && newQuery.length > 0) {
              setCurrentQuery({ query: event.target.value, isByUser: true });
            } else if (isCaptainOfTheShip && newQuery.length > 0) {
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
          <IconX size={16} color={'#9ba6b1'} />
        </button>

        <button type="button">
          <IconQuestionMark size={18} color={'#9ba6b1'} />
        </button>

        <div className={`${styles.searchModal} ${!isOpened ? styles.hidden : ''}`}>
          <div className={styles.content}>
            <GameSelector tcg={currentTcg} setTcg={setCurrentTcg} />

            <div className={`${styles.typingInfo} ${isCaptainOfTheShip ? styles.hidden : ''}`}>
              <p>Beginne zu tippen, um Vorschläge für Filter und Werte zu erhalten.</p>
            </div>

            <div className={`${isCaptainOfTheShip || recentQueries.length === 0 ? styles.hidden : ''}`}>
              <SearchRecent
                tcg={currentTcg}
                setIsOpened={setIsOpened}
                setQuery={setQueryWrapper}
                searchContainerRef={searchContainerRef}
                searchInputRef={searchInputRef}
              />
            </div>

            <div className={`${!isCaptainOfTheShip || currentQuery?.query?.length === 0 ? styles.hidden : ''}`}>
              <SearchCompletion tcg={currentTcg} currentQuery={currentQuery.query} />
            </div>
          </div>

          <SearchFooter />
        </div>
      </div>
    </>
  );
}
