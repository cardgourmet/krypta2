import { useMemo } from 'react';
import Breadcrumbs, { type BreadcrumbProps } from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';

export function useBreadcrumbs({ subpage, subpageHref, moreSubpages }: BreadcrumbProps) {
  const currentTitle = useMemo(() => {
    const subpages = [...(moreSubpages ?? [])];
    if (subpage.length > 0) {
      subpages.unshift({ label: subpage });
    }

    return subpages.length === 1 ? subpages[0] : subpages[subpages.length - 1];
  }, [moreSubpages, subpage]);

  return {
    component: (
      <Breadcrumbs subpage={subpage} subpageHref={subpageHref} moreSubpages={moreSubpages} withoutTitle={true} />
    ),
    title: currentTitle,
  };
}
