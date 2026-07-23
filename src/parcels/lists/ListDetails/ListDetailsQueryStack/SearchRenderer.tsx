import { ActionIcon, Checkbox, Group, Tooltip, UnstyledButton } from '@mantine/core';
import { IconDotsVertical, IconPlayerPlayFilled } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { ListDetailsActionMenu } from '@/parcels/lists/ListDetails/ListDetailsActionMenu/ListDetailsActionMenu.tsx';
import type { ResolvedUserListResource, UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import type { UserResolvedSavedSearch } from '@/parcels/search/types.ts';
import { useListDetailsWorkStore } from '@/parcels/selection/useListDetailsWorkStore.tsx';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import { tcgSearchParamsDefaults } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { DataUser } from '@/parcels/user/api.ts';
import styles from './SearchRenderer.module.css';

export function SearchRenderer({
  owner,
  list,
  data,
  onAddToList,
  onRemoveFromList,
  index,
}: {
  owner: DataUser;
  list: UserListWithResources;
  data: ResolvedUserListResource;
  onAddToList?: (res: UserListResource) => void;
  onRemoveFromList?: (listId: string) => void;
  index: number;
}) {
  const { t } = useTranslation('lists');
  const { listResource, resourceData } = data;
  const resolvedSavedSearch = resourceData as unknown as UserResolvedSavedSearch;
  const search = resolvedSavedSearch.lastSearch ?? resolvedSavedSearch.firstSearch;

  const thisId = resolvedSavedSearch.savedSearch.id;

  const { user } = useAuth();
  const [menuOpened, setMenuOpened] = useState(false);

  const isSelectionMode = useListDetailsWorkStore((state) => state.isSelectionMode);
  const isSelected = useListDetailsWorkStore((state) => {
    return state.data?.selection?.elementDataById?.[resolvedSavedSearch.savedSearch.id] !== undefined;
  });
  const setSelectionWithCheck = useListDetailsWorkStore((state) => state.setSelectionWithCheck);

  return (
    <>
      {!isSelectionMode && (
        <Group
          key={listResource.resourceId}
          justify={'space-between'}
          style={{
            backgroundColor: 'var(--gourmet-neutral-2)',
            borderRadius: '0.25rem',
            border: '1px solid transparent',
          }}
          p={'0.5rem 1rem'}
          wrap={'nowrap'}
          h={'3rem'}
          className={styles.queryGroup}
        >
          <Group>
            <Group w={'2rem'} justify={'center'}>
              {user && (
                <>
                  <TcgIcon tcg={resolvedSavedSearch.savedSearch.game as Tcg} className={styles.tcgIcon} />
                  <Checkbox
                    style={{ pointerEvents: 'auto' }}
                    onClick={(event) => {
                      setSelectionWithCheck([thisId], event.currentTarget.checked, event.shiftKey, thisId, index);
                    }}
                    color={list.list.color ?? 'var(--gourmet-orange-1)'}
                    checked={isSelected}
                    className={styles.selectCheckbox}
                  />
                </>
              )}
              {!user && <TcgIcon tcg={resolvedSavedSearch.savedSearch.game as Tcg} />}
            </Group>

            <GourmetText
              cgmff={'monospace'}
              cgmc={'neutral-9'}
              style={{
                textWrap: 'nowrap',
                overflowX: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {search.rawQuery}
            </GourmetText>
          </Group>

          <Group wrap={'nowrap'}>
            <GourmetText cgmff={'ui'} style={{ textWrap: 'nowrap' }}>
              {t('details.searchCards', { count: resolvedSavedSearch.lastTotalCount ?? 0 })}
            </GourmetText>

            <Group wrap={'nowrap'} gap={'0.25rem'} justify={'end'} p={'0 0.25rem 0 0'}>
              <Link
                to={'/$tcg/cards'}
                params={{ tcg: resolvedSavedSearch.savedSearch.game }}
                search={{
                  ...tcgSearchParamsDefaults,
                  query: resolvedSavedSearch.firstSearch.rawQuery,
                  manual: true,
                }}
                target="_blank"
                rel="noreferrer noopener"
                style={{ padding: 0 }}
                preload={false}
              >
                <Tooltip label={t('table.reExecute')} openDelay={500}>
                  <ActionIcon style={{ pointerEvents: 'auto' }} className={styles.playButton}>
                    <IconPlayerPlayFilled
                      size={18}
                      color={list.list.color ?? 'var(--gourmet-blue-1)'}
                      style={{ flexShrink: 0 }}
                    />
                  </ActionIcon>
                </Tooltip>
              </Link>

              {user?.id && (
                <ListDetailsActionMenu
                  owner={owner}
                  type={'user_search'}
                  listContext={list}
                  tcg={resolvedSavedSearch.savedSearch.game as Tcg}
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
                  onAddedToList={onAddToList}
                  onRemovedFromList={onRemoveFromList}
                />
              )}
            </Group>
          </Group>
        </Group>
      )}
      {isSelectionMode && (
        <UnstyledButton
          key={listResource.resourceId}
          style={{
            backgroundColor: 'var(--gourmet-neutral-2)',
            borderRadius: '0.25rem',
            zIndex: isSelected ? 1 : undefined,
            border: '1px solid transparent',
            '--current-color': list.list.color ?? undefined,
          }}
          p={'0.5rem 1rem'}
          className={styles.selectableQueryButton}
          data-selected={isSelected}
          onClick={(event) => {
            setSelectionWithCheck([thisId], !isSelected, event.shiftKey, thisId, index);
          }}
          h={'3rem'}
        >
          <Group justify={'space-between'} wrap={'nowrap'}>
            <Group>
              <Group w={'2rem'} justify={'center'}>
                <Checkbox
                  style={{ pointerEvents: 'auto' }}
                  onClick={(event) =>
                    setSelectionWithCheck([thisId], event.currentTarget.checked, event.shiftKey, thisId, index)
                  }
                  color={list.list.color ?? 'var(--gourmet-orange-1)'}
                  checked={isSelected}
                  className={styles.selectCheckbox}
                />
              </Group>

              <GourmetText
                cgmff={'monospace'}
                cgmc={'neutral-9'}
                style={{
                  textWrap: 'nowrap',
                  overflowX: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {search.rawQuery}
              </GourmetText>
            </Group>

            <Group wrap={'nowrap'}>
              <GourmetText cgmff={'ui'} style={{ textWrap: 'nowrap' }}>
                {t('details.searchCards', { count: resolvedSavedSearch.lastTotalCount ?? 0 })}
              </GourmetText>
            </Group>
          </Group>
        </UnstyledButton>
      )}
    </>
  );
}
