import { Button, Center, Group, Overlay, SimpleGrid, Stack } from '@mantine/core';
import { usePrevious } from '@mantine/hooks';
import { IconCaretLeftFilled, IconCaretRightFilled } from '@tabler/icons-react';
import { useLocation } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { type CardProperties, createProps } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import useCardOverviewData from '@/parcels/overview/cards/CardOverview/useCardOverviewData.tsx';
import { useWorkContextReloader } from '@/parcels/overview/cards/CardOverview/useWorkContextReloader.ts';
import { ImageCard } from '@/parcels/overview/cards/ImageCard/ImageCard.tsx';
import { useOverviewWorkMenuStore, useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { Route } from '@/routes/$tcg/sets/$setCode/$collectorNumber/{-$any}';
import styles from './WorkMenu.module.css';

export function WorkMenu() {
  const navigate = Route.useNavigate();

  const workMeta = useOverviewWorkStore((state) => state.data?.meta);
  const workMenuOpen = useOverviewWorkMenuStore((state) => state.menuOpened);
  const tcg = workMeta?.other.tcg;
  const page = workMeta?.page ?? 1;
  const maxPage = workMeta?.other?.maxPage ?? page;
  const querySettings = workMeta?.other?.querySettings;
  const set = workMeta?.other?.set;

  const { cards } = useCardOverviewData(tcg, querySettings, set);
  useWorkContextReloader({ tcg, settings: querySettings, cards, set });
  // TODO: use the overview data to switch pages etc.

  const currentElements = useMemo(() => {
    return workMeta?.rawElements?.slice(0, 9999) ?? [];
  }, [workMeta?.rawElements]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const maxIndex = currentElements?.length - 1;

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
      setCurrentIndex(-1);

      if (currentElements.length === 0) {
        return;
      }

      const firstId = currentElements[0].element.card.print.id;

      requestAnimationFrame(() => {
        document.getElementById(`card-${firstId}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
      return;
    }

    const ind = currentElements.findIndex((el) => el.element.card.print.id === currentPrintDetailsId);
    setCurrentIndex(ind);

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
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--gourmet-neutral-2)',
        }}
        gap={'0.1rem'}
      >
        <GourmetText cgmff={'title'} c={'var(--gourmet-orange-1)'} fz={'1.25rem'} fw={'500'}>
          Current Search
        </GourmetText>

        {workMeta?.other?.set && <GourmetText>{workMeta?.other?.set?.translations.en.name}</GourmetText>}
        {!workMeta?.other?.set && workMeta?.other?.querySettings?.query && (
          <GourmetText>{workMeta?.other?.querySettings?.query}</GourmetText>
        )}
        <GourmetText>
          Index: {currentIndex + 1} / {maxIndex + 1}
        </GourmetText>
        <GourmetText>
          Page: {page} / {maxPage}
        </GourmetText>
      </Stack>

      <Stack style={{ padding: '0 1rem' }}>
        <SimpleGrid cols={2} spacing={'0.25rem'}>
          {currentElements?.map((card, index) => {
            return (
              <CardItem
                key={card.element.card.print.id}
                tcg={tcg!}
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
        <Group justify={'space-between'} p={'0 0.5rem'}>
          <Button
            onClick={() => {
              if (currentIndex <= 0 && page > 1) {
                // TODO: switch to previous page
                return;
              }
              if (currentIndex <= 0) return;

              const prevElement = currentElements[currentIndex - 1];
              if (!prevElement) return;

              navigate({
                to: '/$tcg/sets/$setCode/$collectorNumber/{-$any}',
                params: {
                  tcg: tcg,
                  setCode: prevElement.element.card.print.setCode?.toLowerCase(),
                  collectorNumber: prevElement.element.card.print.collectorNumber,
                },
              });
            }}
            disabled={(currentIndex === 0 && page === 1) || currentIndex < 0}
            color={'var(--gourmet-orange-1)'}
            aria-label={'previous element'}
          >
            <Center>
              <IconCaretLeftFilled aria-hidden={'true'} />
            </Center>
          </Button>
          <Button
            onClick={() => {
              if (currentIndex >= maxIndex && page < maxPage) {
                // TODO: switch to new page
                // TODO: HOW do we switch pages
                // -> since we reload the data when going back to the overview anyway,
                // -> we can just strip out the logic to fetch the cards (based on set etc.) and reuse it to put it into the store
                return;
              }
              if (currentIndex < 0 || currentIndex >= maxIndex) return;

              const nextElement = currentElements[currentIndex + 1];
              if (!nextElement) return;
              navigate({
                to: '/$tcg/sets/$setCode/$collectorNumber/{-$any}',
                params: {
                  tcg: tcg,
                  setCode: nextElement.element.card.print.setCode?.toLowerCase(),
                  collectorNumber: nextElement.element.card.print.collectorNumber,
                },
              });
            }}
            disabled={(currentIndex >= maxIndex && page === maxPage) || currentIndex < 0}
            color={'var(--gourmet-orange-1)'}
            aria-label={'next element'}
          >
            <Center>
              <IconCaretRightFilled aria-hidden={'true'} />
            </Center>
          </Button>
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
