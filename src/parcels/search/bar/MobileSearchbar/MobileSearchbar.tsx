import { Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconDeviceVisionPro, IconHelpHexagon, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { RefObject } from 'react';
import { MobileTcgSelector } from '@/parcels/search/bar/MobileSearchbar/MobileTcgSelector.tsx';
import { SearchCompletion } from '@/parcels/search/bar/SearchCompletion/SearchCompletion.tsx';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import SearchRecent from '@/parcels/search/bar/SearchRecent/SearchRecent.tsx';
import { useSearchQueryV2 } from '@/parcels/search/useSearchQueryV2.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import styles from './MobileSearchbar.module.css';

type MobileSearchbarProps = {
  close: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
};

export function MobileSearchbar({ close, containerRef }: MobileSearchbarProps) {
  const { tcg, setTcg } = useTcg();
  const {
    currentQuery,
    setCurrentQuery,
    inputRef,
    historyIndex,
    setHistoryIndex,
    suggestionIndex,
    setSuggestionIndex,
    startSearch,
  } = useSearchQueryV2(true, tcg, close);

  const history = useSearchHistory(tcg);
  const recentQueries = history?.pastQueries ?? [];

  const [debouncedQuery] = useDebouncedValue(currentQuery.query, 500);

  return (
    <Stack gap={'xs'}>
      <Group>
        <TextInput
          classNames={{
            root: styles.mantineInputRoot,
            input: styles.mantineInput,
            section: styles.mantineInputSection,
          }}
          ref={inputRef}
          value={currentQuery.query}
          placeholder={'Suche nach Karten..'}
          leftSection={<MobileTcgSelector selectedTcg={tcg} setSelectedTcg={setTcg} />}
          onChange={(event) => {
            const newQuery = event.target.value;
            setCurrentQuery(newQuery);
          }}
        />
        <Button onClick={close} classNames={{ root: styles.closeButton }}>
          <IconX size={18} color={'var(--gourmet-neutral-8)'} />
        </Button>
      </Group>

      <Group ml={'xs'}>
        <div className={styles.help}>
          <IconHelpHexagon size={16} color={'var(--cgm-sidebar-button-bg)'} />
          <Text>Help</Text>
        </div>
        <div className={styles.advancedSearch}>
          <Link to={`/$tcg/advanced`} params={{ tcg: tcg }}>
            <IconDeviceVisionPro size={16} color={'var(--cgm-sidebar-button-bg)'} />
            Advanced Search
          </Link>
        </div>
      </Group>

      <Stack gap={'sm'}>
        {currentQuery.query.length === 0 && (
          <div className={`${styles.typingInfo}`}>
            <p>Beginne zu tippen, um Vorschläge für Filter und Werte zu erhalten.</p>
          </div>
        )}
        {currentQuery.query.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />
          </div>
        )}

        <Stack>
          <Button fz={'0.85rem'} color={'blue'} onClick={startSearch} disabled={currentQuery.query.length === 0}>
            Suche starten
          </Button>
          <Divider my="xs" />
        </Stack>

        {currentQuery.isByUser && currentQuery.query.length > 0 && (
          <SearchCompletion
            tcg={tcg}
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
            tcg={tcg}
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
