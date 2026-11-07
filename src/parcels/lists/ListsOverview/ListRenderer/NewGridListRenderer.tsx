import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/waves.json';
import { Group, type MantineColor, Progress, Stack, Tooltip } from '@mantine/core';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
  IconCopy,
  IconDotsVertical,
  IconEyeX,
  IconLabelFilled,
  IconLock,
  IconPencil,
  IconStar,
  IconTrash,
  IconWorld,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { use, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton.tsx';
import { Menu } from '@/parcels/generic/Menu/Menu.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { updateList } from '@/parcels/lists/api.ts';
import { VisibilityBadge } from '@/parcels/lists/ListsOverview/ListRenderer/ListElementHeader/ListElementHeader.tsx';
import type { UserList, UserListThumbnail, UserListWithResources } from '@/parcels/lists/types.ts';
import { useUserLimits } from '@/parcels/lists/useInList.tsx';
import { ModalContext } from '@/parcels/modals/Modal.context.tsx';
import { ListUpdateNotification } from '@/parcels/notification/list/ListUpdateNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './NewGridListRenderer.module.css';

export function NewGridListRenderer({
  listWithResources,
}: {
  listWithResources: UserListWithResources;
  isLoading: boolean;
  onUpdate?: (list: UserList) => void;
  onDelete?: (id: string) => void;
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview' });
  const { requestModal } = use(ModalContext);
  const { updateLists, removeLists } = useActiveLists();

  // TODO: apply crop to thumbnail
  const thumbnailData = useMemo(() => {
    const data = listWithResources.list.thumbnailData;
    if (!data) return undefined;

    return data as UserListThumbnail;
  }, [listWithResources.list.thumbnailData]);
  const thumbnail = thumbnailData?.url ?? undefined;
  /*const thumbnailCropStyle = useMemo(() => {
    return getThumbnailCropStyle(thumbnailData?.crop);
  }, [thumbnailData?.crop]);*/

  const thumbnailFallback = useMemo(() => {
    if (thumbnail) return;

    const style = new Style(definition);
    const avatar = new Avatar(style, {
      backgroundColor: [listWithResources.list.color ?? '454f59'],
      seed: listWithResources.list.id ?? undefined,
    });

    return avatar.toString();
  }, [listWithResources.list.id, thumbnail, listWithResources.list.color]);

  const { list, size } = listWithResources;
  const { user } = useAuth();
  const { list_resources_per_list } = useUserLimits(user);

  const listName = list.systemListType !== undefined ? t('card.system.favorites') : list.name;

  const progress = ((size ?? 0) / list_resources_per_list) * 100;
  const progressColor = useMemo(() => {
    if (progress >= 90) {
      return 'var(--gourmet-red-01)';
    } else if (progress >= 75) {
      return 'var(--gourmet-orange-1)';
    }
    return 'var(--gourmet-green-1)';
  }, [progress]);

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
    <article className={styles.listCard}>
      <div>
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
          }}
        >
          <VisibilityBadge visibility={list.visibility} withoutText />
        </div>

        <Link
          to={'/@{$user}/lists/$listId'}
          params={{ user: user!.username, listId: list.slug }}
          className={styles.link}
          preload={false}
          style={{ flexShrink: 1 }}
        >
          {thumbnail && (
            <figure
              aria-hidden
              className={styles.thumbnailFigure}
              style={{
                '--thumbnail-fade-color': list.color ? `${list.color}` : 'var(--cgm-background-surface)',
              }}
            >
              <img alt="" className={styles.thumbnailImage} src={`${thumbnail}`} />
            </figure>
          )}
          {!thumbnail && (
            <figure
              aria-hidden
              className={styles.thumbnailFigure}
              style={{
                '--thumbnail-fade-color': list.color ? `${list.color}` : 'var(--cgm-background-surface)',
              }}
            >
              <img
                alt=""
                className={styles.thumbnailImage}
                src={`data:image/svg+xml,${encodeURIComponent(thumbnailFallback ?? '')}`}
              />
            </figure>
          )}
        </Link>
      </div>

      <div className={styles.content}>
        <Stack gap={'0.5rem'} w={'100%'}>
          <Group justify={'space-between'} w={'100%'} wrap={'nowrap'}>
            <Group gap={'0.5rem'} wrap={'nowrap'} style={{ minWidth: 0, flex: 1 }}>
              {list.systemListType === 'favorites' && <IconStar size={22} color={'var(--gourmet-neutral-9'} />}

              <Tooltip label={listName} openDelay={500}>
                <Link
                  to={'/@{$user}/lists/$listId'}
                  params={{ user: user!.username, listId: list.slug }}
                  className={styles.link}
                  preload={false}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <GourmetText
                    cgmff={'content'}
                    fz={'1.25rem'}
                    c={'var(--cgm-foreground-primary)'}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minWidth: '0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {listName}
                  </GourmetText>
                </Link>
              </Tooltip>

              <IconLabelFilled size={22} color={list.color ?? 'var(--gourmet-neutral-9'} style={{ flexShrink: 0 }} />
            </Group>

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
                <Menu className={styles.menuBase}>
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
                        await navigator.clipboard.writeText(
                          `${window.location.origin}/@${user!.username}/lists/${list.slug}`,
                        );

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
                          color:
                            list.systemListType === 'favorites'
                              ? 'var(--gourmet-neutral-5)'
                              : 'var(--cgm-color-negative)',
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
                      color:
                        list.systemListType === 'favorites' ? 'var(--gourmet-neutral-6)' : 'var(--cgm-color-negative)',
                    }}
                    disabled={list.systemListType === 'favorites'}
                  >
                    {t('edit.menu.delete')}
                  </Menu.DropdownItem>
                </Menu>
              </DropdownMenuContent>
            </DropdownMenu>
          </Group>
          {list.description && (
            <GourmetText
              fz={'0.95rem'}
              style={{
                minHeight: '3.5rem',
                overflow: 'scroll',
              }}
              cgmc={'neutral-9'}
              mr={'2rem'}
            >
              {list.description}
            </GourmetText>
          )}
          {!list.description && (
            <GourmetText
              fz={'0.95rem'}
              style={{
                textWrap: 'wrap',
              }}
              cgmc={'neutral-4'}
              mr={'2rem'}
            >
              {t('card.noDescription')}
            </GourmetText>
          )}

          <Stack h={'100%'} justify={'end'} gap={'0.25rem'}>
            <Group justify={'end'} w={'100%'}>
              <Group gap={'0.25rem'}>
                {(list.allowedTcgs?.length ?? 0) > 0 && (
                  <>
                    <GourmetText cgmff={'ui'} fz={'0.9rem'} cgmc={'neutral-8'}>
                      {t('card.allowed')}
                    </GourmetText>
                    <Group gap={'0.15rem'}>
                      {list.allowedTcgs?.map((tcg) => {
                        return (
                          <TcgIcon
                            key={tcg}
                            tcg={tcg as Tcg}
                            size={17}
                            style={{
                              color: 'var(--gourmet-neutral-8)',
                            }}
                          />
                        );
                      })}
                    </Group>
                  </>
                )}
                {(list.allowedTcgs?.length ?? 0) === 0 && (
                  <GourmetText cgmff={'ui'} fz={'0.9rem'} cgmc={'neutral-8'}>
                    {t('card.allowedAll')}
                  </GourmetText>
                )}
              </Group>
            </Group>

            <div
              style={{
                position: 'relative',
                width: '100%',
                flexWrap: 'nowrap',
              }}
            >
              <Progress size={6} value={progress} color={progressColor} />

              <Group
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'color-mix(in oklab, var(--gourmet-neutral-2), transparent 15%)',
                  padding: '0 0.5rem',
                  borderRadius: '0.5rem',
                }}
                gap={'0.25rem'}
                wrap={'nowrap'}
              >
                <GourmetText fz={'0.95rem'} cgmc={'neutral-9'} fw={'bold'}>
                  {`${size ?? 0}`}
                </GourmetText>
                <GourmetText fz={'0.95rem'} cgmc={'neutral-7'} style={{ whiteSpace: 'nowrap' }}>
                  {`/ ${list_resources_per_list}`}
                </GourmetText>
              </Group>
            </div>
          </Stack>
        </Stack>
      </div>
    </article>
  );
}
