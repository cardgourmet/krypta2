import { Button, Group, Overlay, SimpleGrid, Stack } from '@mantine/core';
import { usePrevious } from '@mantine/hooks';
import { useLocation } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { type CardProperties, createProps } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { ImageCard } from '@/parcels/overview/cards/ImageCard/ImageCard.tsx';
import { useOverviewWorkMenuStore, useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './WorkMenu.module.css';

export function WorkMenu() {
  const workMeta = useOverviewWorkStore((state) => state.data?.meta);
  const workMenuOpen = useOverviewWorkMenuStore((state) => state.menuOpened);

  const currentElements = useMemo(() => {
    return workMeta?.rawElements?.slice(0, 9999) ?? [];
  }, [workMeta?.rawElements]);

  const location = useLocation();
  const printDetailsId = useOverviewWorkMenuStore((state) => state.printDetailsId);
  const currentPrintDetailsId = useMemo(() => {
    const depth = location.href.split('/');

    if (depth.length === 6 && location.href.includes('/sets/')) {
      return printDetailsId;
    }
    return undefined;
  }, [location.href, printDetailsId]);

  const previousPrintDetailsId = usePrevious(currentPrintDetailsId);
  useEffect(() => {
    if (currentPrintDetailsId === previousPrintDetailsId) return;

    if (!currentPrintDetailsId) {
      if (currentElements.length === 0) return;

      const firstId = currentElements[0].element.card.print.id;

      requestAnimationFrame(() => {
        document.getElementById(`card-${firstId}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById(`card-${currentPrintDetailsId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }, [previousPrintDetailsId, currentPrintDetailsId, currentElements]);

  return (
    <Stack className={styles.workMenu} data-work={workMenuOpen}>
      <Stack
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 9999,
          padding: '0.5rem',
          backgroundColor: 'var(--gourmet-neutral-2)',
        }}
        gap={'0.1rem'}
      >
        <GourmetText cgmff={'title'} c={'var(--gourmet-orange-1)'} fz={'1.25rem'} fw={'500'}>
          Current Search
        </GourmetText>

        {workMeta?.other?.set && <GourmetText>{workMeta?.other?.set?.translations.en.name}</GourmetText>}
        {!workMeta?.other?.set && workMeta?.other?.query && <GourmetText>{workMeta?.other?.query}</GourmetText>}
        <GourmetText>Size: {workMeta?.rawElements?.length}</GourmetText>
        <GourmetText>Page {workMeta?.page}</GourmetText>
      </Stack>

      <Stack style={{ padding: '0 1rem' }}>
        <SimpleGrid cols={2} spacing={'0.25rem'}>
          {currentElements?.map((card, index) => {
            return (
              <CardItem
                key={card.element.card.print.id}
                tcg={'mtg'}
                card={card.element}
                index={index}
                currentPrintId={currentPrintDetailsId}
              />
            );
          })}
        </SimpleGrid>
      </Stack>

      <Stack
        pos={'sticky'}
        bottom={0}
        left={0}
        style={{
          zIndex: 9999,
          backgroundColor: 'var(--gourmet-neutral-2)',
          padding: '0.5rem 0.5rem 2.5rem 0.5rem',
        }}
      >
        <Group justify={'space-between'}>
          <Button>Previous</Button>
          <Button>Next</Button>
        </Group>
      </Stack>
    </Stack>
  );
}

interface CardItemProps {
  tcg: Tcg;
  card: TcgSearchDataCard;
  index: number;
  currentPrintId?: string;
}

function CardItem({ tcg, card, currentPrintId }: CardItemProps) {
  const prop: CardProperties = useMemo(() => {
    return createProps(tcg, card) as CardProperties;
  }, [tcg, card]);

  return (
    <div
      id={`card-${card.card.print.id}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '936 / 672',
        borderRadius: '4px',
        outline: currentPrintId === card.card.print.id ? '1px solid var(--gourmet-orange-1)' : 'none',
      }}
    >
      {currentPrintId && currentPrintId !== card.card.print.id && (
        <Overlay backgroundOpacity={0.75} color={'var(--gourmet-neutral-0)'} style={{ pointerEvents: 'none' }} />
      )}

      <ImageCard
        tcg={tcg}
        prop={prop}
        card={card.card}
        linkProps={{
          onClick: () => {
            // nothing for now
          },
        }}
        onDragStart={() => {
          // drag to list maybe?
        }}
        style={{
          borderRadius: '4px',
        }}
      >
        {/*{!isTouchDevice && (
          <Activity mode={toolsEnabled ? 'visible' : 'hidden'}>
            <CardGridToolsOverlay
              card={card.card}
              checked={isSelected}
              isSelectionMode={isSelected || isSelectionMode}
              setSelection={(select) => {
                const thisId = card.card.print.id;
                setSelectionWithCheck([thisId], select, false, thisId, index);
              }}
              menuButton={cardMenuButton}
            />
          </Activity>
        )}*/}
      </ImageCard>
    </div>
  );
}
