import {Group, Menu} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconLink} from '@tabler/icons-react';
import {type Ref, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {AddToListMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/AddToListMenu/AddToListMenu.tsx';
import {ListMenuItem} from '@/parcels/overview/CardGrid/MoreActionsMenu/ListMenuItem/ListMenuItem.tsx';
import {RemoveFromListMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/RemoveFromListMenu/RemoveFromListMenu.tsx';
import {TableRowHorizontal} from '@/parcels/overview/CardTable/TableRowHorizontal/TableRowHorizontal.tsx';
import {TableRowVertical} from '@/parcels/overview/CardTable/TableRowHorizontal/TableRowVertical.tsx';
import {GourmetTable, type GourmetTableData, type GourmetTableDataRow,} from '@/parcels/overview/GourmetTable/GourmetTable.tsx';
import {slugify} from '@/parcels/slugify.ts';
import type {DlcDataCard, DlcSearchCardsResult, DlcSearchDataCard} from '@/parcels/tcg/dlc/api.ts';
import {useConstructDlcCardTableData} from '@/parcels/tcg/dlc/overview/useConstructDlcCardTableData.tsx';
import type {MtgDataCard, MtgSearchCardsResult, MtgSearchDataCard} from '@/parcels/tcg/mtg/api.ts';
import {useConstructMtgCardTableData} from '@/parcels/tcg/mtg/overview/useConstructMtgCardTableData.tsx';
import type {PcgDataCard, PcgSearchCardsResult, PcgSearchDataCard} from '@/parcels/tcg/pcg/api.ts';
import {useConstructPcgCardTableData} from '@/parcels/tcg/pcg/overview/useConstructPcgCardTableData.tsx';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

type CardTableProps = {
  tcg: Tcg;
  cards: MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult | null | undefined;
  isLoading: boolean;
  toolsEnabled: boolean;
};

export function CardTable({ tcg, cards, isLoading, toolsEnabled }: CardTableProps) {
  const { t } = useTranslation('cards', { keyPrefix: 'table.cols' });
  const cardItems: TcgSearchDataCard[] | null = useMemo(() => {
    if (!cards) return null;

    if (tcg === 'dlc') {
      return (cards as DlcSearchCardsResult).data.items;
    } else if (tcg === 'pcg') {
      return (cards as PcgSearchCardsResult).data.items as PcgSearchDataCard[];
    } else if (tcg === 'mtg') {
      return (cards as MtgSearchCardsResult).data.items as MtgSearchDataCard[];
    }
    return null;
  }, [tcg, cards]);
  const mtgData = useConstructMtgCardTableData((cardItems ?? []) as MtgSearchDataCard[]);
  const dlcData = useConstructDlcCardTableData((cardItems ?? []) as DlcSearchDataCard[]);
  const pcgData = useConstructPcgCardTableData((cardItems ?? []) as PcgSearchDataCard[]);
  const tableData = useMemo(() => {
    let data: GourmetTableData<MtgDataCard | DlcDataCard | PcgDataCard> | null = null;
    if (tcg === 'mtg') data = mtgData as GourmetTableData<MtgDataCard | DlcDataCard | PcgDataCard>;
    else if (tcg === 'dlc') data = dlcData;
    else if (tcg === 'pcg') data = pcgData;

    if (!data) return null;
    return data;
  }, [mtgData, dlcData, pcgData, tcg]);

  // TODO: can we extract that as well? it only bloats the parent component
  const [opened, setOpened] = useState(false);

  const menuRef = useRef<{
    card: TcgDataCard | null;
    target: HTMLButtonElement | null;
    opened: boolean | null;
  }>({
    card: null,
    target: null,
    opened: null,
  });
  const closeMenu = useCallback(() => {
    menuRef.current = {
      card: null,
      opened: false,
      target: null,
    };
    setOpened(false);
  }, []);
  const openMenu = useCallback(
    (card: TcgDataCard, target: HTMLButtonElement) => {
      const nextCardId = card.print.id;

      if (menuRef.current.opened && menuRef.current.card?.print?.id === nextCardId) {
        closeMenu();
        return;
      }

      menuRef.current = {
        card: card,
        target: target,
        opened: true,
      };
      setOpened(true);
    },
    [closeMenu],
  );

  const constructHorTableRow = useCallback(
    (row: GourmetTableDataRow<TcgDataCard>, index: number) => {
      return (
        <TableRowHorizontal
          key={`hor_${row.entry.print.id}`}
          card={row.entry}
          index={index}
          data={row.data}
          columns={tableData?.columns ?? []}
          toolsEnabled={toolsEnabled}
          onOpenMenu={openMenu}
        />
      );
    },
    [openMenu, tableData?.columns, toolsEnabled],
  );
  const constructVerTableRow = useCallback(
    (row: GourmetTableDataRow<TcgDataCard>, index: number) => {
      return (
        <TableRowVertical
          key={`ver_${row.entry.print.id}`}
          card={row.entry}
          index={index}
          data={row.data}
          columns={tableData?.columns ?? []}
          toolsEnabled={toolsEnabled}
        />
      );
    },
    [tableData?.columns, toolsEnabled],
  );

  return (
    <div>
      {tableData && (
        <GourmetTable
          t={t}
          tcg={tcg}
          isLoading={isLoading}
          tableData={tableData}
          constructHorTableRow={constructHorTableRow}
          constructVerTableRow={constructVerTableRow}
        />
      )}

      <OneMenuToRuleThemAll
        tcg={tcg}
        opened={opened}
        setOpened={setOpened}
        closeMenu={closeMenu}
        activeCard={menuRef.current.card}
        activeTargetRef={menuRef.current.target}
      />
    </div>
  );
}

function OneMenuToRuleThemAll({
  tcg,
  opened,
  setOpened,
  closeMenu,
  activeCard,
  activeTargetRef,
  onSearchSaved,
  onRemoveFromList,
  ref,
}: {
  tcg: Tcg;
  opened: boolean;
  setOpened: (opened: boolean) => void;
  closeMenu: () => void;
  activeCard: TcgDataCard | null;
  activeTargetRef: HTMLButtonElement | null;
  onSearchSaved?: (id: string) => void;
  onRemoveFromList?: (listId: string) => void;
} & { ref?: Ref<HTMLDivElement> }) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });

  const resourceId = activeCard?.print?.id;
  const { lists, refetchLists } = useUserLists();
  const { systemLists, existsInLists } = useMemo(() => {
    const systemLists = lists.filter((l) => l.list.systemListType !== undefined);
    const existsInLists = lists
      .filter((list) => {
        return list.resources?.card?.find((res) => res.listResource.resourceId === resourceId);
      })
      .map((l) => l.list.id);

    return { systemLists, existsInLists };
  }, [lists, resourceId]);

  // rerender on resize
  const [, forceRerender] = useState(0);
  useEffect(() => {
    const onResize = () => forceRerender((n) => n + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // prevent scrolling when open
  useEffect(() => {
    if (!opened) return;

    const preventScroll = (event: Event) => event.preventDefault();

    const preventKeyScroll = (event: KeyboardEvent) => {
      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
      if (keys.includes(event.key)) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeyScroll);

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
    };
  }, [opened]);

  const disclosure = useDisclosure(false);

  // TODO: make dropdown like it was before
  return (
    <>
      <CreateListModal disclosure={disclosure} onSuccess={() => refetchLists()} />

      <Menu
        opened={opened}
        onChange={setOpened}
        onClose={closeMenu}
        withArrow
        withinPortal={false}
        styles={{ dropdown: { pointerEvents: 'auto' } }}
        openDelay={0}
        transitionProps={{ duration: 0 }}
        position={'bottom-end'}
      >
        <Menu.Target>
          <span
            style={{
              position: 'fixed',
              left: activeTargetRef
                ? (activeTargetRef.getBoundingClientRect().left + activeTargetRef.getBoundingClientRect().right) / 2
                : -9999,
              top: activeTargetRef ? activeTargetRef.getBoundingClientRect().bottom : -9999,
              width: 1,
              height: 1,
              pointerEvents: 'none',
            }}
          />
        </Menu.Target>

        <Menu.Dropdown ref={ref}>
          {systemLists.map((list) => {
            return (
              <ListMenuItem
                key={list.list.id}
                ressourceId={resourceId ?? ''}
                raw={resourceId === undefined}
                listWithResources={list}
                action={existsInLists.includes(list.list.id) ? 'remove' : 'add'}
                type={'search'}
                tcg={tcg}
                onSuccess={(res) => {
                  if (res) {
                    if (onSearchSaved) onSearchSaved(res.resourceId);
                  }
                }}
              />
            );
          })}
          {systemLists.length === 0 && <GourmetText>No system lists</GourmetText>}

          <AddToListMenu
            ref={ref}
            ressourceId={resourceId ?? ''}
            raw={resourceId === undefined}
            disclosure={disclosure}
            type={'card'}
            tcg={tcg}
            onSuccess={(res) => {
              if (res) {
                if (onSearchSaved) onSearchSaved(res.resourceId);
              }
            }}
          />
          <RemoveFromListMenu
            ref={ref}
            ressourceId={resourceId ?? ''}
            raw={resourceId === undefined}
            type={'card'}
            tcg={tcg}
            onSuccess={(res) => {
              if (res) {
                if (onRemoveFromList) onRemoveFromList(res.listId);
              }
            }}
          />

          <Menu.Item
            onClick={() => {
              if (!activeCard) return;

              const set = activeCard.print.setCode?.toLowerCase() as string;
              const cn = activeCard.print.collectorNumber.toLowerCase();

              navigator.clipboard.writeText(
                `${window.location.origin}/${tcg}/sets/${set}/${cn}/${slugify(activeCard.name)}`,
              );

              closeMenu();
            }}
          >
            <Group gap={'0.5rem'}>
              <IconLink size={18} />
              <GourmetText cgmff={'ui'}>{t('copy-print')}</GourmetText>
            </Group>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
