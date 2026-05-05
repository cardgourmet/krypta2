import {ActionIcon, Group, Tooltip} from '@mantine/core';
import {IconDotsVertical, IconPlayerPlayFilled} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {MoreActionsMenu} from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from '@/parcels/search/history/SearchHistoryOverview/SearchHistoryOverview.module.css';
import type {TableEntryProps} from '@/parcels/search/saved/SavedSearchesOverview.tsx';
import {tcgSearchParamsDefaults} from '@/parcels/tcg/types.ts';

export function VerTableRow({ entry, data, tableData, tcg, onSearchSaved }: TableEntryProps) {
  const { t } = useTranslation('history');
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <>
      {tableData.columns.map((column) => (
        <tr key={`${column}`} data-cell={'not-last'}>
          <th style={{ width: '5.25rem' }}>{column}</th>
          <td data-selected={false}>{data[column]}</td>
        </tr>
      ))}
      <tr key={`tools-1`} data-cell={'last'}>
        <th style={{ width: '5.25rem' }}>
          <GourmetText cgmc={'neutral-5'}>Tools</GourmetText>
        </th>
        <td data-selected={false}>
          <Group wrap={'nowrap'} gap={'0.25rem'} justify={'space-between'} p={'0 0.25rem 0 0'}>
            <Link
              to={'/$tcg/cards'}
              params={{ tcg: tcg }}
              search={{
                ...tcgSearchParamsDefaults,
                query: entry.firstSearch.rawQuery,
              }}
              style={{ padding: 0 }}
            >
              <Tooltip label={t('table.reExecute')} openDelay={500}>
                <ActionIcon style={{ pointerEvents: 'auto' }} className={styles.playButton}>
                  <IconPlayerPlayFilled size={18} color={'var(--gourmet-blue-1)'} style={{ flexShrink: 0 }} />
                </ActionIcon>
              </Tooltip>
            </Link>

            <Tooltip label={t('table.moreOptions')} openDelay={500}>
              <MoreActionsMenu
                type={'user_search'}
                tcg={tcg}
                resourceId={entry.savedSearch?.id}
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
                onSearchSaved={(id) => {
                  if (onSearchSaved) onSearchSaved(id);
                }}
              />
            </Tooltip>
          </Group>
        </td>
      </tr>
    </>
  );
}
