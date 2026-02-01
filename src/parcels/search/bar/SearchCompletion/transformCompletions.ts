import type {
  GeneratedSearchCompletion,
  SearchCompletionState,
} from '@/parcels/search/bar/SearchCompletion/generateCompletions.ts';

export type SearchSuggestion = {
  completion?: GeneratedSearchCompletion;
  fullQuery: string;
};

export function transformCompletions(currentQuery: string, state: SearchCompletionState) {
  return state.completions.map((compl) => {
    console.log("state", state)

    if (state.mode === 'value' && state.userInput?.value !== undefined) {
      let completionValue = compl.value;
      if (completionValue.includes(' ') && !completionValue.endsWith('"')) {
        completionValue = `${completionValue}"`;
      }

      const newQuery = replaceLast(currentQuery, state.userInput?.value as string, completionValue);
      return {
        completion: compl,
        fullQuery: `${newQuery} `,
      } as SearchSuggestion;
    } else if (state.mode === 'filter' && state.userInput?.filter !== undefined) {
      return {
        completion: compl,
        fullQuery: replaceLast(currentQuery, state.userInput?.filter as string, compl.value),
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
