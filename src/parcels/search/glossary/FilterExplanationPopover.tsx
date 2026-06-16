import { Popover, ScrollArea } from '@mantine/core';
import { type PropsWithChildren, useMemo } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useFilters } from '@/parcels/search/filter/useFilters.ts';
import { FilterGlossaryDetails } from '@/parcels/search/glossary/FilterGlossaryModal.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function FilterExplanationPopover({ tcg, filter, children }: PropsWithChildren<{ tcg: Tcg; filter: string }>) {
  const filters = useFilters(tcg);
  const thisFilter = useMemo(() => {
    return filters.find((f) => f.filter.keywords.includes(filter));
  }, [filters, filter]);

  return (
    <Popover position={'top'} width={300} withArrow>
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        {thisFilter && (
          <ScrollArea h={200} offsetScrollbars scrollbarSize={4}>
            <FilterGlossaryDetails f={thisFilter} />
          </ScrollArea>
        )}
        {!thisFilter && (
          <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
            No filter info found
          </GourmetText>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}
