import { Group, Highlight } from '@mantine/core';
import { Fragment, type RefObject, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { GeneratedSearchCompletion } from '@/parcels/search/completion/generateCompletions.ts';
import { useSearchCompletions } from '@/parcels/search/completion/useSearchCompletions.tsx';
import type { SearchQuery } from '@/parcels/search/useSearchQuery.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './SearchCompletion.module.css';

type SearchCompletionProps = {
  tcg: Tcg;
  currentQuery: string;
  isOpened: boolean;
  suggestionIndex: number;
  setSuggestionIndex: (index: number) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  setQuery: (query: SearchQuery) => void;
};

export function SearchCompletion({
  tcg,
  currentQuery,
  suggestionIndex,
  setSuggestionIndex,
  searchInputRef,
  setQuery,
}: SearchCompletionProps) {
  const { t } = useTranslation('search');

  const { suggestions, acceptSuggestion } = useSearchCompletions(tcg, currentQuery);

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

        const currentSugg = acceptSuggestion(suggestions[suggestionIndex]);
        setQuery({ query: currentSugg, isByUser: true });
        setSuggestionIndex(0);

        return event.preventDefault();
      }
    },
    [suggestionIndex, setSuggestionIndex, searchInputRef.current, setQuery, suggestions, acceptSuggestion],
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

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
                  const currentSugg = acceptSuggestion(sugg);

                  setQuery({ query: currentSugg, isByUser: true });
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
                      const key = `${completion.value}_${type}`;
                      if (!type) return <Fragment key={key} />;

                      return (
                        <p key={key} className={styles.entryType}>
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
