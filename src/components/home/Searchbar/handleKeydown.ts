import type { UseNavigateResult } from '@tanstack/react-router';
import type { RefObject } from 'react';

export function handleKeydown({
  searchInputRef,
  isOpened,
  setIsOpened,
  focusableElements,
  suggestionIndex,
  setSuggestionIndex,
  currentQuery,
  navigate,
}: {
  searchInputRef: RefObject<HTMLInputElement | null>;
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
  focusableElements: Array<HTMLElement | null>;
  suggestionIndex: number;
  setSuggestionIndex: (index: number) => void;
  currentQuery: string;
  navigate: UseNavigateResult<string>;
}) {
  return (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      searchInputRef.current?.focus();
      setIsOpened(false);
      return;
    }

    if (event.key === 'Tab') {
      const total = focusableElements.length;
      const shift = event.shiftKey;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[total - 1];
      if (firstElement === null || lastElement === null) return;

      if (shift && document.activeElement === firstElement) {
        lastElement.focus();
        return event.preventDefault();
      }
      if (!shift && document.activeElement === lastElement) {
        firstElement.focus();
        return event.preventDefault();
      }
    }

    if (event.key === 'Enter') {
      if (!isOpened && document.activeElement === searchInputRef.current) {
        setIsOpened(true);
      }
      if (isOpened && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
        setIsOpened(false);

        // noinspection JSIgnoredPromiseFromCall
        navigate({
          to: '/dlc/cards',
          search: (prev) => {
            return { ...prev, query: currentQuery };
          },
        });
      }
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (document.activeElement !== searchInputRef.current) return event.preventDefault();

      const suggestions = focusableElements.filter((el) => el?.parentElement instanceof HTMLLIElement);
      suggestions.unshift(null);

      if (suggestions.length === 0) return;
      const arrowUp = event.key === 'ArrowUp';

      let newIndex = arrowUp ? suggestionIndex - 1 : suggestionIndex + 1;
      if (newIndex < 0) newIndex = suggestions.length - 1;
      if (newIndex >= suggestions.length) newIndex = 0;
      setSuggestionIndex(newIndex);

      return event.preventDefault();
    }
  };
}
