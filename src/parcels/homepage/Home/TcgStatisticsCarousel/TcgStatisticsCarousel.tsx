import useEmblaCarousel from 'embla-carousel-react';
import './embla.css';
import { Group, Stack, UnstyledButton } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { type CSSProperties, useEffect, useState } from 'react';
import { useLanguage } from '@/parcels/auth/useLanguage.tsx';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { SetCard } from '@/parcels/overview/sets/SetCard/SetCard.tsx';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg.ts';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './TcgStatisticsCarousel.module.css';

const AUTOPLAY_DELAY_MS = 10_000; // 10 seconds

export function TcgStatisticsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      playOnInit: false,
      delay: AUTOPLAY_DELAY_MS,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    }),
  ]);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSnap, setCurrentSnap] = useState<number>(0);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('autoplay:timerset', () => {
      setIsTimerRunning(true);
      setCurrentSnap(emblaApi?.selectedScrollSnap());
    });
    emblaApi.on('autoplay:timerstopped', () => {
      setIsTimerRunning(false);
    });

    console.log('start playing');
    emblaApi.plugins().autoplay?.play();
  }, [emblaApi]);

  return (
    <Stack>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <TcgStatisticsSlide tcg={'mtg'} />
          </div>
          <div className="embla__slide">
            <TcgStatisticsSlide tcg={'pcg'} />
          </div>
          <div className="embla__slide">
            <TcgStatisticsSlide tcg={'dlc'} />
          </div>
        </div>
      </div>

      <Group justify={'center'} gap={'0.5rem'}>
        {['mtg', 'pcg', 'dlc'].map((_, index) => {
          return (
            <UnstyledButton
              key={index}
              onClick={() => {
                scrollTo(index);
                emblaApi?.plugins()?.autoplay?.reset();
                setCurrentSnap(index);
              }}
              className={styles.slideButton}
              style={getSlideButtonStyle(AUTOPLAY_DELAY_MS)}
              data-active={index === currentSnap}
              data-running={isTimerRunning}
            />
          );
        })}
      </Group>
    </Stack>
  );
}

function getSlideButtonStyle(durationMs: number): CSSProperties {
  return {
    '--slide-button-fill-duration': `${durationMs}ms`,
  } as CSSProperties;
}

type TcgStats = {
  prints: number;
  cards: number;
  sets: number;
  latestSet?: TcgDataSet;
};

function TcgStatisticsSlide({ tcg }: { tcg: Tcg }) {
  const [lang] = useLanguage();
  const locale = lang === 'de' ? 'de-DE' : 'en-US';

  const stats = tcgStats[tcg];

  return (
    <Stack p={'0.5rem'}>
      <Group mb={'0.5rem'}>
        <TcgIcon tcg={tcg} color={'var(--gourmet-blue-1)'} />
        <GourmetText cgmff={'title'} fz={'1.1rem'} fw={500} c={'var(--gourmet-blue-1)'}>
          {getNameByTcg(tcg)}
        </GourmetText>
      </Group>

      <Stack>
        <Group>
          <Stack gap={'0'}>
            <GourmetText cgmff={'ui'} fz={'0.9rem'} fw={500}>
              PRINTS
            </GourmetText>
            <GourmetText cgmff={'monospace'} fz={'1.75rem'} fw={'bold'}>
              {Intl.NumberFormat(locale).format(stats.prints)}
            </GourmetText>
          </Stack>

          <Stack gap={'0'}>
            <GourmetText cgmff={'ui'} fz={'0.9rem'} fw={500}>
              CARDS
            </GourmetText>
            <GourmetText cgmff={'monospace'} fz={'1.75rem'} fw={'bold'}>
              {Intl.NumberFormat(locale).format(stats.cards)}
            </GourmetText>
          </Stack>

          <Stack gap={'0'}>
            <GourmetText cgmff={'ui'} fz={'0.9rem'} fw={500}>
              SETS
            </GourmetText>
            <GourmetText cgmff={'monospace'} fz={'1.75rem'} fw={'bold'}>
              {Intl.NumberFormat(locale).format(stats.sets)}
            </GourmetText>
          </Stack>
        </Group>

        <Stack>
          <GourmetText cgmff={'ui'} fz={'0.9rem'} fw={500}>
            MOST RECENT SET
          </GourmetText>

          <SetCard set={stats.latestSet!} tcg={tcg} />
        </Stack>
      </Stack>
    </Stack>
  );
}

const tcgStats: Record<Tcg, TcgStats> = {
  mtg: {
    prints: 90_997,
    cards: 32_885,
    sets: 1_007,
    latestSet: {
      id: '7f70af4d-08a3-4714-a9b3-55e52f0588e0',
      code: 'TMT',
      type: 'expansion',
      isTokenSet: false,
      translations: {
        en: {
          name: 'Teenage Mutant Ninja Turtles',
        },
      },
      releaseDate: '2026-03-06',
      subsetIds: [],
      printsAvailable: 20,
      relatedQueries: [],
    },
  },
  pcg: {
    prints: 20_288,
    cards: 13_938,
    sets: 495,
    latestSet: {
      id: '90ed5ca6-c1dd-4172-ae9b-dbcf3bac09e2',
      eraId: '70de74d8-80a6-45b3-bddb-6db33793c80d',
      eraReference: {
        id: '70de74d8-80a6-45b3-bddb-6db33793c80d',
        name: '',
      },
      region: 'int',
      code: 'DRI',
      type: 'main_expansion',
      publicPrints: 244,
      prints: 244,
      printsAvailable: 244,
      releaseStartDate: '2025-05-30',
      releaseEndDate: '2025-05-30',
      translations: {
        de: {
          id: '795a5233-933d-40b5-8d18-4e4f892b3965',
          name: 'Ewige Rivalen',
        },
        en: {
          id: 'fca5ae44-105b-4628-949d-491099f96132',
          name: 'Destined Rivals',
        },
        es: {
          id: '86e21b9c-3581-4337-bdf7-fdadd375d7ce',
          name: 'Rivales Predestinados',
        },
        fr: {
          id: '1cf8e657-4be7-4e36-a83f-52ce82c08f98',
          name: 'Rivalités Destinées',
        },
        it: {
          id: 'f64fd5de-19ce-4559-b7cb-e5fb13bd7ca2',
          name: 'Rivali Predestinati',
        },
        pt: {
          id: 'b3823545-7c42-4a38-b20e-98cb47259652',
          name: 'Rivais Predestinados',
        },
      },
      relatedQueries: [],
    },
  },
  dlc: {
    prints: 1_929,
    cards: 1_707,
    sets: 14,
    latestSet: {
      id: 'ed0177fa-03c9-45ac-b432-e5d446757be2',
      code: '8',
      type: 'expansion',
      translations: {
        en: {
          id: '22f10100-3396-4c72-9848-bf4d7fc34e48',
          name: 'Reign of Jafar',
          imageUrls: {
            logo: 'https://sets.cardgourmet.com/dlc/f/4/f4e77073-c0c0-42de-b01e-b90e87bf6e71',
          },
        },
      },
      releaseDate: '2025-05-30',
      marketReleaseDate: '2025-05-30',
      printsAvailable: 221,
      relatedQueries: [],
    },
  },
};
