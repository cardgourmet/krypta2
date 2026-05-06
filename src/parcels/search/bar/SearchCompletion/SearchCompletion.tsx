import {Group, Highlight} from '@mantine/core';
import {type RefObject, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {generateCompletions, type GeneratedSearchCompletion,} from '@/parcels/search/bar/SearchCompletion/generateCompletions.ts';
import {type SearchSuggestion, transformCompletions,} from '@/parcels/search/bar/SearchCompletion/transformCompletions.ts';
import {useFilterCacheStore} from '@/parcels/search/filter/FilterCacheStore.tsx';
import {useFilters} from '@/parcels/search/filter/useFilters.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
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

  const filters = useFilters(tcg);
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

  const findOrFetchValues = useFilterCacheStore((state) => state.findOrFetchValues);
  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!isOpened) return;

    generateCompletions(tcg, currentQuery, filters, 5, findOrFetchValues).then((state) => {
      const suggestions = transformCompletions(currentQuery, state);
      setSuggestions([{ fullQuery: currentQuery }, ...suggestions]);
    });
  }, [tcg, currentQuery, isOpened, findOrFetchValues]);

  return (
    <div className={styles.main}>
      {suggestions.length > 1 && (
        <div className={styles.completionList}>
          {suggestions.slice(1).map((sugg, index) => {
            const completion = sugg.completion as GeneratedSearchCompletion;
            const selected = index === suggestionIndex - 1;
            const userInput = sugg.userInput;

            return (
              <button
                type={'button'}
                className={styles.completionEntry}
                key={`${completion.value}_${completion.type}`}
                data-state={selected ? 'selected' : ''}
                onClick={() => {
                  const currentSugg = sugg.fullQuery;
                  setQuery(currentSugg, true);
                  setSuggestionIndex(0);

                  searchInputRef.current?.focus();
                }}
              >
                {userInput && (
                  <Highlight
                    highlight={userInput as string}
                    highlightStyles={{
                      fontWeight: 'bold',
                      backgroundColor: 'transparent',
                      color: 'var(--gourmet-blue-5)',
                    }}
                  >
                    {completion.value}
                  </Highlight>
                )}
                {!userInput && <p>{completion.value}</p>}
                {completion.types && (
                  <Group gap={'0.25rem'}>
                    {completion.types?.map((type) => {
                      return (
                        <p key={type} className={styles.entryType}>
                          {type}
                        </p>
                      );
                    })}
                  </Group>
                )}
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
