import { Overlay } from '@mantine/core';
import { useTcgOverviewWorkStore } from '@/parcels/selection/useTcgOverviewWorkStore.ts';

export function CardGridSelectionOverlay() {
  const isEnabled = useTcgOverviewWorkStore((state) => state.isSelectionOverlayEnabled);

  return (
    <>
      {isEnabled && (
        <Overlay
          backgroundOpacity={0.4}
          color={'var(--gourmet-neutral-0)'}
          style={{ pointerEvents: 'none' }}
          zIndex={0}
        />
      )}
    </>
  );
}
