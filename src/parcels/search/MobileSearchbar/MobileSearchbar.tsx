import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { type RefObject, useState } from 'react';
import { MobileTcgSelector } from '@/parcels/search/MobileSearchbar/MobileTcgSelector.tsx';
import { SearchCompletion } from '@/parcels/search/SearchCompletion/SearchCompletion.tsx';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider/SearchHistoryProvider.tsx';
import SearchRecent from '@/parcels/search/SearchRecent/SearchRecent.tsx';
import { useSearchQueryV2 } from '@/parcels/search/useSearchQueryV2.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './MobileSearchbar.module.css';

type MobileSearchbarProps = {
  close: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
};

export function MobileSearchbar({ close, containerRef }: MobileSearchbarProps) {
  const tcg = useTcgByLocation() ?? 'dlc';
  const [selectedTcg, setSelectedTcg] = useState<Tcg>(tcg);
  const {
    currentQuery,
    setCurrentQuery,
    inputRef,
    historyIndex,
    setHistoryIndex,
    suggestionIndex,
    setSuggestionIndex,
  } = useSearchQueryV2(true, selectedTcg, close);

  const history = useSearchHistory(selectedTcg);
  const recentQueries = history?.pastQueries ?? [];

  return (
    <Stack>
      <Group>
        <TextInput
          classNames={{
            root: styles.testInputRoot,
            input: styles.testInput,
            section: styles.testInputSection,
          }}
          ref={inputRef}
          value={currentQuery.query}
          placeholder={'Suche nach Karten..'}
          leftSection={<MobileTcgSelector selectedTcg={selectedTcg} setSelectedTcg={setSelectedTcg} />}
          onChange={(event) => {
            const newQuery = event.target.value;
            setCurrentQuery(newQuery);
          }}
        />
        <Button onClick={close}>
          <IconX size={16} color={'var(--gourmet-neutral-8)'} />
        </Button>
      </Group>

      <Group>
        <Text>Help</Text>
        <Link to={`/${tcg as Tcg}/advanced`}>Advanced Search</Link>
      </Group>

      <Stack>
        {currentQuery.query.length === 0 && (
          <Text>Beginne zu Tippen um Vorschläge zu bekommen / Query Explanation</Text>
        )}

        {currentQuery.isByUser && currentQuery.query.length > 0 && (
          <SearchCompletion
            tcg={selectedTcg}
            currentQuery={currentQuery.query}
            suggestionIndex={suggestionIndex}
            setSuggestionIndex={setSuggestionIndex}
            isOpened={true}
            setQuery={setCurrentQuery}
            searchInputRef={inputRef}
          />
        )}

        {!currentQuery.isByUser && recentQueries.length > 0 && (
          <SearchRecent
            tcg={selectedTcg}
            close={close}
            setQuery={setCurrentQuery}
            historyIndex={historyIndex}
            setHistoryIndex={setHistoryIndex}
            searchContainerRef={containerRef}
            searchInputRef={inputRef}
          />
        )}
      </Stack>
    </Stack>
  );
}
