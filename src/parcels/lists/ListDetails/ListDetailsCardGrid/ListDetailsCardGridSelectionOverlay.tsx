import { Overlay } from '@mantine/core';
import { useListDetailsWorkStore } from '@/parcels/selection/useListDetailsWorkStore.tsx';

export function ListDetailsCardGridSelectionOverlay() {
  const isEnabled = useListDetailsWorkStore((state) => state.isSelectionOverlayEnabled);

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
