import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconDotsVertical, IconPlayerPlayFilled } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { MoreListActionsMenu } from '@/parcels/lists/MoreListActionsMenu/MoreListActionsMenu.tsx';
import styles from '@/parcels/search/history/SearchHistoryOverview/SearchHistoryOverview.module.css';
import type { TableEntryProps } from '@/parcels/search/saved/SavedSearchesOverview.tsx';
import { tcgSearchParamsDefaults } from '@/parcels/tcg/types.ts';

export function HorTableRow({ entry, data, tableData, tcg, onSearchSaved, onSearchUnsaved }: TableEntryProps) {
  const { t } = useTranslation('saved');
  const [menuOpened, setMenuOpened] = useState(false);
  const { user } = useAuth();

  return (
    <tr key={entry.savedSearch.id} data-selected={false} style={{ padding: '0 1rem' }}>
      <td style={{ height: '2.5rem' }}>{''}</td>
      {tableData.columns.map((column) => (
        <td key={column}>{data[column]}</td>
      ))}
      <td>
        <Group wrap={'nowrap'} gap={'0.25rem'} justify={'end'} p={'0 0.25rem 0 0'}>
          <Link
            to={'/$tcg/cards'}
            params={{ tcg: tcg }}
            search={{
              ...tcgSearchParamsDefaults,
              query: entry.firstSearch.rawQuery,
            }}
            target="_blank"
            rel="noreferrer noopener"
            style={{ padding: 0 }}
          >
            <Tooltip label={t('table.reExecute')} openDelay={500}>
              <ActionIcon style={{ pointerEvents: 'auto' }} className={styles.playButton}>
                <IconPlayerPlayFilled size={18} color={'var(--gourmet-blue-1)'} style={{ flexShrink: 0 }} />
              </ActionIcon>
            </Tooltip>
          </Link>

          {user?.id && (
            <Tooltip label={t('table.moreOptions')} openDelay={500}>
              <MoreListActionsMenu
                type={'user_search'}
                tcg={tcg}
                resourceId={entry.savedSearch.id}
                rawResourceId={entry.firstSearch.id}
                target={
                  <ActionIcon
                    style={{ pointerEvents: 'auto' }}
                    color="var(--gourmet-neutral-dark-4)"
                    className={styles.moreButton}
                  >
                    <IconDotsVertical size={18} color={'var(--gourmet-neutral-8)'} style={{ flexShrink: 0 }} />
                  </ActionIcon>
                }
                menuOpened={menuOpened}
                setMenuOpened={setMenuOpened}
                onAddedToList={(res) => {
                  if (onSearchSaved) onSearchSaved(res);
                }}
                onRemovedFromList={(resourceId) => {
                  if (onSearchUnsaved) onSearchUnsaved(resourceId);
                }}
              />
            </Tooltip>
          )}
        </Group>
      </td>
    </tr>
  );
}
