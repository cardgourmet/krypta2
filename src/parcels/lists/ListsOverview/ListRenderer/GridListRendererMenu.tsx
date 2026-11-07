import { type MantineColor, Tooltip } from '@mantine/core';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
  IconCopy,
  IconDotsVertical,
  IconEyeX,
  IconLock,
  IconPencil,
  IconPhotoSearch,
  IconTrash,
  IconWorld,
} from '@tabler/icons-react';
import { use, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton.tsx';
import { Menu } from '@/parcels/generic/Menu/Menu.tsx';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { updateList } from '@/parcels/lists/api.ts';
import type { UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { ModalContext } from '@/parcels/modals/Modal.context.tsx';
import { ListUpdateNotification } from '@/parcels/notification/list/ListUpdateNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';

export const GridListRendererMenu = ({ listWithResources }: { listWithResources: UserListWithResources }) => {
  const { t } = useTranslation('lists', { keyPrefix: 'overview' });
  const { requestModal } = use(ModalContext);
  const { updateLists, removeLists } = useActiveLists();

  const { user } = useAuth();
  const { list } = listWithResources;

  const [tooltipOpened, setTooltipOpened] = useState(false);
  const [tooltipLabel, setTooltipLabel] = useState<string>('');
  const [tooltipColor, setTooltipColor] = useState<MantineColor>('gray');

  const updateVisibility = (visibility: UserList['visibility']) => {
    if (!user) return;

    const updated = {
      ...list,
      visibility: visibility,
    } as UserList;

    updateList(user.id, updated).then(({ data, error }) => {
      if (error) {
        sendErrorNotification(error);
        return;
      }
      const returnList = data?.[list.id];
      if (!returnList) return;

      sendNotification('success', <ListUpdateNotification list={returnList} />);

      updateLists([
        {
          ...listWithResources,
          list: updated,
        },
      ]);
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Tooltip
          label={tooltipLabel}
          opened={tooltipOpened}
          color={tooltipColor}
          withArrow
          transitionProps={{ transition: 'fade-up', duration: 200 }}
        >
          <ActionButton size={'sm'}>
            <IconDotsVertical />
          </ActionButton>
        </Tooltip>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild align="end" sideOffset={-4}>
        <Menu>
          <Menu.DropdownItem
            icon={<IconPencil />}
            onClick={async () => {
              try {
                const updatedList = await requestModal<UserList>('editList', {
                  async: true,
                  innerProps: { list: list },
                });

                if (updatedList) {
                  updateLists([{ list: updatedList }]);
                }
              } catch {}
            }}
          >
            {t('edit.menu.edit')}
          </Menu.DropdownItem>
          <Menu.DropdownItem
            onClick={async () => {
              try {
                const updatedList = await requestModal<UserList>('editList', {
                  async: true,
                  innerProps: { list: list, onlyName: true },
                });

                if (updatedList) {
                  updateLists([{ list: updatedList }]);
                }
              } catch {}
            }}
          >
            {t('edit.menu.rename')}
          </Menu.DropdownItem>
          <Menu.DropdownItem
            icon={<IconPhotoSearch />}
            onClick={async () => {
              try {
                const updatedList = await requestModal<UserList>('editListThumbnail', {
                  async: true,
                  innerProps: { list: list },
                });

                if (updatedList) {
                  updateLists([{ list: updatedList }]);
                }
              } catch {}
            }}
          >
            Edit Thumbnail...
          </Menu.DropdownItem>
          <Menu.DropdownSeparator />
          <Menu.DropdownItem
            icon={<IconWorld />}
            disabled={list.visibility === 'public'}
            onClick={() => {
              updateVisibility('public');
            }}
          >
            {t('edit.menu.makePublic')}
          </Menu.DropdownItem>
          <Menu.DropdownItem
            icon={<IconEyeX />}
            disabled={list.visibility === 'unlisted'}
            onClick={() => {
              updateVisibility('unlisted');
            }}
          >
            {t('edit.menu.makeUnlisted')}
          </Menu.DropdownItem>
          <Menu.DropdownItem
            icon={<IconLock />}
            disabled={list.visibility === 'private'}
            onClick={() => {
              updateVisibility('private');
            }}
          >
            {t('edit.menu.makePrivate')}
          </Menu.DropdownItem>
          <Menu.DropdownSeparator />
          <Menu.DropdownItem
            icon={<IconCopy />}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`${window.location.origin}/@${user!.username}/lists/${list.slug}`);

                setTooltipLabel(t('copied'));
                setTooltipOpened(true);
                setTooltipColor('green');

                setTimeout(() => {
                  setTooltipOpened(false);
                }, 3000);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            {t('edit.menu.copyShare')}
          </Menu.DropdownItem>
          <Menu.DropdownSeparator />
          <Menu.DropdownItem
            icon={
              <IconTrash
                style={{
                  color: list.systemListType === 'favorites' ? 'var(--gourmet-neutral-5)' : 'var(--cgm-color-negative)',
                }}
              />
            }
            onClick={async () => {
              try {
                const deletedList = await requestModal<UserList>('deleteList', {
                  async: true,
                  innerProps: { list: listWithResources },
                });

                if (deletedList) {
                  removeLists([deletedList.id]);
                }
              } catch {}
            }}
            style={{
              color: list.systemListType === 'favorites' ? 'var(--gourmet-neutral-6)' : 'var(--cgm-color-negative)',
            }}
            disabled={list.systemListType === 'favorites'}
          >
            {t('edit.menu.delete')}
          </Menu.DropdownItem>
        </Menu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
