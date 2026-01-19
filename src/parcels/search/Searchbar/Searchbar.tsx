import { useClickOutside, useMergedRef } from '@mantine/hooks';
import { IconQuestionMark, IconSearch, IconX } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GameSelector } from '@/parcels/search/Searchbar/GameSelector.tsx';
import { getFocusableElements } from '@/parcels/search/Searchbar/getFocusableElements.ts';
import { handleKeydown } from '@/parcels/search/Searchbar/handleKeydown.ts';
import SearchFooter from '@/parcels/search/Searchbar/SearchFooter.tsx';
import SearchRecent from '@/parcels/search/Searchbar/SearchRecent.tsx';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider.tsx';
import { useSearchQuery } from '@/parcels/search/useSearchQuery.ts';
import { useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './Searchbar.module.css';

export default function Searchbar() {
  const tcg = useTcgByLocation();
  const [isOpened, setIsOpened] = useState(false);

  const [currentTcg, setCurrentTcg] = useState<'dlc' | 'mtg' | 'pcg'>(tcg ?? 'dlc');
  useEffect(() => {
    setCurrentTcg(tcg ?? 'dlc');
  }, [tcg]);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const history = useSearchHistory(currentTcg);
  const recentQueries = history?.pastQueries ?? [];

  const [currentQuery, setCurrentQuery] = useSearchQuery();
  const isCaptainOfTheShip = currentQuery.isByUser ?? false;

  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const suggestions = useMemo(() => {
    const suggs = [...recentQueries].reverse().slice(0, 5);
    suggs.unshift('');

    return suggs;
  }, [recentQueries]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!searchContainerRef.current) return;
    const focusableElements = getFocusableElements(searchContainerRef.current);

    const handle = handleKeydown({
      tcg: currentTcg,
      searchInputRef: searchInputRef,
      isOpened: isOpened,
      setIsOpened: setIsOpened,
      focusableElements: focusableElements,
      suggestionIndex: suggestionIndex,
      setSuggestionIndex: setSuggestionIndex,
      currentQuery: currentQuery.query,
      navigate: navigate,
    });

    document.addEventListener('keydown', handle);
    return () => {
      // Detach listener when component unmounts
      document.removeEventListener('keydown', handle);
    };
  }, [currentTcg, isOpened, suggestionIndex, currentQuery, navigate]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!isOpened || isCaptainOfTheShip) return;

    // TODO: extract to `currentSuggestion`
    let currentSugg = '';
    if (suggestionIndex > 0) {
      currentSugg = suggestions[suggestionIndex];
    }
    setCurrentQuery({ query: currentSugg, isByUser: false });

    if (searchInputRef.current) {
      searchInputRef.current.focus();

      const length = currentSugg.length;
      searchInputRef.current.setSelectionRange(length, length);

      // hacky, I'm so sorry (LG zurück)
      const timeoutId = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.scrollLeft = searchInputRef.current.scrollWidth;
        }
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [suggestionIndex, isOpened, isCaptainOfTheShip]);

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
              setSuggestionIndex(0);
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
              <SearchRecent tcg={currentTcg} suggestionIndex={suggestionIndex} setIsOpened={setIsOpened} />
            </div>
          </div>

          <SearchFooter />
        </div>
      </div>
    </>
  );
}
