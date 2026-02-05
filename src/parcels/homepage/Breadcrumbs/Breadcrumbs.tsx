import { IconChefHat, IconChevronRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './Breadcrumbs.module.css';

export type BreadcrumbProps = {
  subpage: string;
  moreSubpages?: string[];
};

export default function Breadcrumbs({ subpage, moreSubpages }: BreadcrumbProps) {
  const tcg = useTcgByLocation() as Tcg;
  const subpages = [subpage, ...(moreSubpages ?? [])];

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
      {subpages.map((subpage) => {
        return (
          <div key={subpage}>
            <IconChevronRight color="var(--gourmet-neutral-6)" size={18} />
            <p>{subpage}</p>
          </div>
        );
      })}
    </div>
  );
}
