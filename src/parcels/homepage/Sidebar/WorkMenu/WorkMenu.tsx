import { ActionIcon, Button, Center, Group, Overlay, SimpleGrid, Stack, UnstyledButton } from '@mantine/core';
import { useMediaQuery, usePrevious } from '@mantine/hooks';
import { IconCaretLeftFilled, IconCaretRightFilled, IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import { useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

export function WorkMenu({ mobile, onSwitch }: { mobile?: boolean; onSwitch?: () => void }) {
  const smallerScreen = useMediaQuery('(max-width: 550px)');
  const { t } = useTranslation('cards', { keyPrefix: 'work' });
  const navigate = Route.useNavigate();

  const setMenuOpened = useOverviewWorkMenuStore((state) => state.setMenuOpened);

  const setWorkMeta = useOverviewWorkStore((state) => state.setData);
  const workMeta = useOverviewWorkStore((state) => state.data?.meta);
  const workMenuOpen = useOverviewWorkMenuStore((state) => state.menuOpened);
  const tcg = workMeta?.other.tcg;
  const page = workMeta?.page ?? 1;
  const maxPage = workMeta?.other?.maxPage ?? page;
  const querySettings = workMeta?.other?.querySettings;
  const set = workMeta?.other?.set;

  const { cards } = useCardOverviewData(tcg, querySettings, set);
  useWorkContextReloader({ tcg, settings: querySettings, cards, set });

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

  const [resetScrollIndex, setResetScrollIndex] = useState<number | undefined>(undefined);
  const resetScroll = useCallback(() => {
    if (resetScrollIndex === undefined) return;
    if (currentElements.length === 0) return;

    console.log('inside resetScroll');

    // also check if we again have our current detail card
    const currentInd = currentElements.findIndex((el) => el.element.card.print.id === currentPrintDetailsId);
    if (currentInd !== -1) {
      setCurrentIndex(currentInd);
    }
    const ind = currentInd !== -1 ? currentInd : resetScrollIndex;

    const element = currentElements[ind] ?? currentElements[0];
    requestAnimationFrame(() => {
      const docElement = document.getElementById(`card-${element.id}`);

      docElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setResetScrollIndex(undefined);
    });
  }, [currentElements, currentPrintDetailsId, resetScrollIndex]);

  const [changePageIndex, setChangePageIndex] = useState<'first' | 'last' | undefined>(undefined);
  const resetIndex = useCallback(() => {
    if (changePageIndex === undefined) return;

    const index = changePageIndex === 'first' ? 0 : currentElements.length - 1;
    const element = currentElements[index];
    if (element === undefined) return;

    navigate({
      to: '/$tcg/sets/$setCode/$collectorNumber/{-$any}',
      params: {
        tcg: tcg,
        setCode: element.element.card.print.setCode?.toLowerCase(),
        collectorNumber: element.element.card.print.collectorNumber,
      },
    });
    setCurrentIndex(index);
    setChangePageIndex(undefined);
  }, [changePageIndex, currentElements, navigate, tcg]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (resetScrollIndex !== undefined) {
      resetScroll();
      return;
    }
    if (changePageIndex !== undefined) {
      resetIndex();
      return;
    }
  }, [currentElements]);

  const changePage = useCallback(
    (change: 'next' | 'previous', alsoNextCard: boolean) => {
      const offset = change === 'next' ? +1 : -1;
      if (page + offset < 1 || page + offset > maxPage) return;
      if (!workMeta?.other?.querySettings) return;

      workMeta.page = page + offset;
      workMeta.other.querySettings = { ...workMeta.other.querySettings, page: page + offset };
      setWorkMeta(workMeta!);
      setCurrentIndex(-1);

      if (alsoNextCard) {
        setChangePageIndex(change === 'next' ? 'first' : 'last');
      } else {
        setResetScrollIndex(-1);
      }
    },
    [maxPage, page, setWorkMeta, workMeta],
  );

  return (
    <Stack className={mobile ? styles.mobileWorkMenu : styles.workMenu} data-work={workMenuOpen}>
      <Stack
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 9999,
          padding: mobile ? undefined : '0.5rem 1rem',
          backgroundColor: 'var(--gourmet-neutral-2)',
        }}
        gap={'0.5rem'}
      >
        <Stack gap={'0.25rem'}>
          <Group justify={'space-between'}>
            <GourmetText cgmff={'title'} c={'var(--gourmet-orange-1)'} fz={'1.25rem'} fw={'500'}>
              {t('title')}
            </GourmetText>

            {!mobile && (
              <UnstyledButton
                onClick={() => {
                  setMenuOpened(false);
                }}
                aria-label={'close menu'}
              >
                <Center>
                  <IconX size={18} color={'var(--gourmet-neutral-7)'} />
                </Center>
              </UnstyledButton>
            )}
          </Group>

          <Stack>
            {workMeta?.other?.set && <GourmetText>{workMeta?.other?.set?.translations.en.name}</GourmetText>}
            {!workMeta?.other?.set && workMeta?.other?.querySettings?.query && (
              <GourmetText>{workMeta?.other?.querySettings?.query}</GourmetText>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Stack style={{ padding: mobile ? '0 0.5rem' : '0 1rem' }}>
        {maxPage > 1 && (
          <Group>
            <GourmetText cgmff={'ui'}>{t('page')}</GourmetText>
            <Group>
              <ActionIcon
                size={'xs'}
                color={'var(--gourmet-orange-1)'}
                disabled={page <= 1}
                onClick={() => {
                  changePage('previous', false);
                }}
              >
                <IconMinus size={16} color={page <= 1 ? 'var(--gourmet-neutral-5)' : 'var(--gourmet-neutral-2)'} />
              </ActionIcon>
              <GourmetText cgmff={'ui'}>
                {page} / {maxPage}
              </GourmetText>
              <ActionIcon
                size={'xs'}
                color={'var(--gourmet-orange-1)'}
                disabled={page >= maxPage}
                onClick={() => {
                  changePage('next', false);
                }}
              >
                <IconPlus size={16} color={page >= maxPage ? 'var(--gourmet-neutral-5)' : 'var(--gourmet-neutral-2)'} />
              </ActionIcon>
            </Group>
          </Group>
        )}

        <SimpleGrid cols={mobile && smallerScreen ? 2 : mobile ? 3 : 2} spacing={'0.25rem'}>
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
          padding: mobile ? '0.5rem 0' : '0.5rem 0.5rem 2.5rem 0.5rem',
        }}
      >
        <Group justify={'space-between'} p={'0 0.5rem'}>
          <Button
            onClick={() => {
              if (currentIndex === 0 && page > 1) {
                changePage('previous', true);
                onSwitch?.();
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
              onSwitch?.();
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
                changePage('next', true);
                onSwitch?.();
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
              onSwitch?.();
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
