import { IconChefHat, IconChevronRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './Breadcrumbs.module.css';

export type BreadcrumbProps = {
  subpage: string;
  moreSubpages?: { label: string; href?: string }[];
};

export default function Breadcrumbs({ subpage, moreSubpages }: BreadcrumbProps) {
  const tcg = useTcgByLocation() as Tcg;
  const subpages = [...(moreSubpages ?? [])];
  if (subpage.length > 0) {
    subpages.unshift({ label: subpage });
  }

  return (
    <div className={styles.breadcrumb}>
      <Link to="/">
        <IconChefHat color="var(--gourmet-neutral-6)" size={22} className={styles.homeButton} />
      </Link>
      <IconChevronRight color="var(--gourmet-neutral-6)" size={18} />
      <p>
        {tcg === 'dlc' && 'Disney Lorcana'}
        {tcg === 'pcg' && 'Pokémon Card Game'}
        {tcg === 'mtg' && 'Magic: The Gathering'}
      </p>
      {subpages.map(({ label, href }) => {
        return (
          <div key={label}>
            {href && (
              <>
                <IconChevronRight color="var(--gourmet-neutral-6)" size={18} />
                <Link to={href}>
                  <p>{label}</p>
                </Link>
              </>
            )}
            {!href && (
              <div>
                <IconChevronRight color="var(--gourmet-neutral-6)" size={18} />
                <p>{label}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
