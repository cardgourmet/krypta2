import useEmblaCarousel from 'embla-carousel-react';
import './TcgStatisticsCarousel.css';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export function TcgStatisticsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: false, delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false }),
  ]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('autoplay:timerset', () => {
      setIsTimerRunning(true);
    });
    emblaApi.on('autoplay:timerstopped', () => {
      setIsTimerRunning(false);
    });

    console.log('start playing');
    emblaApi.plugins().autoplay?.play();
  }, [emblaApi]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">Slide 1</div>
          <div className="embla__slide">Slide 2</div>
          <div className="embla__slide">Slide 3</div>
        </div>
      </div>

      <button type={'button'} className="embla__prev" onClick={scrollPrev}>
        Scroll to prev
      </button>
      <button type={'button'} className="embla__next" onClick={scrollNext}>
        Scroll to next
      </button>

      <GourmetText>is timer running: {isTimerRunning ? 'true' : 'false'}</GourmetText>
    </div>
  );
}
