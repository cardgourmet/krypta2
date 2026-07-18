import { ActionIcon, Group, Menu, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDotsVertical, IconLink } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { ListDetailsActionMenu } from '@/parcels/lists/ListDetails/ListDetailsActionMenu/ListDetailsActionMenu.tsx';
import type { ResolvedUserListResource, UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import { createProps } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { CardGridToolsOverlay } from '@/parcels/overview/cards/CardGrid/CardGridToolsOverlay/CardGridToolsOverlay.tsx';
import { ImageCard } from '@/parcels/overview/cards/ImageCard/ImageCard.tsx';
import { useListDetailsWorkStore } from '@/parcels/selection/useListDetailsWorkStore.tsx';
import { slugify } from '@/parcels/slugify.ts';
import type { TcgDataCard, TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { DataUser } from '@/parcels/user/api.ts';
import styles from './CardRenderer.module.css';

function CardRenderer({
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
  onRemoveFromList?: (listId: string, resourceId?: string) => void;
  index: number;
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const isTouchDevice = useMediaQuery('(hover: none)');
  const { user } = useAuth();

  const tcg = data.listResource.game as Tcg;
  const card = data.resourceData as unknown as TcgDataCard;
  const prop = createProps(tcg, {
    card: card,
    preferredDisplayLanguage: 'en',
    preferredDisplayFaceIndex: 0,
  } as TcgSearchDataCard);

  const [menuOpened, setMenuOpened] = useState(false);

  const isSelectionMode = useListDetailsWorkStore((state) => state.isSelectionMode);
  const isSelected = useListDetailsWorkStore((state) => {
    return state.data?.selection?.elementDataById?.[card.print.id] !== undefined;
  });
  const setSelectionWithCheck = useListDetailsWorkStore((state) => state.setSelectionWithCheck);

  const actionMenu = useMemo(() => {
    return (
      <ListDetailsActionMenu
        owner={owner}
        tcg={tcg}
        listContext={list}
        resource={card}
        rawResourceId={card.print.id}
        resourceId={card.print.id}
        menuOpened={menuOpened}
        setMenuOpened={setMenuOpened}
        target={
          <ActionIcon
            style={{ pointerEvents: 'auto' }}
            onClick={() => setMenuOpened((v) => !v)}
            color="var(--gourmet-neutral-dark-3)"
            size={'1.25rem'}
            classNames={{ root: styles.overlayMenuButton }}
            data-menu-opened={menuOpened}
            data-toggle-visibility={true}
          >
            <IconDotsVertical size={16} />
          </ActionIcon>
        }
        type={'card'}
        onAddedToList={onAddToList}
        onRemovedFromList={onRemoveFromList}
      >
        {user && <Menu.Divider />}

        <Menu.Item
          onClick={() => {
            const set = card.print.setCode?.toLowerCase() as string;
            const cn = card.print.collectorNumber.toLowerCase();

            // noinspection JSIgnoredPromiseFromCall
            navigator.clipboard
              .writeText(`${window.location.origin}/${tcg as Tcg}/sets/${set}/${cn}/${slugify(card.name)}`)
              .then(() => {
                // TODO: event handler to show popup on card that it was successful
              });
          }}
        >
          <Group gap={'0.5rem'}>
            <IconLink size={18} />
            <GourmetText cgmff={'ui'}>{t('copyPrint')}</GourmetText>
          </Group>
        </Menu.Item>
      </ListDetailsActionMenu>
    );
  }, [card, list, menuOpened, onRemoveFromList, t, tcg, onAddToList, user, owner]);

  return (
    <Stack gap={'0.25rem'}>
      <ImageCard
        key={data.listResource.resourceId}
        tcg={tcg}
        prop={prop}
        card={card}
        linkProps={{
          /* @ts-expect-error */
          'data-selected': isSelected,
          onClick: (event) => {
            if (!isSelectionMode) return;

            event.preventDefault(); // prevent the event from bubbling up
            setSelectionWithCheck([card.print.id], !isSelected, event.shiftKey, card.print.id, index);
          },
          tabIndex: isSelectionMode ? 0 : undefined,
          className: `${styles.cardLink} ${isSelectionMode && !isSelected ? styles.cardLinkSelectable : ''}`,
          style: {
            '--main-color': list.list.color ?? 'var(--gourmet-orange-1)',
          },
        }}
        imageDivProps={{
          /* @ts-expect-error */
          'data-selected': isSelected,
        }}
        style={{ zIndex: isSelected ? 1 : 0, height: '100%' }}
      >
        {!isTouchDevice && (
          <CardGridToolsOverlay
            card={card}
            checked={isSelected}
            isSelectionMode={isSelected || isSelectionMode}
            setSelection={(select) => {
              const thisId = card.print.id;
              setSelectionWithCheck([thisId], select, false, thisId, index);
            }}
            menuButton={actionMenu}
            withoutLabels
          />
        )}
      </ImageCard>

      {isTouchDevice && <Group justify={'end'}>{actionMenu}</Group>}
    </Stack>
  );
}

export default CardRenderer;
