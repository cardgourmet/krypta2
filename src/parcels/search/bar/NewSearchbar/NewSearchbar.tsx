import { ScrollArea, UnstyledButton } from '@mantine/core';
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
  IconArrowsRight,
  IconArrowsShuffle,
  IconArrowUp,
  IconCaretDownFilled,
  IconDirectionSignFilled,
  IconHelp,
  IconNotebook,
  IconSoup,
  IconX,
} from '@tabler/icons-react';
import { Link, useRouter } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { useCallback, useRef, useState } from 'react';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Button } from '@/parcels/generic/Button/Button';
import { Hyperlink } from '@/parcels/generic/Hyperlink/Hyperlink';
import { Input } from '@/parcels/generic/Input/Input';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { NewNewHereModal } from '@/parcels/homepage/Home/NewNewHereModal/NewNewHereModal';
import { modals } from '@/parcels/modals/modals.events';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg';
import { TcgIcon } from '@/parcels/tcg/TcgIcon';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';
import { SearchCompletion } from '../../completion/SearchCompletion';
import { SearchQueryExplanation } from '../../completion/SearchQueryExplanation';
import { NewFilterGlossaryModal } from '../../glossary/NewFilterGlossaryModal';
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
                  title="Current TCG"
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
          placeholder="Search…"
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
            <Hyperlink
              accent={isRandomModeActive ? 'beta' : 'neutral'}
              asChild
              leadingIcon={isRandomModeActive ? <IconArrowsShuffle /> : <IconArrowsRight />}
              size="sm"
            >
              <UnstyledButton
                aria-pressed={isRandomModeActive}
                onClick={() => setRandomModeActive((r) => !r)}
                style={{ marginRight: 'auto' }}
                type="button"
              >
                {isRandomModeActive ? 'Randomized results' : 'No randomized results'}
              </UnstyledButton>
            </Hyperlink>

            <Hyperlink asChild leadingIcon={<IconNotebook />} size="sm">
              <UnstyledButton
                onClick={() =>
                  modals.request('filter-glossary', {
                    component: NewFilterGlossaryModal,
                    innerProps: { ref: registerRef },
                  })
                }
              >
                Filter Glossary
              </UnstyledButton>
            </Hyperlink>

            <Hyperlink asChild leadingIcon={<IconSoup />} size="sm">
              <Link to="/$tcg/kitchen" params={{ tcg: tcg }}>
                Search Kitchen
              </Link>
            </Hyperlink>

            <Hyperlink asChild leadingIcon={<IconHelp />} size="sm">
              <UnstyledButton
                onClick={() =>
                  modals.request('new-here', {
                    component: NewNewHereModal,
                    innerProps: { ref: registerRef },
                  })
                }
              >
                Help
              </UnstyledButton>
            </Hyperlink>
          </div>

          <div className={styles.explanation}>
            {isCaptainOfTheShip ? (
              <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />
            ) : (
              <em>Start typing to see suggestions.</em>
            )}
          </div>

          <ScrollArea.Autosize className={styles.scrollContainer} scrollbarSize={4}>
            <div className={styles.content}>
              {!isCaptainOfTheShip && (
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
              Move selection{' '}
              <kbd>
                <IconArrowUp aria-label="Pfeiltaste hoch" size={12} />
              </kbd>
              <kbd>
                <IconArrowDown aria-label="Pfeiltaste runter" size={12} />
              </kbd>
            </span>

            <span>
              Confirm{' '}
              <kbd>
                <IconArrowBack aria-label="Enter" size={12} />
              </kbd>
            </span>

            <span style={{ marginLeft: 'auto' }}>
              Close search <kbd>esc</kbd>
            </span>
          </footer>
        </div>
      </div>
    </>
  );
};
