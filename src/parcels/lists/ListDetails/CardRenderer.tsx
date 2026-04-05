import {ActionIcon, Group, Overlay} from '@mantine/core';
import {IconDotsVertical} from '@tabler/icons-react';
import {useState} from 'react';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import type {ResolvedUserListResource} from '@/parcels/lists/types.ts';
import {createProps} from '@/parcels/overview/CardGrid/ImageCardWithSelection/createProps.ts';
import {CardMoreActionsMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/CardMoreActionsMenu.tsx';
import styles from '@/parcels/overview/CardGrid/ToolsOverlay/ToolsOverlay.module.css';
import {ImageCard} from '@/parcels/overview/ImageCard/ImageCard.tsx';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function CardRenderer({
  tcg,
  data,
  onRemoveFromList,
}: {
  tcg: Tcg;
  data: ResolvedUserListResource;
  onRemoveFromList?: (listId: string) => void;
}) {
  const card = data.resourceData as unknown as TcgDataCard;
  const prop = createProps(tcg, {
    card: card,
    preferredDisplayLanguage: 'en',
    preferredDisplayFaceIndex: 0,
  } as TcgSearchDataCard);

  // TODO: add more actions menu to image card
  // => look at CardsOverview

  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <ImageCard key={data.listResource.resourceId} tcg={tcg} prop={prop} style={{ height: '100%' }}>
      <Overlay backgroundOpacity={0} style={{ pointerEvents: 'none' }} zIndex={0}>
        <Group p={'1rem 1rem 0 1rem'} justify={'end'}>
          <CardMoreActionsMenu
            overwriteTcg={tcg}
            card={card}
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
            onRemoveFromList={onRemoveFromList}
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
          />
        </Group>
      </Overlay>
    </ImageCard>
  );
}
