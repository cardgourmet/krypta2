import { Center, Loader, Overlay } from '@mantine/core';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';

export function CardOverviewLoader({ isDisplayLoading }: { isDisplayLoading: boolean }) {
  const isSelectionModeLoading = useOverviewWorkStore((state) => state.isSelectionModeLoading);

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
