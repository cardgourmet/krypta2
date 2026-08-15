import { ScrollArea, Stack } from '@mantine/core';
import { useDebouncedValue, useFocusTrap, useMergedRef } from '@mantine/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import {
  IconArrowBack,
  IconArrowDown,
  IconArrowsShuffle,
  IconArrowUp,
  IconCaretDownFilled,
  IconDirectionSignFilled,
  IconHelp,
  IconNotebook,
  IconSoup,
  IconX,
} from '@tabler/icons-react';
import { useRouter } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { useCallback, useRef, useState } from 'react';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Button } from '@/parcels/generic/Button/Button';
import { Hyperlink } from '@/parcels/generic/Hyperlink/Hyperlink';
import { Input } from '@/parcels/generic/Input/Input';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg';
import { TcgIcon } from '@/parcels/tcg/TcgIcon';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';
import { SearchCompletion } from '../../completion/SearchCompletion';
import { SearchQueryExplanation } from '../../completion/SearchQueryExplanation';
import { useSearchQuery } from '../../useSearchQuery';
import { SearchRecentSuggestions } from '../SearchRecent/SearchRecentSuggestions';
import { useClickOutsideWithRegistry } from '../useClickOutsideWithRegistry';
import styles from './NewSearchbar.module.css';

export const NewSearchbar = () => {
  const router = useRouter();
  const { tcg, setTcg } = useTcg();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isActive, setActive] = useState(false);
  const [isRandomModeActive, setRandomModeActive] = useState(false);

  const close = useCallback(() => setActive(false), []);
  const focusTrapRef = useFocusTrap(isActive);
  const registerRef = useClickOutsideWithRegistry(close, isActive);
  const ref = useMergedRef(searchContainerRef, focusTrapRef, registerRef);

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
  } = useSearchQuery(isActive, tcg, close, isRandomModeActive);

  const [debouncedQuery] = useDebouncedValue(currentQuery.query, 500);
  const isCaptainOfTheShip = currentQuery.isByUser ?? false;

  router.subscribe('onLoad', () => {
    requestAnimationFrame(close);
  });

  return (
    <>
      <div aria-hidden className={clsx(styles.overlay, isActive && styles.isVisible)} />

      <div className={styles.base} ref={ref}>
        <Input
          className={styles.input}
          data-autofocus
          leadingSlot={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={styles.inputButton}
                  style={{
                    marginLeft: '0.375rem',
                  }}
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
          onClick={() => setActive(true)}
          onFocus={() => setActive(true)}
          placeholder="Suchen…"
          ref={inputRef}
          trailingSlot={
            currentQuery.query && (
              <>
                <ActionButton
                  className={styles.inputButton}
                  onClick={() => {
                    setQueryWrapper({ query: '', isByUser: false });
                    inputRef.current?.focus();
                  }}
                  size="sm"
                  style={{
                    aspectRatio: 1,
                    marginRight: '0.125rem',
                    minWidth: 0,
                  }}
                  title="Clear"
                  variant="tertiary"
                >
                  <IconX />
                </ActionButton>
                <ActionButton
                  accent="brand"
                  className={styles.inputButton}
                  onClick={startSearch}
                  size="sm"
                  style={{
                    aspectRatio: 1,
                    marginRight: '0.375rem',
                    minWidth: 0,
                  }}
                  title="Send it!"
                  variant="tertiary"
                >
                  <IconDirectionSignFilled />
                </ActionButton>
              </>
            )
          }
          type="text"
          value={currentQuery.query}
        />

        <div className={clsx(styles.panel, styles.topAttached, isActive && styles.isVisible)}>
          <div className={styles.actions}>
            <Hyperlink accent="beta" leadingIcon={<IconArrowsShuffle />} size="sm" style={{ marginRight: 'auto' }}>
              Zufall
            </Hyperlink>
            <Hyperlink leadingIcon={<IconNotebook />} size="sm">
              Alle Filter
            </Hyperlink>
            <Hyperlink leadingIcon={<IconSoup />} size="sm">
              Suchküche
            </Hyperlink>
            <Hyperlink leadingIcon={<IconHelp />} size="sm">
              Hilfe
            </Hyperlink>
          </div>

          <div className={styles.explanation}>
            {isCaptainOfTheShip ? (
              <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />
            ) : (
              <em>Tippen, um Suchvorschläge angezeigt zu bekommen.</em>
            )}
          </div>

          <ScrollArea.Autosize className={styles.scrollContainer} scrollbarSize={4}>
            <div className={styles.content}>
              {!isCaptainOfTheShip && (
                <Stack gap="1.5rem">
                  <SearchRecentSuggestions
                    maxEntries={{ history: 5, saved: 3 }}
                    registerRef={registerRef}
                    searchContainerRef={searchContainerRef}
                    searchInputRef={inputRef}
                    selectionIndex={selectionIndex}
                    setIsOpened={setActive}
                    setQueryWrapper={setQueryWrapper}
                    setSelectionIndex={setSelectionIndex}
                  />
                </Stack>
              )}

              {isCaptainOfTheShip && currentQuery.query.length > 0 && (
                <SearchCompletion
                  currentQuery={currentQuery.query}
                  isOpened={isActive}
                  searchInputRef={inputRef}
                  setQuery={setQueryWrapper}
                  setSuggestionIndex={setSuggestionIndex}
                  suggestionIndex={suggestionIndex}
                  tcg={tcg}
                />
              )}
            </div>
          </ScrollArea.Autosize>

          <footer className={styles.keybinds}>
            <span>
              Navigieren{' '}
              <kbd>
                <IconArrowUp size={12} />
              </kbd>
              <kbd>
                <IconArrowDown size={12} />
              </kbd>
            </span>

            <span>
              Auswählen{' '}
              <kbd>
                <IconArrowBack size={12} />
              </kbd>
            </span>

            <span>
              Suche schließen <kbd>esc</kbd>
            </span>
          </footer>
        </div>
      </div>
    </>
  );
};
