import { Center, Loader, Overlay } from '@mantine/core';
import { create } from 'zustand/react';

export const useSetOverviewLoaderStore = create<{ isLoading: boolean; setLoading: (b: boolean) => void }>(
  (set, get) => ({
    isLoading: false,
    setLoading: (m: boolean) => {
      const store = get();
      set({ ...store, isLoading: m });
    },
  }),
);

export function SetOverviewLoader() {
  const isLoading = useSetOverviewLoaderStore((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <Overlay backgroundOpacity={0.75} color={'var(--gourmet-neutral-0)'}>
          <Center mt={'12rem'}>
            <Loader color={'var(--gourmet-neutral-9)'} />
          </Center>
        </Overlay>
      )}
    </>
  );
}
