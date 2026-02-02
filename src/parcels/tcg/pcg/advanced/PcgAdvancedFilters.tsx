import type { ReactNode } from 'react';

export function PcgAdvancedFilters() {
  return (
    <AdvancedFilterCategory>
      <AdvancedFilterDef />
    </AdvancedFilterCategory>
  );
}

function AdvancedFilterCategory({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function AdvancedFilterDef() {
  return <div></div>;
}
