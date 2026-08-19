import { Group, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { IconArrowsShuffle, IconCaretDownFilled, IconHelp, IconNotebook, IconSoup, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Button } from '@/parcels/generic/Button/Button';
import { Input } from '@/parcels/generic/Input/Input';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { NewNewHereModal } from '@/parcels/homepage/Home/NewNewHereModal/NewNewHereModal';
import { modals } from '@/parcels/modals/modals.events';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg';
import { TcgIcon } from '@/parcels/tcg/TcgIcon';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';
import { SearchRecentSuggestions } from '../bar/SearchRecent/SearchRecentSuggestions';
import { useClickOutsideWithRegistry } from '../bar/useClickOutsideWithRegistry';
import { SearchCompletion } from '../completion/SearchCompletion';
import { SearchQueryExplanation } from '../completion/SearchQueryExplanation';
import { NewFilterGlossaryModal } from '../glossary/NewFilterGlossaryModal';
import { useSearchQuery } from '../useSearchQuery';
import styles from './SearchDrawer.module.css';

export const SearchDrawer = ({ onClose }: { onClose?: () => void }) => {
  const { tcg, setTcg } = useTcg();
  const [isRandomModeActive, setRandomModeActive] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const registerRef = useClickOutsideWithRegistry(close, true);

  const {
    currentQuery,
    setQueryString,
    setQueryWrapper,
    inputRef,
    selectionIndex,
    setSelectionIndex,
    suggestionIndex,
    setSuggestionIndex,
    startSearch,
  } = useSearchQuery(true, tcg, close, isRandomModeActive);

  const [debouncedQuery] = useDebouncedValue(currentQuery.query, 500);
  const isCaptainOfTheShip = currentQuery.isByUser ?? false;

  return (
    <Stack align="start" gap="1rem">
      <Group gap="0.75rem" w="100%" wrap="nowrap">
        <Input
          containerClassName={styles.input}
          data-autofocus
          leadingSlot={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={styles.inputButton}
                  style={{
                    marginLeft: '0.375rem',
                  }}
                  title="Aktuelles TCG"
                  trailingIcon={<IconCaretDownFilled fontSize={12} />}
                  variant="tertiary"
                >
                  <TcgIcon height={20} tcg={tcg} width={20} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent asChild align="start" sideOffset={-4}>
                <Menu>
                  <DropdownMenuRadioGroup onValueChange={(value) => setTcg(value as Tcg)} value={tcg}>
                    <Menu.DropdownRadioItem icon={<TcgIcon height={20} tcg="mtg" width={20} />} value="mtg">
                      {getNameByTcg('mtg')}
                    </Menu.DropdownRadioItem>
                    <Menu.DropdownRadioItem icon={<TcgIcon height={20} tcg="pcg" width={20} />} value="pcg">
                      {getNameByTcg('pcg')}
                    </Menu.DropdownRadioItem>
                    <Menu.DropdownRadioItem icon={<TcgIcon height={20} tcg="dlc" width={20} />} value="dlc">
                      {getNameByTcg('dlc')}
                    </Menu.DropdownRadioItem>
                  </DropdownMenuRadioGroup>
                </Menu>
              </DropdownMenuContent>
            </DropdownMenu>
          }
          onChange={(event) => setQueryString(event.target.value)}
          placeholder="Suchen…"
          ref={inputRef}
          trailingSlot={
            currentQuery.query && (
              <ActionButton
                className={styles.inputButton}
                onClick={() => {
                  setQueryWrapper({ query: '', isByUser: false });
                  inputRef.current?.focus();
                }}
                size="sm"
                style={{
                  aspectRatio: 1,
                  marginRight: '0.375rem',
                  minWidth: 0,
                }}
                title="Clear"
                variant="tertiary"
              >
                <IconX />
              </ActionButton>
            )
          }
          type="text"
          value={currentQuery.query}
        />

        <ActionButton onClick={onClose} size="sm">
          <IconX />
        </ActionButton>
      </Group>

      <Group gap="0.25rem" mt="-0.5rem" w="100%" wrap="nowrap">
        <Button
          accent="brand"
          leadingIcon={<IconNotebook />}
          onClick={() => {
            onClose?.();
            modals.request('filter-glossary', {
              component: NewFilterGlossaryModal,
              innerProps: {},
            });
          }}
          size="sm"
          variant="tertiary"
        >
          Alle Filter
        </Button>
        <Button accent="brand" asChild leadingIcon={<IconSoup />} size="sm" variant="tertiary">
          <Link to="/$tcg/kitchen" params={{ tcg: tcg }}>
            Suchküche
          </Link>
        </Button>
        <Button
          accent="brand"
          leadingIcon={<IconHelp />}
          onClick={() => {
            onClose?.();
            modals.request('new-here', {
              component: NewNewHereModal,
              innerProps: {},
            });
          }}
          size="sm"
          variant="tertiary"
        >
          Hilfe
        </Button>
      </Group>

      <div className={styles.explanation}>
        {isCaptainOfTheShip ? (
          <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />
        ) : (
          <em>Tippen, um Suchvorschläge angezeigt zu bekommen.</em>
        )}
      </div>

      <Group gap="0.25rem" w="100%" wrap="nowrap">
        <Button style={{ flex: 1 }}>Suche starten{isRandomModeActive && ' (randomisiert)'}</Button>
        <ActionButton
          accent={isRandomModeActive ? 'beta' : 'neutral'}
          onClick={() => setRandomModeActive((r) => !r)}
          variant={isRandomModeActive ? 'primary' : 'tertiary'}
        >
          <IconArrowsShuffle />
        </ActionButton>
      </Group>

      <div style={{ alignSelf: 'stretch', marginTop: '1rem', maxWidth: '100%' }}>
        {!isCaptainOfTheShip && (
          <SearchRecentSuggestions
            maxEntries={{ history: 5, saved: 3 }}
            registerRef={registerRef}
            searchContainerRef={searchContainerRef}
            searchInputRef={inputRef}
            selectionIndex={selectionIndex}
            setIsOpened={() => void 0}
            setQueryWrapper={setQueryWrapper}
            setSelectionIndex={setSelectionIndex}
          />
        )}

        {isCaptainOfTheShip && currentQuery.query.length > 0 && (
          <SearchCompletion
            currentQuery={currentQuery.query}
            isOpened
            searchInputRef={inputRef}
            setQuery={setQueryWrapper}
            setSuggestionIndex={setSuggestionIndex}
            suggestionIndex={suggestionIndex}
            tcg={tcg}
          />
        )}
      </div>
    </Stack>
  );
};
