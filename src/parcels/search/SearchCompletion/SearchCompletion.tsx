import { useDebouncedValue } from '@mantine/hooks';
import { type RefObject, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchCache } from '@/parcels/search/SearchCacheProvider/SearchCacheProvider.tsx';
import {
  type GeneratedSearchCompletion,
  generateCompletions,
} from '@/parcels/search/SearchCompletion/generateCompletions.ts';
import { SearchQueryExplanation } from '@/parcels/search/SearchCompletion/SearchQueryExplanation.tsx';
import { type SearchSuggestion, transformCompletions } from '@/parcels/search/SearchCompletion/transformCompletions.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './SearchCompletion.module.css';

type SearchCompletionProps = {
  tcg: Tcg;
  currentQuery: string;
  isOpened: boolean;
  suggestionIndex: number;
  setSuggestionIndex: (index: number) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  setQuery: (query: string, isByUser: boolean) => void;
};

export function SearchCompletion({
  tcg,
  currentQuery,
  suggestionIndex,
  setSuggestionIndex,
  isOpened,
  searchInputRef,
  setQuery,
}: SearchCompletionProps) {
  const { t } = useTranslation('search');
  const { filter: filterStore, values: filterValueStore } = useSearchCache();
  const [debouncedQuery] = useDebouncedValue(currentQuery, 500);

  const [_, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (document.activeElement !== searchInputRef.current) return event.preventDefault();

        if (suggestions.length === 0) return;
        const arrowUp = event.key === 'ArrowUp';

        let newIndex = arrowUp ? suggestionIndex - 1 : suggestionIndex + 1;
        if (newIndex < 0) newIndex = suggestions.length - 1;
        if (newIndex >= suggestions.length) newIndex = 0;
        setSuggestionIndex(newIndex);

        return event.preventDefault();
      }
      if (event.key === 'Enter') {
        if (suggestionIndex === 0) return;

        const currentSugg = suggestions[suggestionIndex].fullQuery;
        setQuery(currentSugg, true);
        setSuggestionIndex(0);

        return event.preventDefault();
      }
    },
    [suggestionIndex, setSuggestionIndex, searchInputRef.current, setQuery, suggestions],
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!isOpened) return;

    const controller = new AbortController();
    generateCompletions(tcg, currentQuery, filterStore, filterValueStore, 5, setIsLoading, controller).then((state) => {
      const suggestions = transformCompletions(currentQuery, state);
      setSuggestions([{ fullQuery: currentQuery }, ...suggestions]);
    });

    return () => {
      controller.abort();
    };
  }, [tcg, currentQuery, isOpened]);

  return (
    <div className={styles.main}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />
      </div>
      {suggestions.length > 1 && (
        <div className={styles.completionList}>
          {suggestions.slice(1).map((sugg, index) => {
            const completion = sugg.completion as GeneratedSearchCompletion;
            const selected = index === suggestionIndex - 1;

            return (
              <button
                type={'button'}
                className={styles.completionEntry}
                key={completion.value}
                data-state={selected ? 'selected' : ''}
                onClick={() => {
                  const currentSugg = sugg.fullQuery;
                  setQuery(currentSugg, true);
                  setSuggestionIndex(0);
                }}
              >
                <p>{completion.value}</p>
                {completion.type !== undefined && <p className={styles.entryType}>{completion.type}</p>}
                {completion.aliasOf !== undefined && (
                  <p className={styles.entryAlias}>
                    {t('aliasFor')}: {completion.aliasOf}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
