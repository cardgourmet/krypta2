import {
  FloatingFocusManager,
  offset,
  safePolygon,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import { Drawer, Group, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCards, IconDeviceVisionPro, IconFolders } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { MobileSidebar } from '@/parcels/homepage/Sidebar/MobileSidebar.tsx';
import { Logo } from '@/parcels/Logo.tsx';
import { DLCIcon } from '@/parcels/tcg/dlc/Icon.tsx';
import { MTGIcon } from '@/parcels/tcg/mtg/Icon.tsx';
import { PCGIcon } from '@/parcels/tcg/pcg/Icon.tsx';
import { tcgSearchParamsDefaults } from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './Sidebar.module.css';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const tcg = useTcgByLocation();
  const smallScreen = useMediaQuery('(max-width: 800px)');

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((sidebarRef.current?.offsetLeft ?? -1) < 0) return;
      if (sidebarOpen && !sidebarRef.current?.contains(event.target as Element)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setSidebarOpen, sidebarOpen]);

  const mtgCategory = useCategoryButton({ tcg: 'mtg', selectedTcg: tcg });
  const pcgCategory = useCategoryButton({ tcg: 'pcg', selectedTcg: tcg });
  const dlcCategory = useCategoryButton({ tcg: 'dlc', selectedTcg: tcg });

  return (
    <>
      <Drawer
        position={'left'}
        classNames={{
          content: styles.mobileSidebar,
        }}
        size="100%"
        opened={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        withCloseButton={false}
      >
        <MobileSidebar close={() => setSidebarOpen(false)} />
      </Drawer>

      {!smallScreen && (
        <>
          <nav className={styles.sidebar}>
            <Group classNames={{ root: styles.sidebarLogo }} justify={'center'} align={'center'} w={'100%'}>
              <Link to="/">
                <Logo height={42} width={42} style={{ color: 'var(--gourmet-neutral-9)' }} />
              </Link>
            </Group>

            <Stack gap={'1rem'}>
              {mtgCategory.button}
              {pcgCategory.button}
              {dlcCategory.button}
            </Stack>
          </nav>

          {mtgCategory.submenu}
          {pcgCategory.submenu}
          {dlcCategory.submenu}
        </>
      )}
    </>
  );
}

function useCategoryButton({ tcg, selectedTcg }: { tcg: Tcg; selectedTcg: Tcg | undefined }) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: isOpen ? 'right-start' : 'left-start', // to prevent overlap
    strategy: 'fixed',
    middleware: [offset({ mainAxis: 8, crossAxis: -34 })],
  });

  const focus = useFocus(context);
  const hover = useHover(context, {
    handleClose: safePolygon(),
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus]);

  const button = useMemo(() => {
    return (
      <div ref={refs.setReference} {...getReferenceProps()}>
        <Link
          to="/$tcg"
          params={{ tcg: tcg }}
          className={`${styles.sidebarButton}`}
          data-state={tcg === selectedTcg ? 'enabled' : 'disabled'}
        >
          {tcg === 'mtg' && <MTGIcon height={24} width={24} />}
          {tcg === 'pcg' && <PCGIcon height={24} width={24} />}
          {tcg === 'dlc' && <DLCIcon height={24} width={24} />}
        </Link>
      </div>
    );
  }, [getReferenceProps, refs.setReference, tcg, selectedTcg]);
  const submenu = useMemo(() => {
    return (
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 'calc(var(--sidebar-layer) - 1)',
          }}
          {...getFloatingProps()}
        >
          <div className={styles.submenu} data-open={isOpen}>
            <div className={styles.submenuFooter}>
              <Stack p={'0.25rem 0.5rem'} justify={'center'} align={'center'}>
                <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
                  {tcg === 'mtg' && 'Magic: The Gathering'}
                  {tcg === 'pcg' && 'Pokémon Card Game'}
                  {tcg === 'dlc' && 'Disney Lorcana'}
                </GourmetText>
              </Stack>
            </div>

            <Stack gap={'0.5rem'} p={'0.5rem 0'}>
              <Link to="/$tcg/sets" params={{ tcg: tcg }} className={styles.submenuItem}>
                <Group gap={'0.75rem'}>
                  <IconFolders size={22} />
                  <GourmetText>Sets</GourmetText>
                </Group>
              </Link>
              <Link
                to="/$tcg/cards"
                params={{ tcg: tcg }}
                className={styles.submenuItem}
                search={{ ...tcgSearchParamsDefaults }}
              >
                <Group gap={'0.75rem'}>
                  <IconCards size={22} />
                  <GourmetText>Cards</GourmetText>
                </Group>
              </Link>
              <Link to="/$tcg/advanced" params={{ tcg: tcg }} className={styles.submenuItem}>
                <Group gap={'0.75rem'}>
                  <IconDeviceVisionPro size={22} />
                  <GourmetText>Advanced Search</GourmetText>
                </Group>
              </Link>
            </Stack>
          </div>
        </div>
      </FloatingFocusManager>
    );
  }, [floatingStyles, getFloatingProps, isOpen, refs.setFloating, tcg, context, refs]);

  return { button, submenu };
}
