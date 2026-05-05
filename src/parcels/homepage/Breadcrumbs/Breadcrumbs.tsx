import {Group, Stack} from '@mantine/core';
import {IconChefHat, IconSlash} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './Breadcrumbs.module.css';

export type BreadcrumbProps = {
  subpage: string;
  subpageHref?: string;
  moreSubpages?: { label: string; href?: string }[];
  withoutTitle?: boolean;
};

export default function Breadcrumbs({ subpage, subpageHref, moreSubpages, withoutTitle }: BreadcrumbProps) {
  const tcg = useTcgByLocation();
  const subpages = [...(moreSubpages ?? [])];
  if (subpage.length > 0) {
    subpages.unshift({ label: subpage, href: subpageHref });
  }

  const currentPage = subpages.length === 1 ? subpages[0] : subpages[subpages.length - 1];

  return (
    <Stack gap={'0'}>
      <Group className={styles.breadcrumb} gap={'0'}>
        <Link to="/">
          <Group>
            <IconChefHat color="var(--gourmet-neutral-6)" size={22} className={styles.homeButton} />
          </Group>
        </Link>
        {tcg && (
          <Group gap={'0'}>
            <IconSlash color="var(--gourmet-neutral-6)" size={18} style={{ margin: '0 0.25rem' }} />
            <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
              {tcg === 'dlc' && 'Disney Lorcana'}
              {tcg === 'pcg' && 'Pokémon Card Game'}
              {tcg === 'mtg' && 'Magic: The Gathering'}
            </GourmetText>
          </Group>
        )}
        {subpages.slice(0, subpages.length - 1).map(({ label, href }) => {
          return (
            <div key={label}>
              {href && (
                <Group gap={'0'}>
                  <IconSlash color="var(--gourmet-neutral-6)" size={18} style={{ margin: '0 0.25rem' }} />
                  <Link to={href}>
                    <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
                      {label}
                    </GourmetText>
                  </Link>
                </Group>
              )}
              {!href && (
                <Group gap={'0'}>
                  <IconSlash color="var(--gourmet-neutral-6)" size={18} style={{ margin: '0 0.25rem' }} />
                  <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
                    {label}
                  </GourmetText>
                </Group>
              )}
            </div>
          );
        })}
      </Group>
      {withoutTitle !== true && (
        <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'h2'} fw={'500'} lh={'1.25'}>
          {currentPage?.label}
        </GourmetText>
      )}
    </Stack>
  );
}
