import { Center, Loader, Overlay } from '@mantine/core';
import { useTcgOverviewWorkStore } from '@/parcels/selection/useTcgOverviewWorkStore.ts';

export function CardOverviewLoader({ isDisplayLoading }: { isDisplayLoading: boolean }) {
  const isSelectionModeLoading = useTcgOverviewWorkStore((state) => state.isSelectionModeLoading);

  return (
    <>
      {(isDisplayLoading || isSelectionModeLoading) && (
        <Overlay backgroundOpacity={0.75} color={'var(--gourmet-neutral-0)'}>
          <Center mt={'12rem'}>
            <Loader color={'var(--gourmet-neutral-9)'} />
          </Center>
        </Overlay>
      )}
    </>
  );
}
