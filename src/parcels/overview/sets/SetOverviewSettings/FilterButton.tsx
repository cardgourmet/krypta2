import { Center, Group, Popover, Stack, UnstyledButton } from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { Button } from '@/parcels/generic/Button/Button.tsx';
import { GourmetMultiSelect } from '@/parcels/generic/mantine/GourmetMultiSelect/GourmetMultiSelect.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from '@/parcels/overview/sets/SetOverviewSettings/SetOverviewSettings.module.css';
import { countFilters, type SetFilters } from '@/parcels/overview/sets/SetOverviewSettings/setFilters.ts';

export function FilterButton({
  filters,
  setFilters,
  clearFilters,
  metaData,
}: {
  filters: SetFilters;
  setFilters: (f: SetFilters) => void;
  clearFilters: () => void;
  metaData: { types: string[] };
}) {
  const { t } = useTranslation('sets', { keyPrefix: 'settings.filters' });
  const filterCount = countFilters(filters);

  const typeData = useMemo(() => {
    return metaData.types
      .sort((a, b) => a.localeCompare(b))
      .map((t) => {
        return { value: t, label: capitalizeFirstLetter(t) };
      });
  }, [metaData.types]);

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
      <Popover.Dropdown
        style={{ backgroundColor: 'var(--gourmet-neutral-2)', borderColor: 'var(--gourmet-neutral-4)' }}
      >
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
