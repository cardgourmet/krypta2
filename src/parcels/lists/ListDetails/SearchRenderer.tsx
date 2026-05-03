import {ActionIcon, Group, Tooltip} from '@mantine/core';
import {IconDotsVertical, IconPlayerPlayFilled} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import type {ResolvedUserListResource} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {MoreActionsMenu} from '@/parcels/search/history/MoreActionsMenu.tsx';
import styles from '@/parcels/search/history/SearchHistoryOverview/SearchHistoryOverview.module.css';
import type {UserResolvedSavedSearch} from '@/parcels/search/types.ts';
import {tcgSearchParamsDefaults} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function SearchRenderer({
  tcg,
  data,
  onSearchSaved,
  onRemoveFromList,
}: {
  tcg: Tcg;
  data: ResolvedUserListResource;
  onSearchSaved?: (id: string) => void;
  onRemoveFromList?: (listId: string) => void;
}) {
  const { t } = useTranslation('lists');
  const { listResource, resourceData } = data;
  const resolvedSavedSearch = resourceData as unknown as UserResolvedSavedSearch;
  const search = resolvedSavedSearch.lastSearch ?? resolvedSavedSearch.firstSearch;

  const { user } = useAuth();
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <Group
      key={listResource.resourceId}
      justify={'space-between'}
      style={{
        backgroundColor: 'var(--gourmet-neutral-2)',
        borderRadius: '0.25rem',
      }}
      p={'0.5rem'}
    >
      <GourmetText cgmff={'monospace'} cgmc={'neutral-9'}>
        {search.rawQuery}
      </GourmetText>

      <Group>
        <GourmetText cgmff={'ui'}>
          {t('details.searchCards', { count: resolvedSavedSearch.lastTotalCount ?? 0 })}
        </GourmetText>

        <Group wrap={'nowrap'} gap={'0.25rem'} justify={'end'} p={'0 0.25rem 0 0'}>
          <Link
            to={'/$tcg/cards'}
            params={{ tcg: tcg }}
            search={{
              ...tcgSearchParamsDefaults,
              query: resolvedSavedSearch.firstSearch.rawQuery,
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
              <MoreActionsMenu
                type={'user_search'}
                tcg={tcg}
                resourceId={resolvedSavedSearch.savedSearch.id}
                rawResourceId={resolvedSavedSearch.firstSearch.id}
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
                onRemoveFromList={(listId) => {
                  if (onRemoveFromList) onRemoveFromList(listId);
                }}
              />
            </Tooltip>
          )}
        </Group>
      </Group>
    </Group>
  );
}
