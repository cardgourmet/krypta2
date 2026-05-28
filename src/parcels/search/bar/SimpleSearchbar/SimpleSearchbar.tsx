import { Button, Center, Group, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '@/parcels/lists/ListsOverview/DesktopListOverviewSettings/ListOverviewSettings.module.css';

export function SimpleSearchbar({ onChange, value }: { onChange?: (query: string) => void; value?: string }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.settings' });

  const [searchQuery, setSearchQuery] = useState<string>(value ?? '');
  useEffect(() => {
    setSearchQuery(value ?? '');
  }, [value]);

  return (
    <Group gap={0} className={styles.searchBarWrapper}>
      <TextInput
        className={styles.searchBarInput}
        placeholder={t('searchbarPlaceholder')}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        value={searchQuery}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            if (onChange) onChange(searchQuery);
          }
        }}
      />
      <Button
        className={styles.searchBarButton}
        color={'var(--gourmet-blue-1)'}
        onClick={() => {
          if (onChange) onChange(searchQuery);
        }}
      >
        <Center>
          <IconSearch size={16} color={'var(--gourmet-neutral-1)'} />
        </Center>
      </Button>
    </Group>
  );
}
