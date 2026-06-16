import useEmblaCarousel from 'embla-carousel-react';
import './embla.css';
import { Group, Stack, UnstyledButton } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { type CSSProperties, useEffect, useState } from 'react';
import { TcgStatisticsSlide } from '@/parcels/homepage/Home/TcgStatisticsCarousel/TcgStatisticsSlide.tsx';
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
