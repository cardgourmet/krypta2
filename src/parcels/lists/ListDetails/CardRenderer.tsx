import {ActionIcon, Group, Menu, Overlay} from '@mantine/core';
import {IconDotsVertical, IconLink} from '@tabler/icons-react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {ListDetailsActionMenu} from '@/parcels/lists/ListDetails/ListDetailsActionMenu/ListDetailsActionMenu.tsx';
import type {ResolvedUserListResource, UserListWithResources} from '@/parcels/lists/types.ts';
import {createProps} from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import styles from '@/parcels/overview/cards/CardGrid/ToolsOverlay/ToolsOverlay.module.css';
import {ImageCard} from '@/parcels/overview/cards/ImageCard/ImageCard.tsx';
import {slugify} from '@/parcels/slugify.ts';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function CardRenderer({
  tcg,
  list,
  data,
  onRemoveFromList,
}: {
  tcg: Tcg;
  list: UserListWithResources;
  data: ResolvedUserListResource;
  onRemoveFromList?: (listId: string) => void;
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const card = data.resourceData as unknown as TcgDataCard;
  const prop = createProps(tcg, {
    card: card,
    preferredDisplayLanguage: 'en',
    preferredDisplayFaceIndex: 0,
  } as TcgSearchDataCard);

  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <ImageCard key={data.listResource.resourceId} tcg={tcg} prop={prop} style={{ height: '100%' }}>
      <Overlay backgroundOpacity={0} style={{ pointerEvents: 'none' }} zIndex={0}>
        <Group p={'1rem 1rem 0 1rem'} justify={'end'}>
          <ListDetailsActionMenu
            tcg={tcg}
            listContext={list}
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
            onRemoveFromList={onRemoveFromList}
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
                <GourmetText cgmff={'ui'}>{t('copy-print')}</GourmetText>
              </Group>
            </Menu.Item>
          </ListDetailsActionMenu>
        </Group>
      </Overlay>
    </ImageCard>
  );
}
