import { Overlay } from '@mantine/core';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';

export function CardGridSelectionOverlay() {
  const isEnabled = useOverviewWorkStore((state) => state.isSelectionOverlayEnabled);

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
