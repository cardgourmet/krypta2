import { Group, ScrollArea, SimpleGrid, Tooltip, UnstyledButton } from '@mantine/core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { IconCaretDownFilled, IconCursorText, IconNotebook, IconPlusEqual, IconSearch } from '@tabler/icons-react';
import { type Ref, useMemo, useState } from 'react';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Button } from '@/parcels/generic/Button/Button';
import { FeaturedIcon } from '@/parcels/generic/FeaturedIcon/FeaturedIcon';
import { Input } from '@/parcels/generic/Input/Input';
import { Kicker } from '@/parcels/generic/Kicker/Kicker';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { Tag } from '@/parcels/generic/Tag/Tag';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { Modal } from '@/parcels/modals/Modal';
import type { ExtendModalProps } from '@/parcels/modals/types';
import { useUserLanguage } from '@/parcels/state/useUserLanguage';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg';
import { TcgIcon } from '@/parcels/tcg/TcgIcon';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';
import { useFilters } from '../filter/useFilters';
import styles from './NewFilterGlossaryModal.module.css';

export const NewFilterGlossaryModal = ({
  innerProps: { ref } = {},
  ...props
}: ExtendModalProps<{ ref?: Ref<HTMLDivElement | null> }>) => {
  const { tcg: outerTcg } = useTcg();
  const [tcg, setTcg] = useState(outerTcg);
  const rawFilters = useFilters(tcg);
  const [lang] = useUserLanguage();
  const [query, setQuery] = useState('');

  const filters = useMemo(() => {
    const filters = rawFilters.map(({ filter, translations }) => {
      const translation = translations[lang] ?? translations.en;
      return {
        description: translation.description,
        id: filter.keywords[0],
        inverted: filter.inverted,
        keywords: filter.keywords,
        operators: Array.from(new Set(filter.properties.flatMap((p) => p.operators))),
        properties: filter.properties,
        strict: filter.strictValues,
        tags: [translation.description.toLowerCase(), ...filter.keywords, translation.title.toLowerCase()],
        title: translation.title || capitalizeFirstLetter(filter.keywords[0]),
      };
    });

    filters.sort((a, b) => a.title.localeCompare(b.title));

    if (!query.trim()) return filters;
    return filters.filter((f) => f.tags.some((tag) => tag.includes(query.toLowerCase())));
  }, [lang, query, rawFilters]);

  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>();

  const selectTcg = (newTcg: Tcg) => {
    if (tcg !== newTcg) setSelectedFilter(undefined);
    setTcg(newTcg);
  };

  return (
    <Modal {...props} ref={ref} size="lg">
      <Modal.Content className={styles.base}>
        <Group align="center" gap="1rem" mb="0.5rem" wrap="wrap">
          <FeaturedIcon size="md" variant="secondary">
            <IconNotebook />
          </FeaturedIcon>

          <Modal.Title style={{ marginBlock: 0 }}>Filter Glossary</Modal.Title>
        </Group>

        <Group align="center" justify="space-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={styles.inputButton}
                leadingIcon={<TcgIcon height={20} tcg={tcg} width={20} />}
                size="sm"
                trailingIcon={<IconCaretDownFilled fontSize={12} />}
              >
                {getNameByTcg(tcg)}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent asChild align="start" sideOffset={-4}>
              <Menu>
                <DropdownMenuRadioGroup onValueChange={(value) => selectTcg(value as Tcg)} value={tcg}>
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

          <Input
            leadingSlot={
              <Input.Icon>
                <IconSearch />
              </Input.Icon>
            }
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Suchen…"
            value={query}
          />
        </Group>

        <div className={styles.filters}>
          {filters.map((filter) => (
            <UnstyledButton
              aria-pressed={selectedFilter?.id === filter.id}
              className={styles.filter}
              key={filter.keywords.at(0)}
              onClick={() => setSelectedFilter(filter)}
            >
              <Typeset className={styles.title} size="sm" weight={500}>
                {filter.title}
              </Typeset>
              <span className={styles.keywords}>
                {filter.keywords.map((k) => (
                  <Tag key={k}>{k}</Tag>
                ))}
              </span>
            </UnstyledButton>
          ))}
        </div>
      </Modal.Content>

      <Modal.Footer className={styles.footer}>
        {!selectedFilter && (
          <Typeset block size="sm" style={{ padding: '1rem', width: '100%' }} variant="secondary" weight={500}>
            Sobald du einen Filter auswählst, werden hier mehr Details angezeigt.
          </Typeset>
        )}

        {selectedFilter && (
          <ScrollArea.Autosize className={styles.detailsContainer}>
            <div className={styles.details}>
              <Group align="center" gap="1rem" justify="space-between">
                <Typeset block className={styles.title} weight={600}>
                  {selectedFilter.title}
                </Typeset>

                {(selectedFilter.inverted || selectedFilter.strict) && (
                  <Group gap="0.25rem" style={{ marginBottom: '-3px' }}>
                    {selectedFilter.strict && (
                      <Tooltip label="This filter only allow predefined auto-complete values">
                        <Badge color="red">STRICT</Badge>
                      </Tooltip>
                    )}

                    {selectedFilter.inverted && (
                      <Tooltip label="This filter is inverted by default">
                        <Badge color="orange">INVERTED</Badge>
                      </Tooltip>
                    )}
                  </Group>
                )}
              </Group>

              {selectedFilter.description && (
                <Typeset block style={{ marginTop: '0.125rem' }} variant="secondary">
                  {selectedFilter.description}
                </Typeset>
              )}

              <SimpleGrid cols={2} mt="1.5rem" spacing="1.5rem">
                <div>
                  <Kicker leadingIcon={<IconCursorText />}>Available Keywords</Kicker>
                  <div className={styles.keywords}>
                    {selectedFilter.keywords.map((k) => (
                      <Tag key={k}>{k}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <Kicker leadingIcon={<IconPlusEqual />}>Supported Operators</Kicker>
                  <div className={styles.keywords}>
                    {selectedFilter.operators.map((o) => (
                      <Tag key={o}>{o}</Tag>
                    ))}
                  </div>
                </div>
              </SimpleGrid>
            </div>
          </ScrollArea.Autosize>
        )}
      </Modal.Footer>
    </Modal>
  );
};
