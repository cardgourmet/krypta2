import { ActionIcon, Group, Menu, Overlay, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDotsVertical, IconLink } from '@tabler/icons-react';
import { Activity, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { ListDetailsActionMenu } from '@/parcels/lists/ListDetails/ListDetailsActionMenu/ListDetailsActionMenu.tsx';
import type { ResolvedUserListResource, UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import { createProps } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import styles from '@/parcels/overview/cards/CardGrid/CardGridToolsOverlay/CardGridToolsOverlay.module.css';
import { ImageCard } from '@/parcels/overview/cards/ImageCard/ImageCard.tsx';
import { slugify } from '@/parcels/slugify.ts';
import type { TcgDataCard, TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

function CardRenderer({
  list,
  data,
  onAddToList,
  onRemoveFromList,
}: {
  list: UserListWithResources;
  data: ResolvedUserListResource;
  onAddToList?: (res: UserListResource) => void;
  onRemoveFromList?: (listId: string, resourceId?: string) => void;
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const isTouchDevice = useMediaQuery('(hover: none)');

  const tcg = data.listResource.game as Tcg;
  const card = data.resourceData as unknown as TcgDataCard;
  const prop = createProps(tcg, {
    card: card,
    preferredDisplayLanguage: 'en',
    preferredDisplayFaceIndex: 0,
  } as TcgSearchDataCard);

  const [menuOpened, setMenuOpened] = useState(false);

  const actionMenu = useMemo(() => {
    return (
      <ListDetailsActionMenu
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
        <Menu.Divider />

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
  }, [card, list, menuOpened, onRemoveFromList, t, tcg, onAddToList]);

  return (
    <Stack gap={'0.25rem'}>
      <ImageCard key={data.listResource.resourceId} tcg={tcg} prop={prop} card={card} style={{ height: '100%' }}>
        <Activity mode={isTouchDevice ? 'hidden' : 'visible'}>
          <Overlay backgroundOpacity={0} style={{ pointerEvents: 'none' }} zIndex={0}>
            <Group p={'1rem 1rem 0 1rem'} justify={'end'}>
              {actionMenu}
            </Group>
          </Overlay>
        </Activity>
      </ImageCard>

      {isTouchDevice && <Group justify={'end'}>{actionMenu}</Group>}
    </Stack>
  );
}

export default CardRenderer;
