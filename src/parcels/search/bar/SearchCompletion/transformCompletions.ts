import { groupBy } from '@/parcels/groupBy.ts';
import type {
  GeneratedSearchCompletion,
  SearchCompletionState,
} from '@/parcels/search/bar/SearchCompletion/generateCompletions.ts';

export type SearchSuggestion = {
  completion?: GeneratedSearchCompletion;
  userInput?: string;
  fullQuery: string;
};

export function transformCompletions(currentQuery: string, state: SearchCompletionState) {
  const groupedCompletions = groupBy(state.completions, (c) => c.value ?? '');
  const completions = Object.entries(groupedCompletions).map(([_, arr]) => {
    const types = arr.map((c) => c.type ?? '') ?? [];

    return { ...arr[0], types: types };
  });

  return completions.map((compl) => {
    if (state.mode === 'value' && state.userInput?.value !== undefined) {
      let completionValue = compl.value;
      if (completionValue.includes(' ') && !completionValue.endsWith('"')) {
        completionValue = `${completionValue}"`;
      }

      const newQuery = replaceLast(currentQuery, state.userInput?.value as string, completionValue);
      return {
        completion: compl,
        fullQuery: `${newQuery} `,
        userInput: state.userInput?.value,
      } as SearchSuggestion;
    } else if (state.mode === 'filter' && state.userInput?.filter !== undefined) {
      return {
        completion: compl,
        fullQuery: replaceLast(currentQuery, state.userInput?.filter as string, compl.value),
        userInput: state.userInput?.filter,
      } as SearchSuggestion;
    }
    return {
      completion: compl,
      fullQuery: currentQuery,
    };
  });
}

const replaceLast = (str: string, match: string, replacement: string) => {
  const last = str.lastIndexOf(match);
  return last !== -1 ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}` : str;
};
