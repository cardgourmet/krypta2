import { Center, Group, Popover, Stack, UnstyledButton } from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { type FieldToken, type LiqeQuery, type LiteralExpressionToken, parse } from 'liqe';
import { startTransition, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/parcels/generic/Button/Button.tsx';
import { GourmetMultiSelect } from '@/parcels/generic/mantine/GourmetMultiSelect/GourmetMultiSelect.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { TextDropdown } from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import { groupBy } from '@/parcels/groupBy.ts';
import { SimpleSearchbar } from '@/parcels/search/bar/SimpleSearchbar/SimpleSearchbar.tsx';
import { type SortDirection, sortDirections, type TcgSetGroupBy, type TcgSetSortBy } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import styles from './SetOverviewSettings.module.css';

export type OverviewSettings = {
  group: TcgSetGroupBy;
  order: SortDirection;
  q: string;
  sort: TcgSetSortBy;
  sortOrder: SortDirection;
};

export function SetOverviewSettings({
  tcg,
  overviewSettings,
  setOverviewSettings,
}: {
  tcg: Tcg;
  overviewSettings: OverviewSettings;
  setOverviewSettings: (update: ApplyFn<OverviewSettings>) => void;
}) {
  const { t } = useTranslation('sets', { keyPrefix: 'settings' });

  const fillTranslation = useCallback(
    (prefix: string, elements: string[]) => {
      const items: Record<string, string> = {};
      elements.forEach((sortBy) => {
        items[sortBy as string] = t(`${prefix}.${(sortBy as string).toLowerCase()}`);
      });
      return items;
    },
    [t],
  );
  const groupByItems = useMemo(() => {
    const groupBys = ['year'];
    if (tcg === 'pcg') {
      groupBys.push('era');
    }

    const items: Record<string, string> = fillTranslation('groupBy', groupBys as string[]);
    return items;
  }, [tcg, fillTranslation]);
  const sortDirItems = fillTranslation('sortdir', sortDirections as readonly SortDirection[] as string[]);
  const sortByItems = useMemo(() => {
    const sortBys = ['released', 'prints', 'name'];

    const items: Record<string, string> = fillTranslation('sortBy', sortBys as string[]);
    return items;
  }, [fillTranslation]);

  const navigate = useNavigate();
  const [settings, setSettings] = useState<OverviewSettings>({ ...overviewSettings });

  const [filters, setFilters] = useState<Filters>(deserializeFilterString(overviewSettings.q));
  const setFiltersWrapped = useCallback(
    (f: Filters) => {
      setFilters(f);

      startTransition(() => {
        // noinspection JSIgnoredPromiseFromCall
        navigate({
          to: '/$tcg/sets',
          search: () => {
            return { ...settings, q: serializeFilters(f) };
          },
          params: {
            tcg: tcg,
          },
          replace: true,
        });
      });
    },
    [navigate, settings, tcg],
  );

  return (
    <Stack>
      <Group justify={'space-between'}>
        <Group gap={'1rem'}>
          <Group gap={'0.25rem'}>
            <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
              {t('common.groupBy')}
            </GourmetText>
            <TextDropdown
              items={groupByItems}
              t={t}
              transPrefix={'groupBy'}
              defaultSelected={settings.group}
              onSelect={(sel) => {
                setSettings({ ...settings, group: sel as TcgSetGroupBy });

                startTransition(() => {
                  setOverviewSettings((prev) => {
                    return { ...prev, group: sel as TcgSetGroupBy };
                  });
                });
              }}
            />
            <TextDropdown
              items={sortDirItems}
              t={t}
              transPrefix={'sortdir'}
              defaultSelected={settings.order}
              onSelect={(sel) => {
                setSettings({ ...settings, order: sel as SortDirection });

                startTransition(() => {
                  setOverviewSettings((prev) => {
                    return { ...prev, order: sel as SortDirection };
                  });
                });
              }}
            />
          </Group>
          <Group gap={'0.25rem'}>
            <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
              {t('common.sortBy')}
            </GourmetText>
            <TextDropdown
              items={sortByItems}
              t={t}
              transPrefix={'sortBy'}
              defaultSelected={settings.sort}
              onSelect={(sel) => {
                setSettings({ ...settings, sort: sel as TcgSetSortBy });

                startTransition(() => {
                  setOverviewSettings((prev) => {
                    return { ...prev, sort: sel as TcgSetSortBy };
                  });
                });
              }}
            />
            <TextDropdown
              items={sortDirItems}
              t={t}
              transPrefix={'sortdir'}
              defaultSelected={settings.sortOrder}
              onSelect={(sel) => {
                setSettings({ ...settings, sortOrder: sel as SortDirection });

                startTransition(() => {
                  setOverviewSettings((prev) => {
                    return { ...prev, sortOrder: sel as SortDirection };
                  });
                });
              }}
            />
          </Group>
        </Group>

        <Group gap={'0.5rem'}>
          <FilterButton
            filters={filters}
            setFilters={setFilters}
            clearFilters={() => setFiltersWrapped({ ...defaultFilters, name: filters.name })}
          />
          <SimpleSearchbar
            value={filters.name}
            onChange={(searchQuery) => {
              setFiltersWrapped({ ...filters, name: searchQuery });
            }}
          />
        </Group>
      </Group>
    </Stack>
  );
}

type FilterExpression = {
  filter: string;
  operator: '=';
  value: string;
};
function extractFilterExpression(liqe: LiqeQuery): FilterExpression[] {
  const type = liqe.type;
  if (type === 'LogicalExpression') {
    if (liqe.operator.operator === 'OR') return [];

    const leftExpressions = extractFilterExpression(liqe.left);
    const rightExpressions = extractFilterExpression(liqe.right);

    return [...leftExpressions, ...rightExpressions];
  }
  if (type === 'Tag') {
    const filter = (liqe.field as FieldToken).name;
    const value = (liqe.expression as LiteralExpressionToken).value;
    const expression = {
      filter: filter,
      operator: '=' as '=',
      value: value?.toString() ?? '',
    };

    return [expression];
  }
  return [];
}

function deserializeFilterString(q: string): Filters {
  const tokens = parse(q);
  const filterAndValues = groupBy(extractFilterExpression(tokens), (e) => e.filter) as Record<
    FilterKeys,
    FilterExpression[]
  >;

  const filters: Filters = { ...defaultFilters };
  if (filterAndValues.name) {
    const values = filterAndValues.name;

    if (values.length > 0) {
      filters.name = values[0].value;
    }
  }
  if (filterAndValues.types) {
    const values = filterAndValues.types;

    if (values.length > 0) {
      filters.types = values.map((v) => v.value);
    }
  }

  return filters;
}

function serializeFilters(filters: Filters): string {
  const parts: string[] = [];
  if (filters.name) {
    parts.push(`name:"${filters.name}"`);
  }
  if (filters.types) {
    for (const type of filters.types) {
      parts.push(`types:"${type}"`);
    }
  }

  return parts.join(' ');
}

type FilterKeys = 'name' | 'types';
type Filters = {
  name: string;
  types: string[];
};
const defaultFilters = {
  name: '',
  types: [],
};

function countFilters(filters: Filters): number {
  let count = 0;
  if (filters.types.length > 0) {
    count++;
  }

  return count;
}

function FilterButton({
  filters,
  setFilters,
  clearFilters,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  clearFilters: () => void;
}) {
  const { t } = useTranslation('sets', { keyPrefix: 'settings.filters' });
  const filterCount = countFilters(filters);

  const typeData = useMemo(() => {
    return [
      { value: 'expansion', label: 'Expansion' },
      { value: 'core', label: 'Core' },
      { value: 'eternal', label: 'Eternal' },
    ];
  }, []);

  return (
    <Popover position="bottom-start" shadow="md" width={275}>
      <Popover.Target>
        <UnstyledButton className={styles.filterButton} data-active={filterCount > 0}>
          <Center>
            <Group gap={'0.25rem'}>
              <IconFilter size={22} color={'var(--gourmet-neutral-9)'} />

              {filterCount > 0 && (
                <GourmetText className={styles.numberBadge} fz={'0.75rem'} cgmc={'neutral-9'}>
                  {filterCount}
                </GourmetText>
              )}
            </Group>
          </Center>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Group justify={'space-between'}>
            <GourmetText cgmff={'ui'} fw={600} fz={'1.2rem'}>
              {t('title')}
            </GourmetText>

            {filterCount > 0 && (
              <Button trailingIcon={<IconX />} variant={'secondary'} size={'sm'} onClick={clearFilters}>
                <GourmetText>{t('clear')}</GourmetText>
              </Button>
            )}
          </Group>

          <Stack gap={'0.25rem'}>
            <GourmetText cgmff={'ui'}>Type</GourmetText>
            <GourmetMultiSelect
              placeholder={'Choose'}
              w={'100%'}
              maw={'100%'}
              data={typeData}
              value={filters.types}
              onChange={(sel) => {
                setFilters({ ...filters, types: sel });
              }}
              searchable
              comboboxProps={{ withinPortal: false }}
            />
          </Stack>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
