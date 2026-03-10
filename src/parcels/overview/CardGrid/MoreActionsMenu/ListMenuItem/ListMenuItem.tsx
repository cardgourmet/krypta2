import {Group, Menu} from '@mantine/core';
import {IconBookmark, IconLabelFilled, IconMinus, IconPlus, IconStar} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {addCardResourcesToList, removeCardResourcesFromList} from '@/parcels/lists/api.ts';
import {IconWithOverlayIcon} from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from '@/parcels/overview/CardGrid/MoreActionsMenu/MoreActionsMenu.module.css';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';

export function ListMenuItem({
  card,
  listWithResources,
  disabled,
  action,
}: {
  card: TcgDataCard;
  listWithResources: UserListWithResources;
  action: 'add' | 'remove';
  disabled?: boolean;
}) {
  const tcg = useTcgByLocation() as Tcg;
  const { user } = useAuth();
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });

  const { refetchLists } = useUserLists();
  const { list } = listWithResources;

  return (
    <Menu.Item
      onClick={() => {
        if (!user?.id) return;

        if (action === 'add') {
          addCardResourcesToList(user?.id, list.id, tcg, [{ id: card.print.id }]).then((res) => {
            if (res.error) {
              console.error('error while adding resource to list', res.error);
              return;
            }

            console.log('success! added to list');
            refetchLists();
          });
          return;
        }
        if (action === 'remove') {
          removeCardResourcesFromList(user?.id, list.id, tcg, [card.print.id]).then((res) => {
            if (res.error) {
              console.error('error while removing resource to list', res.error);
              return;
            }

            console.log('success! removed to list');
            refetchLists();
          });
          return;
        }
      }}
      disabled={disabled}
      className={styles.menuItem}
    >
      <Group gap={'0.5rem'}>
        {list.systemListType === 'favorites' && (
          <>
            <IconWithOverlayIcon
              icon={<IconStar size={18} />}
              overlayIcon={
                action === 'add' ? (
                  <IconPlus size={14} color={'var(--gourmet-green-1)'} />
                ) : (
                  <IconMinus size={14} color={'var(--gourmet-red-01)'} />
                )
              }
            />
            <GourmetText cgmff={'ui'}>{t(`favorite${action === 'remove' ? '-remove' : ''}`)}</GourmetText>
          </>
        )}
        {list.systemListType === 'bookmarks' && (
          <>
            <IconWithOverlayIcon
              icon={<IconBookmark size={18} />}
              overlayIcon={
                action === 'add' ? (
                  <IconPlus size={14} color={'var(--gourmet-green-1)'} />
                ) : (
                  <IconMinus size={14} color={'var(--gourmet-red-01)'} />
                )
              }
            />
            <GourmetText cgmff={'ui'}>{t(`bookmark${action === 'remove' ? '-remove' : ''}`)}</GourmetText>
          </>
        )}

        {list.systemListType === undefined && (
          <>
            <GourmetText cgmff={'ui'}>{list.name}</GourmetText>
            {list.color && <IconLabelFilled size={18} color={list.color ?? 'var(--gourmet-neutral-9'} />}
          </>
        )}
      </Group>
    </Menu.Item>
  );
}
