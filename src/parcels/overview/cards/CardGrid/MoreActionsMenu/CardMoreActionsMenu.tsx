import {Group, Menu} from '@mantine/core';
import {IconLink} from '@tabler/icons-react';
import {type Dispatch, type ReactElement, type SetStateAction} from 'react';
import {useTranslation} from 'react-i18next';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {MoreActionsMenu} from '@/parcels/search/history/MoreActionsMenu.tsx';
import {slugify} from '@/parcels/slugify.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';

export function CardMoreActionsMenu({
  card,
  menuOpened,
  setMenuOpened,
  target,
  overwriteTcg,
  onRemoveFromList,
}: {
  card: TcgDataCard;
  menuOpened: boolean;
  setMenuOpened: Dispatch<SetStateAction<boolean>>;
  target: ReactElement;
  overwriteTcg?: Tcg;
  onRemoveFromList?: (listId: string) => void;
}) {
  const locationTcg = useTcgByLocation() as Tcg;
  const tcg = overwriteTcg ?? locationTcg;
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });

  return (
    <MoreActionsMenu
      tcg={tcg}
      rawResourceId={card.print.id}
      resourceId={card.print.id}
      menuOpened={menuOpened}
      setMenuOpened={setMenuOpened}
      target={target}
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
    </MoreActionsMenu>
  );
}
